
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
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
import { getPatients } from '@/services/patientService';
import { createSession } from '@/services/sessionService';
import { Activity, Patient } from '@/types/databaseTypes';

const formSchema = z.object({
  patient_id: z.string().uuid(),
  environment: z.enum(['Home', 'School', 'Clinic']),
  device: z.string().min(2),
  completion_status: z.enum(['Completed', 'Abandoned', 'Interrupted']),
  duration: z.number().min(1),
  overall_score: z.number().min(0).max(100),
  attention: z.number().min(0).max(100),
  memory: z.number().min(0).max(100),
  executive_function: z.number().min(0).max(100),
  behavioral: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export const SessionForm: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activities, setActivities] = useState<Omit<Activity, 'id' | 'session_id' | 'created_at'>[]>([]);
  const [activityForm, setActivityForm] = useState({
    type: '',
    score: 50,
    duration: 300,
    difficulty: 3,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      environment: undefined,
      device: '',
      completion_status: undefined,
      duration: 600, // 10 minutes default
      overall_score: 50,
      attention: 50,
      memory: 50,
      executive_function: 50,
      behavioral: 50,
    },
  });

  useEffect(() => {
    const loadPatients = async () => {
      const data = await getPatients();
      setPatients(data);
    };
    
    loadPatients();
  }, []);

  const handleAddActivity = () => {
    if (!activityForm.type) return;
    
    setActivities([...activities, { ...activityForm }]);
    setActivityForm({
      type: '',
      score: 50,
      duration: 300,
      difficulty: 3,
    });
  };

  const handleRemoveActivity = (index: number) => {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  };

  const onSubmit = async (values: FormValues) => {
    // Create timestamps for start/end time
    const now = new Date();
    const endTime = now.toISOString();
    const startTime = new Date(now.getTime() - values.duration * 1000).toISOString();
    
    const sessionData = {
      ...values,
      start_time: startTime,
      end_time: endTime,
    };
    
    await createSession(sessionData, activities);
    setActivities([]);
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
            name="environment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environment</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="School">School</SelectItem>
                    <SelectItem value="Clinic">Clinic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="device"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device</FormLabel>
                <FormControl>
                  <Input placeholder="iPad Pro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="completion_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completion Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Abandoned">Abandoned</SelectItem>
                    <SelectItem value="Interrupted">Interrupted</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (seconds)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Total duration in seconds
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="overall_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall Score: {field.value}</FormLabel>
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
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-4">Add Activities</h3>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Input
              placeholder="Activity Type"
              value={activityForm.type}
              onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
            />
            <div>
              <label className="text-xs">Score</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={activityForm.score}
                onChange={(e) => setActivityForm({ ...activityForm, score: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs">Duration (s)</label>
              <Input
                type="number"
                min="1"
                value={activityForm.duration}
                onChange={(e) => setActivityForm({ ...activityForm, duration: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs">Difficulty (1-5)</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={activityForm.difficulty}
                onChange={(e) => setActivityForm({ ...activityForm, difficulty: parseInt(e.target.value) })}
              />
            </div>
          </div>
          
          <Button type="button" variant="outline" onClick={handleAddActivity}>Add Activity</Button>
          
          {activities.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Activities:</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div>
                      <span className="font-medium">{activity.type}</span>
                      <span className="text-xs ml-2">
                        Score: {activity.score}, Duration: {activity.duration}s, Difficulty: {activity.difficulty}
                      </span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveActivity(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full">Record Session</Button>
      </form>
    </Form>
  );
};
