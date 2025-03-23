
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientForm } from '@/components/data-entry/PatientForm';
import { SessionForm } from '@/components/data-entry/SessionForm';
import { MetricsForm } from '@/components/data-entry/MetricsForm';

const DataEntry = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Data Entry</h1>
        <p className="text-muted-foreground">
          Add new patients, sessions, and assessment metrics to the system
        </p>
      </div>
      
      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patient" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>New Patient</CardTitle>
              <CardDescription>
                Add a new patient to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="session" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>New Assessment Session</CardTitle>
              <CardDescription>
                Record a new assessment session for an existing patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SessionForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>New Metrics</CardTitle>
              <CardDescription>
                Update cognitive metrics for an existing patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataEntry;
