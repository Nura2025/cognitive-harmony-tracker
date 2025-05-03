
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportType } from '@/utils/types/patientTypes';

interface ReportVisualizationsProps {
  report: ReportType;
  patientId: string;
  patientName: string;
}

const ReportVisualizations: React.FC<ReportVisualizationsProps> = ({
  report,
  patientId,
  patientName
}) => {
  // Format data for charts
  const performanceData = [
    { name: 'Attention', score: report.metrics.attention },
    { name: 'Memory', score: report.metrics.memory },
    { name: 'Executive', score: report.metrics.executiveFunction },
    { name: 'Behavioral', score: report.metrics.behavioral },
  ];
  
  const progressData = [
    { name: 'Week 1', score: 65 },
    { name: 'Week 2', score: 68 },
    { name: 'Week 3', score: 72 },
    { name: 'Week 4', score: report.metrics.percentile },
  ];

  const domainData = performanceData.map(item => ({
    subject: item.name,
    A: item.score,
    fullMark: 100,
  }));

  // Generate PDF report
  const generatePDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.setFontSize(18);
      pdf.text(`Cognitive Report: ${patientName}`, 14, 22);
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`report_${patientId}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">{report.title}</h3>
          <p className="text-muted-foreground">
            {new Date(report.date).toLocaleDateString()} • Patient ID: {patientId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={printReport}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button size="sm" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report content */}
      <div id="report-content" className="space-y-6">
        {/* Patient info */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Patient</h4>
                <p className="text-base">{patientName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Report Type</h4>
                <p className="text-base">{report.type}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Sessions Completed</h4>
                <p className="text-base">{report.metrics.sessionsCompleted}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Total Duration</h4>
                <p className="text-base">{report.metrics.sessionsDuration} minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization tabs */}
        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="domains">Cognitive Domains</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Percentile score */}
                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {typeof report.metrics.percentile === 'number' 
                        ? report.metrics.percentile.toFixed(1)
                        : report.metrics.percentile}%
                    </div>
                    <p className="text-muted-foreground">Percentile Ranking</p>
                  </div>

                  {/* Progress */}
                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                    <div className="text-4xl font-bold text-green-500 mb-2">
                      +{report.metrics.progress}%
                    </div>
                    <p className="text-muted-foreground">Progress Since Last Assessment</p>
                  </div>

                  {/* Report description */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="font-semibold mb-2">Assessment Summary</h4>
                    <p className="text-muted-foreground">{report.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Performance Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#5EF38C" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cognitive Domains Tab */}
          <TabsContent value="domains">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Cognitive Domain Matrix</h4>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart outerRadius={90} data={domainData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#5EF38C"
                      fill="#5EF38C"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {performanceData.map((domain) => (
                    <div key={domain.name} className="border rounded p-4">
                      <h5 className="font-medium">{domain.name}</h5>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${domain.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{domain.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportVisualizations;
