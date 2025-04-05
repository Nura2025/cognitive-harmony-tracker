
import React from 'react';
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
import { Eye, Download, Share2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReportType } from '@/utils/types/patientTypes';
import { format, parseISO } from 'date-fns';
import { toast } from "@/hooks/use-toast";

interface PatientReportsProps {
  reports: ReportType[];
  onViewReport?: (report: ReportType) => void;
}

export const PatientReports: React.FC<PatientReportsProps> = ({ 
  reports, 
  onViewReport 
}) => {
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

  const handleDownload = (report: ReportType) => {
    toast({
      title: "Download started",
      description: `${report.title} will download shortly.`,
    });
  };

  const handleShare = (report: ReportType) => {
    toast({
      title: "Share report",
      description: "Sharing options will be available soon.",
    });
  };

  return (
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
                        onClick={() => onViewReport && onViewReport(report)}
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
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Share Report"
                        onClick={() => handleShare(report)}
                      >
                        <Share2 className="h-4 w-4" />
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
  );
};
