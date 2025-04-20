
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCognitiveProfile } from '@/services/cognitiveService';
import { Skeleton } from '@/components/ui/skeleton';

const PatientDetail = () => {
  const params = useParams<{ id: string }>();
  const userId = "883faae2-f14b-40de-be5a-ad4c3ec673bc";
  
  // Fetch patient data
  const { data: profile, isLoading } = useCognitiveProfile(userId);
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
        <p className="text-muted-foreground">Could not load patient data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{profile.user_name}</h1>
        <p className="text-muted-foreground">
          Age: {profile.age} • Type: {profile.adhd_subtype}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(profile.domain_scores).map(([domain, score]) => (
          <div key={domain} className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">{domain}</h3>
            <div className="text-2xl font-bold">{score}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDetail;
