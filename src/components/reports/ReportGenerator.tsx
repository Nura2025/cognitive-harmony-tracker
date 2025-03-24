
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Printer, Download, Book, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { patients, patientMetrics, metricsMap, generateRecommendations } from '@/utils/mockData';
import { Patient, PatientMetrics } from '@/types/databaseTypes';

interface ReportGeneratorProps {
  type?: 'cognitive' | 'progress' | 'clinical';
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ 
  type = 'cognitive'
}) => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  
  // Find patient data
  const patient = patients.find(p => p.id === patientId) as Patient;
  const metrics = patientId ? metricsMap[patientId] as PatientMetrics : null;
  
  // Generate recommendations - passing the empty string as default patient type
  const recommendations = generateRecommendations('');
  
  // If no patient is selected
  if (!patient || !metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No Patient Selected</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please select a patient to generate a report.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass" id="report-container">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Patient Report: {patient.name}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={type} className="space-y-4">
          <TabsList>
            <TabsTrigger value="cognitive">Cognitive Assessment</TabsTrigger>
            <TabsTrigger value="progress">Progress Report</TabsTrigger>
            <TabsTrigger value="clinical">Clinical Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cognitive" className="space-y-4">
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {patient.name}</p>
                  <p><strong>Age:</strong> {patient.age} years old</p>
                  <p><strong>Gender:</strong> {patient.gender}</p>
                </div>
                <div>
                  <p><strong>ADHD Subtype:</strong> {patient.adhd_subtype}</p>
                  <p><strong>Diagnosis Date:</strong> {patient.diagnosis_date}</p>
                  <p><strong>Percentile Rank:</strong> {metrics.percentile}th</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-4">Cognitive Domain Scores</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Attention</span>
                    <span>{metrics.attention}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${metrics.attention}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Memory</span>
                    <span>{metrics.memory}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${metrics.memory}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Executive Function</span>
                    <span>{metrics.executive_function}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${metrics.executive_function}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Behavioral Regulation</span>
                    <span>{metrics.behavioral}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-orange-500 rounded-full" 
                      style={{ width: `${metrics.behavioral}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-4">
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-4">Progress Summary</h2>
              <p className="mb-4">
                Overall, {patient.name} has shown a {metrics.progress}% improvement in the last 30 days
                across all cognitive domains.
              </p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Sessions Completed</h3>
                <div className="flex items-center">
                  <div className="w-full bg-muted rounded-full h-4">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: `${(metrics.sessions_completed / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 font-medium">{metrics.sessions_completed}/10</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {patient.name} has completed {metrics.sessions_completed} out of the recommended 10 sessions.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clinical" className="space-y-4">
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-4">Clinical Insights</h2>
              
              {metrics.clinical_concerns && metrics.clinical_concerns.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Areas of Concern</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {metrics.clinical_concerns.map((concern, index) => (
                      <li key={index}>{concern}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mb-4">No specific clinical concerns identified at this time.</p>
              )}
              
              <div>
                <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
