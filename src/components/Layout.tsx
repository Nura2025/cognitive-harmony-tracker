
import React, { useState } from 'react';
import { Navbar } from './Navbar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Brain, ClipboardList, FileText, Home, LineChart, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { title: "Dashboard", path: "/", icon: Home },
    { title: "Patients", path: "/patients", icon: Users },
    { title: "Cognitive Analysis", path: "/analysis", icon: Brain },
    { title: "Session Data", path: "/sessions", icon: LineChart },
    { title: "Reports", path: "/reports", icon: FileText },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-sidebar-primary" />
          <div>
            <h3 className="font-bold text-sidebar-foreground">CogniTrack</h3>
            <p className="text-xs text-sidebar-foreground/70">ADHD Analytics</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    active={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center cursor-pointer">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/70 flex items-center">
          <ClipboardList className="w-4 h-4 mr-1" />
          <span>v1.0.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 bg-background animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
