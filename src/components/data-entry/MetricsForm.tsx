
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { getPatients, createPatientMetrics } from '@/services/patientService';
import { Patient } from '@/types/databaseTypes';

const formSchema = z.object({
  patient_id: z.string().uuid(),
  attention: z.number().min(0).max(100),
  memory: z.number().min(0).max(100),
  executive_function: z.number().min(0).max(100),
  behavioral: z.number().min(0).max(100),
  percentile: z.number().min(0).max(100).optional(),
  sessions_duration: z.number().min(0),
  sessions_completed: z.number().min(0),
  progress: z.number().min(-100).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export const MetricsForm: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [newConcern, setNewConcern] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      attention: 50,
      memory: 50,
      executive_function: 50,
      behavioral: 50,
      percentile: 50,
      sessions_duration: 0,
      sessions_completed: 0,
      progress: 0,
    },
  });

  useEffect(() => {
    const loadPatients = async () => {
      const data = await getPatients();
      setPatients(data);
    };
    
    loadPatients();
  }, []);

  const handleAddConcern = () => {
    if (!newConcern.trim()) return;
    
    setConcerns([...concerns, newConcern]);
    setNewConcern('');
  };

  const handleRemoveConcern = (index: number) => {
    const newConcerns = [...concerns];
    newConcerns.splice(index, 1);
    setConcerns(newConcerns);
  };

  const onSubmit = async (values: FormValues) => {
    const metricsData = {
      ...values,
      date: new Date().toISOString().split('T')[0],
      // Ensure all required fields are non-optional
      patient_id: values.patient_id,
      attention: values.attention,
      memory: values.memory,
      executive_function: values.executive_function,
      behavioral: values.behavioral,
      percentile: values.percentile ?? null,
      sessions_duration: values.sessions_duration,
      sessions_completed: values.sessions_completed,
      progress: values.progress
    };
    
    await createPatientMetrics(metricsData, concerns);
    setConcerns([]);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="attention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attention: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="memory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="executive_function"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Executive Function: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="behavioral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Behavioral: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="percentile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall Percentile: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value || 0]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Percentile rank compared to normative data
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="sessions_completed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Sessions</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sessions_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Duration (min)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progress (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="-100"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-4">Clinical Concerns</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Add a clinical concern"
              value={newConcern}
              onChange={(e) => setNewConcern(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={handleAddConcern}>Add</Button>
          </div>
          
          {concerns.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-2">
              {concerns.map((concern, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span>{concern}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveConcern(index)}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full">Save Metrics</Button>
      </form>
    </Form>
  );
};
