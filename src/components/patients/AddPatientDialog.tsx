
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, User, Mail, Phone, Copy, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_BASE } from "@/services/config";
import { toast } from "sonner";

// Form schema for initial patient data (just email)
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

// Form schema for complete patient data
const fullFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  date_of_birth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender"
  }),
  phone_number: z.string().optional()
});

type EmailFormData = z.infer<typeof emailSchema>;
type FullFormData = z.infer<typeof fullFormSchema>;

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FullFormData) => void;
}

export const AddPatientDialog: React.FC<AddPatientDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'email' | 'full-form' | 'invitation'>('email');
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for email-only step
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });

  // Form for full patient details
  const fullForm = useForm<FullFormData>({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      phone_number: ""
    }
  });

  // Reset the forms when the dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep('email');
      setInvitationLink(null);
      setError(null);
      setPatientEmail("");
      emailForm.reset();
      fullForm.reset();
    }
  }, [open, emailForm, fullForm]);

  // Function to generate invitation link
  const generateInvitationLink = async (email: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      setPatientEmail(email); // Store email for later use
      
      // Get the token from localStorage
      const token = localStorage.getItem('neurocog_token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_BASE}/generate-invitation-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Add the token to the Authorization header
        },
        body: JSON.stringify({ patient_email: email })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Error: ${response.status}`);
      }
      
      const data = await response.json();
      setInvitationLink(data.invitation_link);
      setCurrentStep('invitation');
    } catch (err) {
      console.error("Failed to generate invitation link:", err);
      setError(err instanceof Error ? err.message : "Failed to generate invitation link. Please try again.");
      toast.error(t("Failed to generate invitation link"));
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle email form submission
  const handleEmailSubmit = (data: EmailFormData) => {
    generateInvitationLink(data.email);
  };

  // Handle full form submission
  const handleFullFormSubmit = async (data: FullFormData) => {
    try {
      setIsSubmitting(true);
      
      // Format date of birth to YYYY-MM-DD string for the API
      const formattedDob = format(data.date_of_birth, 'yyyy-MM-dd');
      
      // Prepare the data for the API
      const patientData = {
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        date_of_birth: formattedDob,
        phone_number: data.phone_number || ""
      };
      
      // Get the token from localStorage
      const token = localStorage.getItem('neurocog_token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Make the PATCH request to update the user
      const response = await fetch(`${API_BASE}/update-user-by-email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Error: ${response.status}`);
      }
      
      // Call the parent component's onSubmit function with the updated data
      onSubmit(data);
      
      // Show success message
      toast.success(t("Patient details updated successfully"));
      
      // Close the dialog
      onOpenChange(false);
      
    } catch (err) {
      console.error("Failed to update patient details:", err);
      setError(err instanceof Error ? err.message : "Failed to update patient details. Please try again.");
      toast.error(t("Failed to update patient details"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy invitation link to clipboard
  const copyToClipboard = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      toast.success(t("Invitation link copied to clipboard"));
    }
  };

  // Move to step for collecting full patient details
  const proceedToFullForm = () => {
    // Set the email field in the full form before transitioning
    fullForm.setValue("email", patientEmail);
    setCurrentStep('full-form');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'email' && t("Invite New Patient")}
            {currentStep === 'invitation' && t("Patient Invitation Link")}
            {currentStep === 'full-form' && t("Add Patient Details")}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'email' && t("Enter patient email to generate an invitation link.")}
            {currentStep === 'invitation' && t("Send this link to the patient to complete registration.")}
            {currentStep === 'full-form' && t("Enter complete patient details for your records.")}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'email' && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="email" placeholder={t("Enter patient email")} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? t("Generating...") : t("Generate Invitation Link")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {currentStep === 'invitation' && invitationLink && (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/30">
              <div className="flex items-center mb-2">
                <Link className="h-4 w-4 mr-2 text-primary" />
                <h4 className="text-sm font-medium">{t("Invitation Link")}</h4>
              </div>
              <p className="text-sm break-all bg-background p-3 rounded border">
                {invitationLink}
              </p>
            </div>
            
            <div className="flex justify-between space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("Copy Link")}
              </Button>
              
              <Button 
                variant="default" 
                className="flex-1"
                onClick={proceedToFullForm}
              >
                {t("Add Patient Details")}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              <p>{t("You can now send this link to the patient, or continue to add their details to your records.")}</p>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("Done")}
              </Button>
            </DialogFooter>
          </div>
        )}

        {currentStep === 'full-form' && (
          <Form {...fullForm}>
            <form onSubmit={fullForm.handleSubmit(handleFullFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={fullForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("First Name")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder={t("Enter first name")} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={fullForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Last Name")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder={t("Enter last name")} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={fullForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="email" placeholder={t("Enter Email")} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={fullForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Username")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder={t("Enter username")} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={fullForm.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Date of Birth")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-10 relative text-left font-normal h-10 w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>{t("select Date")}</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={date => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={fullForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Gender")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select gender")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">{t("male")}</SelectItem>
                          <SelectItem value="Female">{t("female")}</SelectItem>
                          <SelectItem value="Other">{t("other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={fullForm.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Phone Number")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder={t("Enter phone number")} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setCurrentStep('invitation')}>
                  {t("Back")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("Updating...") : t("Add Patient")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
