
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientList } from "@/components/patients/PatientList";
import AddPatientDialog from "@/components/patients/AddPatientDialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import PatientService, { PatientInvitation } from "@/services/patient"; // Updated import
import { PlusCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Import Patient type
import type { Patient } from "@/utils/types/patientTypes";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [invitations, setInvitations] = useState<PatientInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // ✅ Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const clinicianId = "48526669-c799-4642-8fb9-93110a8bc2f8"; // Replace with real clinician ID from auth
      const patientData = await PatientService.getPatientsByClinician(clinicianId);
      const invitationData = await PatientService.getPatientInvitations(clinicianId);
      
      // Process the data to add derived fields and ensure user_id is set
      const patientList = patientData.map((p: any) => {
        const birthDate = new Date(p.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return {
          ...p,
          user_id: p.user_id || p.id, // Ensure user_id is set, fallback to id if needed
          name: `${p.first_name} ${p.last_name}`,
          age,
          adhdSubtype: p.adhd_subtype,
        };
      });
      
      setPatients(patientList);
      setFilteredPatients(patientList);
      setInvitations(invitationData);

      // Check for any recently accepted invitations to show notification
      const recentlyAccepted = invitationData.filter(
        inv => inv.status === 'accepted' && 
        new Date(inv.created_at).getTime() > Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
      );
      
      if (recentlyAccepted.length > 0) {
        recentlyAccepted.forEach(invitation => {
          toast.success(`Patient with email ${invitation.email} has accepted your invitation!`);
        });
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch patients");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // 🔍 Apply filters
  useEffect(() => {
    let result = [...patients];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((patient) =>
        patient.name?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    const activeSubtypes = Object.keys(activeFilters)
      .filter((key) => key.startsWith("subtype-") && activeFilters[key])
      .map((key) => key.replace("subtype-", ""));

    if (activeSubtypes.length > 0) {
      result = result.filter((patient) =>
        activeSubtypes.includes(patient.adhdSubtype || "")
      );
    }

    const activeAgeRanges = Object.keys(activeFilters)
      .filter((key) => key.startsWith("age-") && activeFilters[key])
      .map((key) => key.replace("age-", ""));

    if (activeAgeRanges.length > 0) {
      result = result.filter((patient) =>
        activeAgeRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return (patient.age || 0) >= min && (patient.age || 0) <= max;
        })
      );
    }

    setFilteredPatients(result);
  }, [searchTerm, activeFilters, patients]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key: string, value: boolean) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
  };

  const handlePatientClick = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchPatients();
  };

  const handleAddPatient = async (data: any) => {
    try {
      const clinicianId = "48526669-c799-4642-8fb9-93110a8bc2f8"; // Replace with real clinician ID from auth
      
      // Call invitePatient instead of adding directly
      const invitationResult = await PatientService.invitePatient(clinicianId, {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth.toISOString().split('T')[0],
        gender: data.gender,
        phone_number: data.phone_number,
        username: data.username
      });
      
      toast.success(`Invitation sent to ${data.email}!`, {
        description: "They will receive an email with instructions to accept."
      });
      
      // Add the new invitation to the list
      setInvitations(prev => [...prev, invitationResult]);
      
      // Close the dialog
      setAddPatientOpen(false);
      
      // For development/demo purposes only:
      // This simulates the patient accepting the invitation after 5 seconds
      if (process.env.NODE_ENV === 'development') {
        setTimeout(async () => {
          await PatientService.simulateInviteAcceptance(invitationResult.invitation_id);
          toast.success(`${data.first_name} ${data.last_name} has accepted your invitation!`);
          // Refresh the patient list to include the newly accepted patient
          fetchPatients();
        }, 5000);
      }
    } catch (error) {
      console.error("Failed to invite patient:", error);
      toast.error("Failed to send patient invitation. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
          <div className={language === "ar" ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-bold mb-1">{t("patients")}</h1>
            <p className="text-muted-foreground">{t("managePatientProfiles")}</p>
          </div>

          <Button className={`gap-1.5 ${language === "ar" ? "flex-row-reverse" : ""}`} disabled>
            <PlusCircle className="h-4 w-4" />
            <span>{t("addPatient")}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className={`flex items-center justify-between ${language === "ar" ? "flex-row-reverse" : ""}`}>
          <div className={language === "ar" ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-bold mb-1">{t("patients")}</h1>
            <p className="text-muted-foreground">{t("managePatientProfiles")}</p>
          </div>
        </div>

        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Patients</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t("retrying")}...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("retry")}
            </>
          )}
        </Button>
      </div>
    );
  }

  // Get pending invitations count
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div
        className={`flex items-center justify-between ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <div className={language === "ar" ? "text-right" : "text-left"}>
          <h1 className="text-3xl font-bold mb-1">{t("patients")}</h1>
          <p className="text-muted-foreground">
            {t("managePatientProfiles")}
            {pendingInvitations > 0 && (
              <span className="ml-2 text-primary font-medium">
                ({pendingInvitations} pending invitation{pendingInvitations !== 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>

        <Button
          className={`gap-1.5 ${language === "ar" ? "flex-row-reverse" : ""}`}
          onClick={() => setAddPatientOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>{t("addPatient")}</span>
        </Button>
      </div>

      <PatientFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      <PatientList
        patients={filteredPatients}
        metrics={{}}
      />
      
      <AddPatientDialog 
        open={addPatientOpen} 
        onOpenChange={setAddPatientOpen}
        onSubmit={handleAddPatient}
      />
    </div>
  );
};

export default Patients;
