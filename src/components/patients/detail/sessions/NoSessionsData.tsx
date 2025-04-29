
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const NoSessionsData: React.FC = () => {
  return (
    <div className="p-8 text-center h-64 flex flex-col justify-center items-center">
      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-muted-foreground">
        No session data available.
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Sessions will appear after the patient completes assessments.
      </p>
    </div>
  );
};
