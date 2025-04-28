import { PatientFilters } from "@/components/patients/PatientFilters";
import { PatientList } from "@/components/patients/PatientList";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import PatientService from "@/services/patient"; // your API service
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>(
    {}
  );
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const { t, language } = useLanguage();

  // ✅ Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const clinicianId = "3f7a219b-32d7-4ca8-abae-d9a77c922aff"; // Replace with real clinician ID from auth
        const response = await PatientService.getPatientsByClinician(
          clinicianId
        );
        const patientList = response.data.map((p: any) => {
          const birthYear = new Date(p.date_of_birth).getFullYear();
          const age = new Date().getFullYear() - birthYear;
          return {
            ...p,
            name: `${p.first_name} ${p.last_name}`,
            age,
            adhdSubtype: p.adhd_subtype,
          };
        });
        setPatients(patientList);
        setFilteredPatients(patientList);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // 🔍 Apply filters
  useEffect(() => {
    let result = [...patients];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((patient) =>
        patient.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    const activeSubtypes = Object.keys(activeFilters)
      .filter((key) => key.startsWith("subtype-") && activeFilters[key])
      .map((key) => key.replace("subtype-", ""));

    if (activeSubtypes.length > 0) {
      result = result.filter((patient) =>
        activeSubtypes.includes(patient.adhdSubtype)
      );
    }

    const activeAgeRanges = Object.keys(activeFilters)
      .filter((key) => key.startsWith("age-") && activeFilters[key])
      .map((key) => key.replace("age-", ""));

    if (activeAgeRanges.length > 0) {
      result = result.filter((patient) =>
        activeAgeRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return patient.age >= min && patient.age <= max;
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div
        className={`flex items-center justify-between ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <div className={language === "ar" ? "text-right" : "text-left"}>
          <h1 className="text-3xl font-bold mb-1">{t("patients")}</h1>
          <p className="text-muted-foreground">{t("managePatientProfiles")}</p>
        </div>

        <Button
          className={`gap-1.5 ${language === "ar" ? "flex-row-reverse" : ""}`}
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
        metrics={{}} // 🔁 Replace or remove metricsMap if unused
        // onPatientClick={handlePatientClick}
      />
    </div>
  );
};

export default Patients;
