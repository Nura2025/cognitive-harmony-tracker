
import React from 'react';
import { Card } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border overflow-hidden">
      <div className="bg-black p-6 rounded-lg h-full">
        {children}
      </div>
    </Card>
  );
};

export default AuthCard;
