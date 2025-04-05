
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
import { Patient, PatientMetrics } from '@/utils/mockData';
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";

interface ReportGeneratorProps {
  patient: Patient;
  metrics: PatientMetrics;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ patient, metrics }) => {
  const [reportType, setReportType] = useState('clinical');
  const [includeSections, setIncludeSections] = useState({
    overview: true,
    domainAnalysis: true,
    trends: true,
    recommendations: true,
    rawData: false,
  });
  
  const today = format(new Date(), 'MMMM d, yyyy');
  
  const handleCheckboxChange = (key: keyof typeof includeSections) => {
    setIncludeSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "The report has been generated successfully.",
    });
  };
  
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg">Generate Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label className="text-muted-foreground mb-2 block">Report Template</Label>
          <Select value={reportType} onValueChange={setReportType}>
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
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
