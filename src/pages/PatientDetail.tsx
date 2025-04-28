
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Activity, FileText, CalendarDays, User, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientData } from "@/hooks/usePatientData";
import PatientProfileTab from "@/components/patients/detail/PatientProfileTab";
import PatientTrendTab from "@/components/patients/detail/PatientTrendTab";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { patientProfile, patientTrends, patientSessions, loading, error } = usePatientData(id);

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
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="sessions"><CalendarDays className="mr-2 h-4 w-4" />Sessions</TabsTrigger>
          <TabsTrigger value="analysis"><Activity className="mr-2 h-4 w-4" />Analysis</TabsTrigger>
          <TabsTrigger value="reports"><FileText className="mr-2 h-4 w-4" />Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 gap-6">
            <PatientProfileTab patientProfile={patientProfile} />
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Trend Analysis
              </h3>
              <PatientTrendTab patientTrends={patientTrends} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Patient Sessions</h3>
            <p className="text-muted-foreground">Sessions content will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Analysis</h3>
            <p className="text-muted-foreground">Analysis content will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Reports</h3>
            <p className="text-muted-foreground">Reports content will be implemented here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
