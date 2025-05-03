
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ReportType } from '@/utils/types/patientTypes';
import { format } from 'date-fns';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Download, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportVisualizationsProps {
  report: ReportType;
  patientId: string;
  patientName: string;
}

export const ReportVisualizations: React.FC<ReportVisualizationsProps> = ({ 
  report, 
  patientId, 
  patientName 
}) => {
  const [activeTab, setActiveTab] = useState('charts');
  
  // Mock data - in real app would be retrieved from API based on patientId
  const mockSessionData = Array.from({ length: 12 }, (_, i) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - (11 - i) * 7); // Every week
    
    return {
      date: format(baseDate, 'MMM dd'),
      attention: 40 + Math.random() * 40,
      memory: 35 + Math.random() * 50,
      executive: 30 + Math.random() * 60,
      behavioral: 45 + Math.random() * 35,
    };
  });
  
  const mockPerformanceData = [
    { name: 'Attention', score: 75, fill: 'hsl(var(--cognitive-attention))' },
    { name: 'Memory', score: 65, fill: 'hsl(var(--cognitive-memory))' },
    { name: 'Executive', score: 80, fill: 'hsl(var(--cognitive-executive))' },
    { name: 'Behavioral', score: 70, fill: 'hsl(var(--cognitive-behavioral))' },
  ];
  
  const mockComparisonData = [
    { domain: 'Attention', patient: 75, normative: 65, subtype: 50 },
    { domain: 'Memory', patient: 65, normative: 70, subtype: 45 },
    { domain: 'Executive', patient: 80, normative: 60, subtype: 55 },
    { domain: 'Behavioral', patient: 70, normative: 68, subtype: 48 },
    { domain: 'Processing', patient: 72, normative: 65, subtype: 50 },
  ];

  const mockErrorRates = Array.from({ length: 12 }, (_, i) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - (11 - i) * 7); // Every week
    
    return {
      date: format(baseDate, 'MMM dd'),
      commission: Math.floor(Math.random() * 8),
      omission: Math.floor(Math.random() * 6),
    };
  });

  const mockResponseTime = Array.from({ length: 12 }, (_, i) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - (11 - i) * 7); // Every week
    
    return {
      date: format(baseDate, 'MMM dd'),
      time: 0.2 + Math.random() * 0.8,
    };
  });
  
  const handleDownloadPDF = async () => {
    const reportContainer = document.getElementById('report-container');
    
    if (!reportContainer) {
      toast({
        title: "Export Failed",
        description: "Could not find report content to export",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Preparing Report",
      description: "Please wait while we generate your PDF...",
    });
    
    try {
      const canvas = await html2canvas(reportContainer, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${patientName.replace(/\s+/g, '_')}_${report.type}_report.pdf`);
      
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
    }
  };

  const handlePrintReport = () => {
    window.print();
    
    toast({
      title: "Print Dialog Opened",
      description: "Your report is ready to print.",
    });
  };
  
  return (
    <div id="report-container" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm text-muted-foreground">
            Report generated on {format(new Date(report.createdDate), 'MMMM d, yyyy')}
          </h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handlePrintReport} className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button size="sm" onClick={handleDownloadPDF} className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This report provides a comprehensive assessment of cognitive performance across different domains
            including attention, memory, executive function, and behavioral control. The data presented
            is based on {mockSessionData.length} sessions over a {mockSessionData.length} week period.
          </p>
          
          <h3 className="font-medium mb-2">Key Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Attention</span>
                <span className="text-sm">{mockPerformanceData[0].score}%</span>
              </div>
              <Progress value={mockPerformanceData[0].score} className="h-2" 
                style={{ backgroundColor: 'rgba(var(--cognitive-attention-rgb), 0.2)' }}/>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Memory</span>
                <span className="text-sm">{mockPerformanceData[1].score}%</span>
              </div>
              <Progress value={mockPerformanceData[1].score} className="h-2" 
                style={{ backgroundColor: 'rgba(var(--cognitive-memory-rgb), 0.2)' }}/>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Executive Function</span>
                <span className="text-sm">{mockPerformanceData[2].score}%</span>
              </div>
              <Progress value={mockPerformanceData[2].score} className="h-2"
                style={{ backgroundColor: 'rgba(var(--cognitive-executive-rgb), 0.2)' }}/>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Behavioral Regulation</span>
                <span className="text-sm">{mockPerformanceData[3].score}%</span>
              </div>
              <Progress value={mockPerformanceData[3].score} className="h-2"
                style={{ backgroundColor: 'rgba(var(--cognitive-behavioral-rgb), 0.2)' }}/>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Performance Charts</TabsTrigger>
          <TabsTrigger value="matrices">Cognitive Matrices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cognitive Domain Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockSessionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="attention" 
                        name="Attention" 
                        stroke="hsl(var(--cognitive-attention))" 
                        strokeWidth={2}
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memory" 
                        name="Memory" 
                        stroke="hsl(var(--cognitive-memory))" 
                        strokeWidth={2}
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="executive" 
                        name="Executive" 
                        stroke="hsl(var(--cognitive-executive))" 
                        strokeWidth={2}
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="behavioral" 
                        name="Behavioral" 
                        stroke="hsl(var(--cognitive-behavioral))" 
                        strokeWidth={2}
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Domain Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="score"
                      >
                        {mockPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${typeof value === 'number' ? value.toString() : value}%`, 'Score']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Error Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockErrorRates}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="commission" 
                        name="Commission Errors (Impulsivity)" 
                        fill="hsl(var(--destructive))" 
                      />
                      <Bar 
                        dataKey="omission" 
                        name="Omission Errors (Inattention)" 
                        fill="hsl(var(--amber-500))" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Commission errors indicate impulsivity (responding when should have withheld response). 
                  Omission errors indicate inattention (not responding when should have).
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockResponseTime}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 1.2]} />
                      <Tooltip 
                        formatter={(value) => [`${value.toFixed(2)} seconds`, 'Response Time']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="time"
                        name="Response Time"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Lower response times typically indicate better processing speed and attention.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="matrices">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cognitive Domain Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5" />
                    <span className="text-xs">Patient</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-1.5" />
                    <span className="text-xs">Age-Based Normative</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-400 mr-1.5" />
                    <span className="text-xs">ADHD Subtype Average</span>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="70%" data={mockComparisonData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="domain" 
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        stroke="hsl(var(--border))"
                      />
                      <Radar 
                        name="Patient" 
                        dataKey="patient" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.4} 
                      />
                      <Radar 
                        name="Age-Based Normative" 
                        dataKey="normative" 
                        stroke="rgb(96, 165, 250)" 
                        fill="rgb(96, 165, 250)" 
                        fillOpacity={0.4} 
                      />
                      <Radar 
                        name="ADHD Subtype Average" 
                        dataKey="subtype" 
                        stroke="rgb(251, 191, 36)" 
                        fill="rgb(251, 191, 36)" 
                        fillOpacity={0.4} 
                      />
                      <Legend />
                      <Tooltip
                        formatter={(value) => [`${value}%`]}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  This radar chart compares the patient's performance across cognitive domains to 
                  age-based normative data and ADHD subtype averages. Higher values (further from center) 
                  indicate better performance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Breakdown by Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-medium">Domain</th>
                        <th className="py-3 text-center font-medium">Score</th>
                        <th className="py-3 text-center font-medium">Percentile</th>
                        <th className="py-3 text-left font-medium">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3">Attention</td>
                        <td className="py-3 text-center">{mockPerformanceData[0].score}%</td>
                        <td className="py-3 text-center">75th</td>
                        <td className="py-3">Above Average</td>
                      </tr>
                      <tr>
                        <td className="py-3">Memory</td>
                        <td className="py-3 text-center">{mockPerformanceData[1].score}%</td>
                        <td className="py-3 text-center">65th</td>
                        <td className="py-3">Average</td>
                      </tr>
                      <tr>
                        <td className="py-3">Executive Function</td>
                        <td className="py-3 text-center">{mockPerformanceData[2].score}%</td>
                        <td className="py-3 text-center">80th</td>
                        <td className="py-3">Well Above Average</td>
                      </tr>
                      <tr>
                        <td className="py-3">Behavioral Regulation</td>
                        <td className="py-3 text-center">{mockPerformanceData[3].score}%</td>
                        <td className="py-3 text-center">70th</td>
                        <td className="py-3">Above Average</td>
                      </tr>
                      <tr>
                        <td className="py-3">Processing Speed</td>
                        <td className="py-3 text-center">72%</td>
                        <td className="py-3 text-center">72nd</td>
                        <td className="py-3">Above Average</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommendations Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2 text-primary">Attention Enhancement</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Daily focused attention exercises (15-20 minutes)</li>
                      <li>Environmental modifications to reduce distractions</li>
                      <li>Use of visual timers for task management</li>
                      <li>Breaking tasks into smaller, manageable chunks</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2 text-primary">Memory Strategies</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Spaced repetition practice for important information</li>
                      <li>Multi-sensory encoding techniques</li>
                      <li>Visual organization systems (mind maps, charts)</li>
                      <li>Routine memory exercises focusing on working memory</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2 text-primary">Executive Function Development</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Structured planning tools with visual cues</li>
                      <li>Cognitive flexibility exercises and games</li>
                      <li>Goal setting with concrete benchmarks</li>
                      <li>Self-monitoring strategies for task completion</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium mb-2 text-primary">Behavioral Regulation</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Emotional awareness and labeling exercises</li>
                      <li>Impulse control techniques (pause and reflect)</li>
                      <li>Consistent reinforcement of positive behaviors</li>
                      <li>Mindfulness practices (5-10 minutes daily)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Clinical Interpretations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Based on the assessment results, the following clinical interpretations and recommendations are provided:
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Cognitive Strengths</h3>
              <p className="text-sm text-muted-foreground">
                Demonstrates notable strengths in executive functioning (80th percentile), particularly in 
                areas of planning and cognitive flexibility. Attention abilities are also well-developed 
                (75th percentile), with good sustained attention.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Areas for Development</h3>
              <p className="text-sm text-muted-foreground">
                Memory performance (65th percentile) shows room for improvement, particularly in working 
                memory capacity. Consider implementing targeted memory enhancement strategies as outlined 
                in the recommendations matrix.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Progress Indicators</h3>
              <p className="text-sm text-muted-foreground">
                The trend data shows consistent improvement in executive function and attention domains 
                over the assessment period. Behavioral regulation has stabilized but may benefit from 
                additional focus. Response times have improved by approximately 0.3 seconds over the 
                course of treatment.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Future Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Continue with the current cognitive training program with increased emphasis on memory 
                exercises. Reassess in 3 months to evaluate progress and adjust treatment plan as needed. 
                Consider adding school-based accommodations to support executive functioning in the 
                classroom environment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
