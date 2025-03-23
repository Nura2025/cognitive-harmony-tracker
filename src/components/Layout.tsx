
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Navbar } from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar defaultOpen={!isMobile}>
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
            <h1 className="text-xl font-bold text-sidebar-foreground">NURA</h1>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <Sidebar.NavItem to="/" icon="layout-dashboard">Dashboard</Sidebar.NavItem>
              <Sidebar.NavItem to="/patients" icon="users">Patients</Sidebar.NavItem>
              <Sidebar.NavItem to="/analysis" icon="bar-chart">Analysis</Sidebar.NavItem>
              <Sidebar.NavItem to="/sessions" icon="calendar">Sessions</Sidebar.NavItem>
              <Sidebar.NavItem to="/reports" icon="file-text">Reports</Sidebar.NavItem>
            </div>
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-sm text-sidebar-foreground opacity-80">Connected</span>
            </div>
          </div>
        </div>
      </Sidebar>
      
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
