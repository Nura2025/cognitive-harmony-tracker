
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

interface ReportVisualizationsProps {
  report: ReportType;
  patientId: string;
  patientName: string;
}

const ReportVisualizations: React.FC<ReportVisualizationsProps> = ({ report, patientId, patientName }) => {
  const { t, language } = useLanguage();
  const currentUser = AuthService.getCurrentUser();
  
  // Safety check for metrics - ensure we have valid data
  const metrics = report.data?.metrics || {
    attention: 0,
    memory: 0,
    executiveFunction: 0,
    behavioral: 0,
    percentile: 0,
    sessionsDuration: 0,
    sessionsCompleted: 0,
    progress: 0
  };
  
  const formattedDate = report.data?.date 
    ? format(new Date(report.data.date), 'PPP') 
    : format(new Date(), 'PPP');

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
                  <MetricTooltip content={t('attentionExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report.data?.summary?.attention || 
                    "The patient demonstrates improved sustained attention compared to initial assessment, with decreased omission errors and increased response consistency."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('memory')}
                  <MetricTooltip content={t('memoryExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report.data?.summary?.memory || 
                    "Working memory capacity has shown moderate improvement, with better performance in sequence recall and pattern recognition tasks."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('executiveFunction')}
                  <MetricTooltip content={t('executiveFunctionExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report.data?.summary?.executiveFunction || 
                    "Executive function metrics show improvement in cognitive flexibility and planning abilities."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {t('overall')}
                  <MetricTooltip content={t('overallExplanation')} />
                </CardTitle>
              </CardHeader>
              <CardContent className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p>
                  {report.data?.summary?.overall || 
                    "Overall cognitive performance has improved by approximately 7 percentile points since beginning the training program."}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="py-4">
          {/* Metrics visualization would go here */}
          <Card>
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">{t('metricsOverTime')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'text-right' : 'text-left'}>{t('recommendations')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className={`space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {report.data?.recommendations ? (
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
