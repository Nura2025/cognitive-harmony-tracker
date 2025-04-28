
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientData } from "@/hooks/usePatientData";
import PatientProfileTab from "@/components/patients/detail/PatientProfileTab";
import PatientTrendTab from "@/components/patients/detail/PatientTrendTab";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { patientProfile, patientTrends, patientSessions, loading, error } = usePatientData(id);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  if (loading) {
    return <div className="p-8">Loading patient data...</div>;
  }

  if (error || !patientProfile) {
    return <div className="p-8">Patient not found or error loading data.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-muted-foreground"
        onClick={() => navigate("/patients")}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Patients
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{patientProfile.user_name}</h1>
          <p className="text-muted-foreground">Patient ID: {patientProfile.user_id}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <PatientProfileTab patientProfile={patientProfile} />
        </TabsContent>

        <TabsContent value="trend">
          <PatientTrendTab patientTrends={patientTrends} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
