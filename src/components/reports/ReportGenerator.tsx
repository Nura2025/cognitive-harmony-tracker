
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
  Printer, 
  Share2
} from 'lucide-react';
import { Patient, PatientMetrics, ReportType } from '@/utils/types/patientTypes';
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ReportGeneratorProps {
  patient: Patient;
  metrics: PatientMetrics;
  onReportGenerate?: (report: ReportType) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ 
  patient, 
  metrics,
  onReportGenerate
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

  const handleSaveReport = () => {
    if (!generatedReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    // Create a dummy blob for the PDF download
    // In a real application, this would be generated from actual report content
    const reportContent = `
      ${patient.name} - ${reportType} Report
      Date: ${today}
      
      ${includeSections.overview ? 'Patient Overview: Included' : ''}
      ${includeSections.domainAnalysis ? 'Cognitive Domain Analysis: Included' : ''}
      ${includeSections.trends ? 'Performance Trends: Included' : ''}
      ${includeSections.recommendations ? 'Clinical Recommendations: Included' : ''}
      ${includeSections.rawData ? 'Raw Assessment Data: Included' : ''}
    `;
    
    const blob = new Blob([reportContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${patient.name.replace(/\s+/g, '_')}_${reportType}_report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your report has been downloaded successfully.",
    });
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

  const handleSendEmail = () => {
    // In a real application, this would call an API to send the email
    // For now, we'll just simulate success
    toast({
      title: "Email Sent",
      description: `Report sent to ${emailRecipient} successfully.`,
    });
    setEmailDialogOpen(false);
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
            <Button type="button" onClick={handleSendEmail} disabled={!emailRecipient}>
              Send Email
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
