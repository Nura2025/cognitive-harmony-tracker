
import React, { useEffect } from 'react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from '@/components/ui/sidebar';
import { Navbar } from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSessionTimeout } from '@/services/session-manager';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();
  
  // Initialize session timeout tracking
  useSessionTimeout();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className={`min-h-screen flex w-full bg-background ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <Sidebar>
          <div className="flex flex-col h-full">
            <div className={`flex items-center h-16 px-6 border-b border-sidebar-border ${language === 'ar' ? 'justify-end' : ''}`}>
              <h1 className="text-xl font-bold text-sidebar-foreground">NURA</h1>
            </div>
            
            <SidebarContent className="p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t('dashboard')}>
                    <Link to="/dashboard" className={language === 'ar' ? 'flex flex-row-reverse items-center w-full' : ''}>
                      <LayoutDashboard className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                      <span>{t('dashboard')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t('patients')}>
                    <Link to="/patients" className={language === 'ar' ? 'flex flex-row-reverse items-center w-full' : ''}>
                      <Users className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                      <span>{t('patients')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t('analysis')}>
                    <Link to="/analysis" className={language === 'ar' ? 'flex flex-row-reverse items-center w-full' : ''}>
                      <BarChart className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                      <span>{t('analysis')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t('sessions')}>
                    <Link to="/sessions" className={language === 'ar' ? 'flex flex-row-reverse items-center w-full' : ''}>
                      <Calendar className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                      <span>{t('sessions')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            
            <div className="mt-auto p-4 border-t border-sidebar-border">
              <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 rounded-full bg-emerald-500 ${language === 'ar' ? 'ml-2' : 'mr-2'}`}></div>
                <span className="text-sm text-sidebar-foreground opacity-80">{t('connected')}</span>
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
    </SidebarProvider>
  );
};
