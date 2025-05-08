
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad, Star, Award } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Nura
          </h1>
          <p className="text-xl text-muted-foreground">
            A 2D pixel art farming RPG designed to support children with attention challenges
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full">
              <Gamepad className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mt-3">Engaging Mini-Games</h3>
            <p className="text-sm text-muted-foreground mt-1">Three adaptive games targeting focus and memory skills</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mt-3">Farm & Explore</h3>
            <p className="text-sm text-muted-foreground mt-1">Complete tasks and interact with NPCs in a vibrant world</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mt-3">Track Progress</h3>
            <p className="text-sm text-muted-foreground mt-1">Detailed reports to monitor attention improvements</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/patients')}>
            Manage Players
          </Button>
        </div>
        
        <div className="mt-16 text-sm text-muted-foreground">
          <p>Developed by Ayah Al Tamimi, Bakeza Diazada, and Daniella Anastas</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
