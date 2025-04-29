
import React, { useState, useEffect } from 'react';
import { ProfileInfo } from './profile/ProfileInfo';
import { DomainScores } from './profile/DomainScores';
import { TrendChart } from './profile/TrendChart';
import { TrendData } from '@/services/patient';
import NormativeService from '@/services/normative';

interface PatientProfileProps {
  patientAgeGroup: string;
  patientAdhdSubtype: string | null;
  avgDomainScores: {
    memory: number;
    attention: number;
    impulse_control: number;
    executive_function: number;
  };
  trendGraph: TrendData[];
  totalSessions: number;
  firstSessionDate: string | null;
  lastSessionDate: string | null;
  age: number;
  gender: string;
  hasTrendData: boolean;
  patientId: string;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patientAgeGroup,
  patientAdhdSubtype,
  avgDomainScores,
  trendGraph,
  totalSessions,
  firstSessionDate,
  lastSessionDate,
  age,
  gender,
  hasTrendData,
  patientId
}) => {
  const [normativeData, setNormativeData] = useState<Record<string, any>>({});
  const [isLoadingNormative, setIsLoadingNormative] = useState(true);

  // Fetch normative data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (patientId) {
        setIsLoadingNormative(true);
        try {
          const data = await NormativeService.fetchAllNormativeData(patientId);
          setNormativeData(data);
        } catch (error) {
          console.error("Failed to fetch normative data:", error);
        } finally {
          setIsLoadingNormative(false);
        }
      }
    };

    fetchData();
  }, [patientId]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card - Patient Info */}
        <ProfileInfo 
          age={age}
          gender={gender}
          patientAdhdSubtype={patientAdhdSubtype}
          totalSessions={totalSessions}
          firstSessionDate={firstSessionDate}
          lastSessionDate={lastSessionDate}
        />

        {/* Right Card - Domain Scores */}
        <DomainScores 
          avgDomainScores={avgDomainScores}
          totalSessions={totalSessions}
          normativeData={normativeData}
          isLoadingNormative={isLoadingNormative}
        />
      </div>
      
      {/* Trend Graph in Profile Tab */}
      <div className="mt-6">
        <TrendChart 
          trendGraph={trendGraph}
          hasTrendData={hasTrendData}
        />
      </div>
    </div>
  );
};
