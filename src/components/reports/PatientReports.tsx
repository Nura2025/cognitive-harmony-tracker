
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReportType } from '@/utils/types/patientTypes';
import { format, parseISO } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PatientReportsProps {
  reports: ReportType[];
  onViewReport?: (report: ReportType) => void;
}

export const PatientReports: React.FC<PatientReportsProps> = ({ 
  reports, 
  onViewReport 
}) => {
  const [viewingReport, setViewingReport] = useState<ReportType | null>(null);

  const getStatusColor = (status: ReportType['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'generated':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'shared':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getReportTypeLabel = (type: ReportType['type']) => {
    switch (type) {
      case 'clinical':
        return 'Clinical';
      case 'school':
        return 'School Accommodation';
      case 'progress':
        return 'Progress Summary';
      case 'detailed':
        return 'Detailed Analysis';
      default:
        return 'Unknown';
    }
  };

  const handleViewReport = (report: ReportType) => {
    setViewingReport(report);
    if (onViewReport) {
      onViewReport(report);
    }
  };

  const handleDownload = async (report: ReportType) => {
    try {
      toast({
        title: "Preparing download",
        description: `${report.title} is being prepared...`,
      });
      
      // Create a temporary container for the report content
      const reportContainer = document.createElement('div');
      reportContainer.style.padding = '20px';
      reportContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Build report HTML content
      reportContainer.innerHTML = `
        <h1 style="color:#333;">${report.title}</h1>
        <p style="color:#666;font-style:italic;">Generated on ${format(parseISO(report.createdDate), 'MMMM d, yyyy')}</p>
        
        ${report.sections.overview ? `
          <div style="margin-bottom:20px;">
            <h2 style="color:#333;">Patient Overview</h2>
            <p>This report contains an overview of the patient's performance and progress.</p>
          </div>
        ` : ''}
        
        ${report.sections.domainAnalysis ? `
          <div style="margin-bottom:20px;">
            <h2 style="color:#333;">Cognitive Domain Analysis</h2>
            <p>Analysis of cognitive domains including attention, memory, executive function, and behavioral aspects.</p>
          </div>
        ` : ''}
        
        ${report.sections.trends ? `
          <div style="margin-bottom:20px;">
            <h2 style="color:#333;">Performance Trends</h2>
            <p>Analysis of patient's performance trends over time across multiple sessions.</p>
          </div>
        ` : ''}
        
        ${report.sections.recommendations ? `
          <div style="margin-bottom:20px;">
            <h2 style="color:#333;">Clinical Recommendations</h2>
            <p>Based on the assessment results, the following recommendations are provided:</p>
            <ul>
              <li>Continue regular cognitive assessments</li>
              <li>Focus on exercises that target executive function</li>
              <li>Consider strategies for enhancing attention span</li>
            </ul>
          </div>
        ` : ''}
        
        ${report.sections.rawData ? `
          <div style="margin-bottom:20px;">
            <h2 style="color:#333;">Raw Assessment Data</h2>
            <p>Detailed raw data from assessments is available upon request.</p>
          </div>
        ` : ''}
      `;
      
      // Append to document body temporarily (hidden)
      reportContainer.style.position = 'absolute';
      reportContainer.style.left = '-9999px';
      document.body.appendChild(reportContainer);
      
      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(reportContainer, {scale: 2});
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${report.title.replace(/\s+/g, '_')}_${format(parseISO(report.createdDate), 'yyyy-MM-dd')}.pdf`);
      
      // Clean up
      document.body.removeChild(reportContainer);
      
      toast({
        title: "Download complete",
        description: `${report.title} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download failed",
        description: "Failed to generate the report PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeReportView = () => {
    setViewingReport(null);
  };

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Patient Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports generated yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{getReportTypeLabel(report.type)}</TableCell>
                    <TableCell>{format(parseISO(report.createdDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(report.status)} capitalize`}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="View Report"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Download Report"
                          onClick={() => handleDownload(report)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Report Viewing Dialog */}
      <Dialog open={!!viewingReport} onOpenChange={closeReportView}>
        {viewingReport && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{viewingReport.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={`${getStatusColor(viewingReport.status)} capitalize`}>
                    {viewingReport.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created on {format(parseISO(viewingReport.createdDate), 'MMMM d, yyyy')}
                  </span>
                </div>

                <div className="border-t pt-4 mt-2">
                  {viewingReport.sections.overview && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Patient Overview</h3>
                      <p className="text-muted-foreground">
                        This report contains an overview of the patient's performance and progress.
                      </p>
                    </div>
                  )}
                  
                  {viewingReport.sections.domainAnalysis && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Cognitive Domain Analysis</h3>
                      <p className="text-muted-foreground">
                        Analysis of cognitive domains including attention, memory, executive function, and behavioral aspects.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Attention</span>
                          <span className="text-xl font-semibold">75%</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Memory</span>
                          <span className="text-xl font-semibold">65%</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Executive</span>
                          <span className="text-xl font-semibold">80%</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Behavioral</span>
                          <span className="text-xl font-semibold">70%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {viewingReport.sections.trends && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Performance Trends</h3>
                      <p className="text-muted-foreground">
                        Analysis of patient's performance trends over time across multiple sessions.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Sessions Completed</span>
                          <span className="text-xl font-semibold">12</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Progress</span>
                          <span className="text-xl font-semibold">8%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {viewingReport.sections.recommendations && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Clinical Recommendations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Continue regular cognitive assessments</li>
                        <li>Focus on exercises that target executive function</li>
                        <li>Consider strategies for enhancing attention span</li>
                        <li>Schedule follow-up evaluation in 3 months</li>
                      </ul>
                    </div>
                  )}
                  
                  {viewingReport.sections.rawData && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Raw Assessment Data</h3>
                      <p className="text-muted-foreground">
                        Detailed raw data from assessments is available upon request.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeReportView}>Close</Button>
              <Button onClick={() => handleDownload(viewingReport)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
