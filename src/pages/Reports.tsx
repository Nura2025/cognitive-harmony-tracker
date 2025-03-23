import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { 
  mockPatientData, 
  mockNormativeData, 
  mockSubtypeData,
  CognitiveDomain
} from '@/utils/mockData';
import { randomInt } from '@/utils/helpers/randomUtils';

// Mock data for test scores
const testScores = {
  attention: {
    sustainedAttention: randomInt(60, 95),
    selectiveAttention: randomInt(55, 90),
    dividedAttention: randomInt(50, 85),
    attentionalSwitching: randomInt(45, 80),
  },
  memory: {
    workingMemory: randomInt(55, 90),
    shortTermMemory: randomInt(60, 95),
    longTermMemory: randomInt(65, 95),
    visualMemory: randomInt(50, 85),
  },
  executive: {
    inhibition: randomInt(40, 75),
    planning: randomInt(45, 80),
    problemSolving: randomInt(50, 85),
    decisionMaking: randomInt(55, 90),
  },
  behavioral: {
    emotionalRegulation: randomInt(35, 70),
    impulseControl: randomInt(30, 65),
    socialCognition: randomInt(45, 80),
    selfMonitoring: randomInt(40, 75),
  }
};

// Mock recommendations
const recommendations = [
  {
    domain: 'Attention',
    strategies: [
      'Daily mindfulness meditation practice (10-15 minutes)',
      'Use of external timers and reminders for task management',
      'Implementation of the Pomodoro technique for focused work periods',
      'Regular physical exercise to improve overall attentional capacity'
    ]
  },
  {
    domain: 'Memory',
    strategies: [
      'Spaced repetition techniques for important information',
      'Use of visual organizers and mind maps',
      'Implementation of memory palace techniques for complex information',
      'Regular sleep hygiene practices to support memory consolidation'
    ]
  },
  {
    domain: 'Executive Function',
    strategies: [
      'Breaking complex tasks into smaller, manageable steps',
      'Use of structured planning tools and digital organizers',
      'Regular review and reflection on completed tasks',
      'Implementation of if-then planning for anticipated challenges'
    ]
  },
  {
    domain: 'Behavioral Regulation',
    strategies: [
      'Regular practice of emotional awareness techniques',
      'Use of structured response delay strategies for emotional situations',
      'Implementation of regular self-monitoring practices',
      'Development of specific social scripts for challenging interactions'
    ]
  }
];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cognitive Assessment Report</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of cognitive performance across key domains
        </p>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparisons</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This cognitive assessment evaluates performance across four key domains: 
                  Attention, Memory, Executive Function, and Behavioral Regulation.
                </p>
                <p>
                  Results indicate relative strengths in Memory and Attention domains, 
                  with opportunities for development in Executive Function and Behavioral 
                  Regulation. Specific strategies are recommended to support cognitive 
                  functioning in daily activities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle>Domain Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Attention</Label>
                    <span className="text-sm">{mockPatientData.attention}%</span>
                  </div>
                  <Progress value={mockPatientData.attention} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Memory</Label>
                    <span className="text-sm">{mockPatientData.memory}%</span>
                  </div>
                  <Progress value={mockPatientData.memory} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Executive Function</Label>
                    <span className="text-sm">{mockPatientData.executive}%</span>
                  </div>
                  <Progress value={mockPatientData.executive} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Behavioral Regulation</Label>
                    <span className="text-sm">{mockPatientData.behavioral}%</span>
                  </div>
                  <Progress value={mockPatientData.behavioral} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DomainComparison 
            patientData={mockPatientData} 
            normativeData={mockNormativeData}
          />
        </TabsContent>
        
        {/* Detailed Analysis Tab */}
        <TabsContent value="detailed" className="space-y-6">
          {Object.entries(testScores).map(([domain, tests]) => (
            <Card key={domain} className="glass">
              <CardHeader>
                <CardTitle className="capitalize">{domain} Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(tests).map(([test, score]) => (
                    <div key={test} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        <span className="text-sm">{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Comparisons Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Age-Based Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This comparison shows how your cognitive performance compares to 
                  age-matched normative data from our research database.
                </p>
                <DomainComparison 
                  patientData={mockPatientData} 
                  normativeData={mockNormativeData}
                />
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle>ADHD Subtype Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This comparison shows how your cognitive profile relates to 
                  typical patterns seen in specific ADHD subtypes.
                </p>
                <DomainComparison 
                  patientData={mockPatientData} 
                  subtypeData={mockSubtypeData}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass">
            <CardHeader>
              <CardTitle>Comprehensive Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This visualization combines all comparison data to provide a comprehensive 
                view of your cognitive profile relative to both normative data and 
                ADHD subtype patterns.
              </p>
              <DomainComparison 
                patientData={mockPatientData} 
                normativeData={mockNormativeData}
                subtypeData={mockSubtypeData}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Based on your cognitive assessment results, the following strategies 
                are recommended to support your cognitive functioning in daily life:
              </p>
              
              <div className="space-y-6">
                {recommendations.map((rec) => (
                  <div key={rec.domain}>
                    <h3 className="text-lg font-medium mb-2">{rec.domain}</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {rec.strategies.map((strategy, index) => (
                        <li key={index} className="text-muted-foreground">{strategy}</li>
                      ))}
                    </ul>
                    {rec.domain !== recommendations[recommendations.length - 1].domain && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button>Download Full Report</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
