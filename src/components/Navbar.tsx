
import React from 'react';
import { BellIcon, Search, Settings, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '@/services/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const Navbar: React.FC = () => {
  const { t, language } = useLanguage();
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    AuthService.logout();
    toast.success(t('logoutSuccess'));
    // Redirect to landing page on logout
    navigate('/');
  };
  
  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background z-10">
      <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : 'space-x-4'}`}>
        <SidebarTrigger className="lg:hidden" />
        <div className="relative w-[300px]">
          <Search className={`absolute ${language === 'ar' ? 'right-2' : 'left-2'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder={t('search')}
            className={`${language === 'ar' ? 'pr-8 text-right' : 'pl-8'} rounded-full h-9 w-full bg-background border-border`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
      </div>
      
      <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <LanguageToggle />
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
        </Button>
        
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-muted-foreground" />
              <div className={`hidden md:block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.role || "Clinical Psychologist"}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className="w-56">
            <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/my-account" className={language === 'ar' ? 'flex flex-row-reverse w-full' : ''}>{t('profile')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className={language === 'ar' ? 'flex flex-row-reverse w-full' : ''}>{t('accountSettings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className={language === 'ar' ? 'flex flex-row-reverse w-full' : ''}>{t('support')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className={`text-destructive focus:text-destructive flex items-center ${language === 'ar' ? 'flex-row-reverse w-full' : ''}`}
            >
              <LogOut className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
