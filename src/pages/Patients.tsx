
import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientList } from "@/components/patients/PatientList";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import PatientService from "@/services/patient"; 
import { PlusCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AddPatientDialog from "@/components/patients/AddPatientDialog";

// Import Patient type
import type { Patient } from "@/components/patients/PatientList";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { t, language } = useLanguage();

  // ✅ Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const clinicianId = "48526669-c799-4642-8fb9-93110a8bc2f8"; // Replace with real clinician ID from auth
      const patientData = await PatientService.getPatientsByClinician(clinicianId);
      
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
          lastAssessment: p.last_session_date,
          assessmentCount: p.total_sessions || 0
        };
      });
      
      setPatients(patientList);
      setFilteredPatients(patientList);
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

  const handleRetry = () => {
    setRetrying(true);
    fetchPatients();
  };

  const handleAddPatient = async (patientData: any) => {
    try {
      // In a real app, you would call your API to create the patient
      // For now, we'll simulate adding the patient to our local state
      const clinicianId = "48526669-c799-4642-8fb9-93110a8bc2f8";
      
      // Calculate age based on date of birth
      const birthDate = new Date(patientData.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Create a new patient with the calculated fields
      const newPatient = {
        user_id: `temp-${Date.now()}`, // In a real app, the API would return a real ID
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        name: `${patientData.first_name} ${patientData.last_name}`,
        date_of_birth: patientData.date_of_birth.toISOString().split('T')[0],
        age,
        adhdSubtype: null,
        gender: patientData.gender,
        email: patientData.email,
        username: patientData.username,
        phone_number: patientData.phone_number,
        assessmentCount: 0,
        lastAssessment: null
      };
      
      // Add the new patient to our local state
      setPatients(prevPatients => [newPatient, ...prevPatients]);
      
      // Close the dialog
      setAddDialogOpen(false);
      
      // Show a success message
      toast.success(t("Patient invitation sent successfully"));
      
    } catch (error) {
      console.error("Failed to add patient:", error);
      toast.error(t("Failed to add patient"));
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
          </p>
        </div>

        <Button
          className={`gap-1.5 ${language === "ar" ? "flex-row-reverse" : ""}`}
          onClick={() => setAddDialogOpen(true)}
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
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddPatient}
      />
    </div>
  );
};

export default Patients;
