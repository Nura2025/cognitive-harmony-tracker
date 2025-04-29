
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface ProfileInfoProps {
  age: number;
  gender: string;
  patientAdhdSubtype: string | null;
  totalSessions: number;
  firstSessionDate: string | null;
  lastSessionDate: string | null;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  age,
  gender,
  patientAdhdSubtype,
  totalSessions,
  firstSessionDate,
  lastSessionDate
}) => {
  return (
    <Card className="glass">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{gender}</h2>
          <p className="text-muted-foreground">{gender}</p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-muted-foreground mb-1">Age</h3>
            <p className="font-medium">{age} years</p>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-1">
              ADHD Subtype
            </h3>
            <Badge variant="outline">
              {patientAdhdSubtype ?? "N/A"}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-1">
              Total Sessions
            </h3>
            <p className="font-medium">{totalSessions}</p>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-1">
              First Session
            </h3>
            <p className="font-medium">
              {firstSessionDate
                ? format(
                    parseISO(firstSessionDate),
                    "MMM d, yyyy"
                  )
                : "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-1">
              Last Session
            </h3>
            <p className="font-medium">
              {lastSessionDate
                ? format(
                    parseISO(lastSessionDate),
                    "MMM d, yyyy"
                  )
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
