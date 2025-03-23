
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { Patient, CognitiveDomain } from '@/types/databaseTypes';
import { getPatient, getPatientMetrics } from '@/services/patientService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { randomInt } from '@/utils/helpers/randomUtils';

// Mock data for test scores (these will eventually come from the database)
const generateTestScores = () => ({
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
  executive_function: {
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
});

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

// Generated normative and subtype data
const generateNormativeData = (): CognitiveDomain => ({
  attention: randomInt(60, 70),
  memory: randomInt(60, 70),
  executive_function: randomInt(60, 70),
  behavioral: randomInt(60, 70)
});

const generateSubtypeData = (): CognitiveDomain => ({
  attention: randomInt(40, 50),
  memory: randomInt(60, 80),
  executive_function: randomInt(50, 60),
  behavioral: randomInt(40, 50)
});

const Reports: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [patientMetrics, setPatientMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testScores, setTestScores] = useState(generateTestScores());
  const [normativeData, setNormativeData] = useState(generateNormativeData());
  const [subtypeData, setSubtypeData] = useState(generateSubtypeData());
  
  // Parse patient ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('patient');
    
    if (id) {
      setPatientId(id);
    }
  }, [location]);
  
  // Load patient data
  useEffect(() => {
    if (!patientId) return;
    
    const fetchPatientData = async () => {
      setIsLoading(true);
      try {
        const patient = await getPatient(patientId);
        const metrics = await getPatientMetrics(patientId);
        
        setPatientData(patient);
        setPatientMetrics(metrics);
        
        // Generate test scores and comparison data
        setTestScores(generateTestScores());
        setNormativeData(generateNormativeData());
        setSubtypeData(generateSubtypeData());
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
      setIsLoading(false);
    };
    
    fetchPatientData();
  }, [patientId]);
  
  if (isLoading || !patientMetrics) {
    return <div className="p-8">Loading report data...</div>;
  }
  
  // Create a cognitive domain object from the metrics
  const patientDomainData: CognitiveDomain = {
    attention: patientMetrics.attention,
    memory: patientMetrics.memory,
    executive_function: patientMetrics.executive_function,
    behavioral: patientMetrics.behavioral
  };
  
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
                    <span className="text-sm">{patientDomainData.attention}%</span>
                  </div>
                  <Progress value={patientDomainData.attention} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Memory</Label>
                    <span className="text-sm">{patientDomainData.memory}%</span>
                  </div>
                  <Progress value={patientDomainData.memory} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Executive Function</Label>
                    <span className="text-sm">{patientDomainData.executive_function}%</span>
                  </div>
                  <Progress value={patientDomainData.executive_function} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Behavioral Regulation</Label>
                    <span className="text-sm">{patientDomainData.behavioral}%</span>
                  </div>
                  <Progress value={patientDomainData.behavioral} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DomainComparison 
            patientData={patientDomainData} 
            normativeData={normativeData}
          />
        </TabsContent>
        
        {/* Detailed Analysis Tab */}
        <TabsContent value="detailed" className="space-y-6">
          {Object.entries(testScores).map(([domain, tests]) => (
            <Card key={domain} className="glass">
              <CardHeader>
                <CardTitle className="capitalize">{domain.replace(/_/g, ' ')}</CardTitle>
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
                  patientData={patientDomainData} 
                  normativeData={normativeData}
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
                  patientData={patientDomainData} 
                  subtypeData={subtypeData}
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
                patientData={patientDomainData} 
                normativeData={normativeData}
                subtypeData={subtypeData}
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
