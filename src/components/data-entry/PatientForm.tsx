
import React from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPatient } from '@/services/patientService';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  age: z.coerce.number().int().min(3).max(99),
  gender: z.enum(['Male', 'Female', 'Other']),
  diagnosis_date: z.date(),
  adhd_subtype: z.enum(['Inattentive', 'Hyperactive-Impulsive', 'Combined']),
});

type FormValues = z.infer<typeof formSchema>;

export const PatientForm: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: undefined,
      gender: undefined,
      diagnosis_date: new Date(),
      adhd_subtype: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const patientData = {
      ...values,
      diagnosis_date: format(values.diagnosis_date, 'yyyy-MM-dd'),
    };
    
    // Ensure all required fields are present
    const patientToCreate = {
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      diagnosis_date: patientData.diagnosis_date,
      adhd_subtype: patientData.adhd_subtype
    };
    
    await createPatient(patientToCreate);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="diagnosis_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Diagnosis Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adhd_subtype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ADHD Subtype</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ADHD subtype" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Inattentive">Inattentive</SelectItem>
                  <SelectItem value="Hyperactive-Impulsive">Hyperactive-Impulsive</SelectItem>
                  <SelectItem value="Combined">Combined</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The predominant symptom pattern
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">Add Patient</Button>
      </form>
    </Form>
  );
};
