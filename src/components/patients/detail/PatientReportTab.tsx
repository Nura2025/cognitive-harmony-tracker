
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const PatientReportTab: React.FC = () => {
  return (
    <Card className="glass">
      <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">Reports Coming Soon</h3>
        <p className="text-muted-foreground text-center">
          Patient reports are currently under development and will be available soon.
        </p>
      </CardContent>
    </Card>
  );
};
