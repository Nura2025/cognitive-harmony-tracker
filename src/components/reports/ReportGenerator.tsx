import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  FileText, 
  LayoutTemplate, 
  Mail, 
  Printer
} from 'lucide-react';
import { Patient, PatientMetrics, ReportType } from '@/utils/types/patientTypes';
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Import the libraries for PDF generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportGeneratorProps {
  patient: Patient;
  metrics: PatientMetrics;
  onReportGenerate?: (report: ReportType) => void;
  onSendEmail?: (recipient: string, subject: string, message: string, reportData: any) => Promise<boolean>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ 
  patient, 
  metrics,
  onReportGenerate,
  onSendEmail
}) => {
  
  const [reportType, setReportType] = useState<ReportType['type']>('clinical');
  const [includeSections, setIncludeSections] = useState({
    overview: true,
    domainAnalysis: true,
    trends: true,
    recommendations: true,
    rawData: false,
  });
  
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [generatedReport, setGeneratedReport] = useState<ReportType | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  const today = format(new Date(), 'MMMM d, yyyy');
  
  const handleCheckboxChange = (key: keyof typeof includeSections) => {
    setIncludeSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleGenerateReport = () => {
    // Create a new report object
    const newReport: ReportType = {
      id: uuidv4(),
      patientId: patient.user_id,
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      type: reportType,
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      sections: {...includeSections},
      status: 'generated'
    };
    
    // Store the generated report
    setGeneratedReport(newReport);
    
    // Call the callback if provided
    if (onReportGenerate) {
      onReportGenerate(newReport);
    }
    
    toast({
      title: "Report Generated",
      description: "The report has been generated successfully.",
    });
  };

  const handleSaveReport = async () => {
    if (!generatedReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    // Create a temporary container for the report content
    const reportContainer = document.createElement('div');
    reportContainer.style.padding = '20px';
    reportContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Build report HTML content
    reportContainer.innerHTML = `
      <h1 style="color:#333;">${patient.name} - ${reportType} Report</h1>
      <p style="color:#666;font-style:italic;">Generated on ${today}</p>
      
      ${includeSections.overview ? `
        <div style="margin-bottom:20px;">
          <h2 style="color:#333;">Patient Overview</h2>
          <p>Patient: ${patient.name}</p>
          <p>Gender: ${patient.gender}</p>
          <p>Age: ${patient.age}</p>
        </div>
      ` : ''}
      
      ${includeSections.domainAnalysis ? `
        <div style="margin-bottom:20px;">
          <h2 style="color:#333;">Cognitive Domain Analysis</h2>
          <div>
            <div style="margin-bottom:10px;">
              <span style="font-weight:bold;">Attention: </span>${metrics.attention}%
            </div>
            <div style="margin-bottom:10px;">
              <span style="font-weight:bold;">Memory: </span>${metrics.memory}%
            </div>
            <div style="margin-bottom:10px;">
              <span style="font-weight:bold;">Executive Function: </span>${metrics.executiveFunction}%
            </div>
            <div style="margin-bottom:10px;">
              <span style="font-weight:bold;">Behavioral: </span>${metrics.behavioral}%
            </div>
          </div>
        </div>
      ` : ''}
      
      ${includeSections.trends ? `
        <div style="margin-bottom:20px;">
          <h2 style="color:#333;">Performance Trends</h2>
          <p>Sessions Completed: ${metrics.sessionsCompleted}</p>
          <p>Progress: ${metrics.progress}%</p>
        </div>
      ` : ''}
      
      ${includeSections.recommendations ? `
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
      
      ${includeSections.rawData ? `
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
    
    try {
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
      pdf.save(`${patient.name.replace(/\s+/g, '_')}_${reportType}_report.pdf`);
      
      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clean up
      document.body.removeChild(reportContainer);
    }
  };

  const handlePrintReport = () => {
    if (!generatedReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would use a proper print API or library
    // For this demo, we'll simulate printing with the browser print dialog
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${patient.name} - ${reportType} Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .section { margin-bottom: 20px; }
              .metrics { margin-top: 15px; }
              .metric { margin-bottom: 10px; }
              .label { font-weight: bold; }
              .date { color: #666; font-style: italic; }
            </style>
          </head>
          <body>
            <h1>${patient.name} - ${reportType} Report</h1>
            <p class="date">Generated on ${today}</p>
            
            ${includeSections.overview ? `
              <div class="section">
                <h2>Patient Overview</h2>
                <p>Patient: ${patient.name}</p>
                <p>Gender: ${patient.gender}</p>
                <p>Age: ${patient.age}</p>
              </div>
            ` : ''}
            
            ${includeSections.domainAnalysis ? `
              <div class="section">
                <h2>Cognitive Domain Analysis</h2>
                <div class="metrics">
                  <div class="metric">
                    <span class="label">Attention: </span>${metrics.attention}%
                  </div>
                  <div class="metric">
                    <span class="label">Memory: </span>${metrics.memory}%
                  </div>
                  <div class="metric">
                    <span class="label">Executive Function: </span>${metrics.executiveFunction}%
                  </div>
                  <div class="metric">
                    <span class="label">Behavioral: </span>${metrics.behavioral}%
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${includeSections.trends ? `
              <div class="section">
                <h2>Performance Trends</h2>
                <p>Sessions Completed: ${metrics.sessionsCompleted}</p>
                <p>Progress: ${metrics.progress}%</p>
              </div>
            ` : ''}
            
            ${includeSections.recommendations ? `
              <div class="section">
                <h2>Clinical Recommendations</h2>
                <p>Based on the assessment results, the following recommendations are provided:</p>
                <ul>
                  <li>Continue regular cognitive assessments</li>
                  <li>Focus on exercises that target executive function</li>
                  <li>Consider strategies for enhancing attention span</li>
                </ul>
              </div>
            ` : ''}
            
            ${includeSections.rawData ? `
              <div class="section">
                <h2>Raw Assessment Data</h2>
                <p>Detailed raw data from assessments is available upon request.</p>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }
    
    toast({
      title: "Print Dialog Opened",
      description: "Your report is ready to print.",
    });
  };

  const openEmailDialog = () => {
    if (!generatedReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }
    
    setEmailRecipient('');
    setEmailSubject(`${patient.name}'s ${reportType} Report - ${today}`);
    setEmailMessage(`Please find attached the ${reportType} report for ${patient.name} generated on ${today}.`);
    setEmailDialogOpen(true);
  };

  const handleSendEmail = async () => {
    if (!onSendEmail) {
      toast({
        title: "Email Function Not Available",
        description: "Email functionality is not available in this context.",
        variant: "destructive",
      });
      setEmailDialogOpen(false);
      return;
    }
    
    if (!emailRecipient) {
      toast({
        title: "Email Required",
        description: "Please enter a recipient email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSendingEmail(true);
    
    // Create report data object to send
    const reportData = {
      patient: {
        name: patient.name,
        id: patient.user_id,
        gender: patient.gender,
        age: patient.age
      },
      reportType,
      sections: includeSections,
      metrics,
      generatedDate: today
    };
    
    try {
      const success = await onSendEmail(
        emailRecipient, 
        emailSubject, 
        emailMessage, 
        reportData
      );
      
      if (success) {
        toast({
          title: "Email Request Processed",
          description: `Email to ${emailRecipient} has been processed.`,
        });
        setEmailDialogOpen(false);
      }
    } catch (error) {
      console.error("Error in email sending:", error);
      toast({
        title: "Email Failed",
        description: "There was an error processing your email request.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="text-muted-foreground mb-2 block">Report Template</Label>
            <Select value={reportType} onValueChange={(value: ReportType['type']) => setReportType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinical">Clinical Report</SelectItem>
                <SelectItem value="school">School Accommodation</SelectItem>
                <SelectItem value="progress">Progress Summary</SelectItem>
                <SelectItem value="detailed">Detailed Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <Label className="text-muted-foreground mb-2 block">Include Sections</Label>
            <div className="space-y-2.5">
              {Object.entries(includeSections).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={key} 
                    checked={checked}
                    onCheckedChange={() => handleCheckboxChange(key as keyof typeof includeSections)}
                  />
                  <Label htmlFor={key} className="text-sm cursor-pointer">
                    {formatSectionName(key)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg border border-border mb-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Report Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report for {patient.name} - {today}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={handleGenerateReport} className="w-full gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Generate Report
            </Button>
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleSaveReport}>
                <Download className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={handlePrintReport}>
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={openEmailDialog}>
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Report</DialogTitle>
            <DialogDescription>
              Send the {reportType} report to the recipient's email address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                placeholder="recipient@example.com"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={3}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSendEmail} 
              disabled={!emailRecipient || isSendingEmail}
            >
              {isSendingEmail ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper function to format section names
const formatSectionName = (key: string): string => {
  switch (key) {
    case 'overview':
      return 'Patient Overview';
    case 'domainAnalysis':
      return 'Cognitive Domain Analysis';
    case 'trends':
      return 'Performance Trends';
    case 'recommendations':
      return 'Clinical Recommendations';
    case 'rawData':
      return 'Raw Assessment Data';
    default:
      return key;
  }
};
