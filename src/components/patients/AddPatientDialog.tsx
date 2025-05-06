
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
import { toast } from "sonner";
import { API_BASE } from "@/services/config";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

// Form schema for invitation email
const emailFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

// Form schema for full patient data
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

type EmailFormData = z.infer<typeof emailFormSchema>;
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
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [showInvitationDialog, setShowInvitationDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Email-only form for generating invitation link
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: ""
    }
  });

  // Full form for patient data
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
      emailForm.reset();
      fullForm.reset();
      setInvitationLink(null);
    }
  }, [open, emailForm, fullForm]);

  const handleGenerateInvitation = async (data: EmailFormData) => {
    try {
      setIsGenerating(true);
      // Updated to use POST request instead of GET
      const response = await axios.post(
        `${API_BASE}/generate-invitation-link`,
        { patient_email: data.email }
      );
      
      setInvitationLink(response.data.invitation_link);
      setShowInvitationDialog(true);
      
      // Auto-set the email in the full form
      fullForm.setValue("email", data.email);
    } catch (error) {
      console.error("Failed to generate invitation:", error);
      toast.error(t("Failed to generate invitation link"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      toast.success(t("Invitation link copied to clipboard"));
    }
  };

  const handleSubmitFullForm = (data: FullFormData) => {
    onSubmit(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("Invite New Patient")}</DialogTitle>
            <DialogDescription>
              {t("Enter patient email to generate an invitation link.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleGenerateInvitation)} className="space-y-4">
              <FormField
                control={emailForm.control}
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
        </DialogContent>
      </Dialog>

      <AlertDialog open={showInvitationDialog} onOpenChange={setShowInvitationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Invitation Link Generated")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("Share this invitation link with the patient to complete their registration:")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {invitationLink && (
            <div className="my-4">
              <div className="bg-muted p-4 rounded-md flex items-center justify-between gap-2 break-all">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Link className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm overflow-hidden text-ellipsis">{invitationLink}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowInvitationDialog(false);
              onOpenChange(false);
            }}>
              {t("Done")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddPatientDialog;
