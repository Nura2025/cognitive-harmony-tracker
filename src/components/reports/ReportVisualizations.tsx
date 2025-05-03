
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MetricTooltip } from './MetricTooltip';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';
import { ReportType } from '@/utils/types/patientTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthService from '@/services/auth';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';

interface ReportVisualizationsProps {
  report: ReportType;
  patientId: string;
  patientName: string;
}

const ReportVisualizations: React.FC<ReportVisualizationsProps> = ({ report, patientId, patientName }) => {
  const { t, language } = useLanguage();
  const currentUser = AuthService.getCurrentUser();
  
  // Safety check for metrics - ensure we have valid data
  const metrics = report?.data?.metrics || {
    attention: 0,
    memory: 0,
    executiveFunction: 0,
    behavioral: 0,
    percentile: 0,
    sessionsDuration: 0,
    sessionsCompleted: 0,
    progress: 0
  };
  
  const formattedDate = report?.data?.date 
    ? format(new Date(report.data.date), 'PPP') 
    : format(new Date(), 'PPP');

  // Generate sample trend data for the charts
  const generateTrendData = (numPoints = 10, baseValue = 50, improvement = 20) => {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
      // Create an increasing trend with some randomness
      const randomVariation = Math.random() * 10 - 5; // -5 to +5
      const trend = baseValue + (i / (numPoints - 1)) * improvement + randomVariation;
      data.push({
        session: i + 1,
        value: Math.min(Math.max(trend, 0), 100) // Clamp between 0 and 100
      });
    }
    return data;
  };

  // Create domain-specific trend data
  const attentionData = generateTrendData(10, 45, 30);
  const memoryData = generateTrendData(10, 50, 15);
  const executiveFunctionData = generateTrendData(10, 40, 40);
  const behavioralData = generateTrendData(10, 55, 25);

  // Combined comparison data for radar chart
  const comparisonData = [
    {
      subject: t('attention'),
      patient: metrics.attention,
      average: 50,
      adhdAverage: 40,
    },
    {
      subject: t('memory'),
      patient: metrics.memory,
      average: 50,
      adhdAverage: 42,
    },
    {
      subject: t('executiveFunction'),
      patient: metrics.executiveFunction,
      average: 50,
      adhdAverage: 38,
    },
    {
      subject: t('behavioral'),
      patient: metrics.behavioral,
      average: 50,
      adhdAverage: 35,
    },
  ];

  // Progress data for bar chart
  const progressData = [
    {
      name: t('attention'),
      initial: metrics.attention - 10,
      current: metrics.attention,
    },
    {
      name: t('memory'),
      initial: metrics.memory - 5,
      current: metrics.memory,
    },
    {
      name: t('executiveFunction'),
      initial: metrics.executiveFunction - 8,
      current: metrics.executiveFunction,
    },
    {
      name: t('behavioral'),
      initial: metrics.behavioral - 12,
      current: metrics.behavioral,
    },
  ];

  const handleDownloadPDF = () => {
    console.log('Download PDF functionality would be implemented here');
    // In a real application, this would generate and download a PDF
  };

  const handleShareViaEmail = () => {
    console.log('Share via email functionality would be implemented here');
    // In a real application, this would open an email share modal
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-2xl font-bold">{t('clinicalReport')}</h2>
        <div className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {t('downloadPdf')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareViaEmail}>
            <Mail className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            Email
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div>
          <p className="text-sm text-muted-foreground">{t('patientName')}</p>
          <p className="font-medium">{patientName}</p>
        </div>
        <div className={language === 'ar' ? 'text-left' : 'text-right'}>
          <p className="text-sm text-muted-foreground">{t('date')}</p>
          <p className="font-medium">{formattedDate}</p>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className={`w-full justify-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="summary">{t('executiveSummary')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('metricsOverTime')}</TabsTrigger>
          <TabsTrigger value="recommendations">{t('recommendations')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>{t('comparativeAnalysis')}</CardTitle>
              <CardDescription className={language === 'ar' ? 'text-right' : 'text-left'}>
                {t('performanceComparison')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    <Bar name={t('initialScore')} dataKey="initial" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                    <Bar name={t('currentScore')} dataKey="current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className={`grid grid-cols-4 gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div></div>
                <div className="font-semibold text-sm text-center">{t('firstSession')}</div>
                <div className="font-semibold text-sm text-center">{t('latestSession')}</div>
                <div className="font-semibold text-sm text-center">{t('change')}</div>
                
                <div className="font-medium">{t('attention')}</div>
                <div className="text-center">{metrics.attention - 10}</div>
                <div className="text-center">{metrics.attention}</div>
                <div className="text-center text-green-500">+10%</div>
                
                <div className="font-medium">{t('memory')}</div>
                <div className="text-center">{metrics.memory - 5}</div>
                <div className="text-center">{metrics.memory}</div>
                <div className="text-center text-green-500">+5%</div>
                
                <div className="font-medium">{t('executiveFunction')}</div>
                <div className="text-center">{metrics.executiveFunction - 8}</div>
                <div className="text-center">{metrics.executiveFunction}</div>
                <div className="text-center text-green-500">+8%</div>
                
                <div className="font-medium">{t('overall')}</div>
                <div className="text-center">{metrics.percentile - 7}</div>
                <div className="text-center">{metrics.percentile}</div>
                <div className="text-center text-green-500">+7%</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('attention')}
                  <MetricTooltip explanation={t('attentionExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report?.data?.summary?.attention || 
                    "The patient demonstrates improved sustained attention compared to initial assessment, with decreased omission errors and increased response consistency."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('memory')}
                  <MetricTooltip explanation={t('memoryExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report?.data?.summary?.memory || 
                    "Working memory capacity has shown moderate improvement, with better performance in sequence recall and pattern recognition tasks."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('executiveFunction')}
                  <MetricTooltip explanation={t('executiveFunctionExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report?.data?.summary?.executiveFunction || 
                    "Executive function metrics show improvement in cognitive flexibility and planning abilities."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('overall')}
                  <MetricTooltip explanation={t('overallExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report?.data?.summary?.overall || 
                    "Overall cognitive performance has improved by approximately 7 percentile points since beginning the training program."}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cognitivePerformanceOverTime')}</CardTitle>
                <CardDescription>{t('performanceTrend')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="session" 
                        type="number" 
                        domain={[1, 10]} 
                        allowDecimals={false}
                        stroke="hsl(var(--muted-foreground))"
                        label={{ value: t('session'), position: 'insideBottomRight', offset: -10 }}
                      />
                      <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                        }}
                        formatter={(value) => [`${value}%`, '']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        data={attentionData} 
                        dataKey="value" 
                        name={t('attention')} 
                        stroke="hsl(var(--cognitive-attention))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        data={memoryData} 
                        dataKey="value" 
                        name={t('memory')} 
                        stroke="hsl(var(--cognitive-memory))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        data={executiveFunctionData} 
                        dataKey="value" 
                        name={t('executiveFunction')} 
                        stroke="hsl(var(--cognitive-executive))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        data={behavioralData} 
                        dataKey="value" 
                        name={t('behavioral')} 
                        stroke="hsl(var(--cognitive-behavioral))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('domainComparison')}</CardTitle>
                <CardDescription>{t('comparedToAgeGroup')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={comparisonData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]}
                        stroke="hsl(var(--border))" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Radar 
                        name={t('patientScore')} 
                        dataKey="patient" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.5} 
                      />
                      <Radar 
                        name={t('ageGroupAverage')} 
                        dataKey="average" 
                        stroke="hsl(var(--secondary))" 
                        fill="hsl(var(--secondary))" 
                        fillOpacity={0.3} 
                      />
                      <Radar 
                        name={t('adhdAverage')} 
                        dataKey="adhdAverage" 
                        stroke="hsl(var(--muted))" 
                        fill="hsl(var(--muted))" 
                        fillOpacity={0.3} 
                      />
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                        }}
                        formatter={(value) => [`${value}%`, '']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>{t('recommendations')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className={`space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {report?.data?.recommendations ? (
                    report.data.recommendations.map((recommendation, index) => (
                      <div key={index} className="pb-3 border-b last:border-0">
                        <p className="mb-1 font-medium">{recommendation.title}</p>
                        <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="pb-3 border-b">
                        <p className="mb-1 font-medium">Continue with current training regimen</p>
                        <p className="text-sm text-muted-foreground">
                          The patient is responding well to the current cognitive exercises. Recommend continuing with the established protocol with 3-4 sessions per week.
                        </p>
                      </div>
                      <div className="pb-3 border-b">
                        <p className="mb-1 font-medium">Increase challenging activities</p>
                        <p className="text-sm text-muted-foreground">
                          Consider gradually increasing the difficulty level of executive function tasks to further enhance cognitive flexibility.
                        </p>
                      </div>
                      <div className="pb-3 border-b">
                        <p className="mb-1 font-medium">Monitor attention span</p>
                        <p className="text-sm text-muted-foreground">
                          While attention has improved, continued monitoring is recommended as this remains the area with the most opportunity for growth.
                        </p>
                      </div>
                      <div className="pb-3 border-b">
                        <p className="mb-1 font-medium">Academic accommodations</p>
                        <p className="text-sm text-muted-foreground">
                          Consider extended time for tasks requiring sustained attention and complex problem solving in academic settings.
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Follow-up assessment</p>
                        <p className="text-sm text-muted-foreground">
                          Schedule follow-up cognitive assessment in 3 months to evaluate progress and adjust intervention strategies as needed.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportVisualizations;
