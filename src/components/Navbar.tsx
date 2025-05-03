
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
    <div className="h-14 sm:h-16 border-b border-border flex items-center justify-between px-3 sm:px-4 bg-background z-10">
      <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''} ${language === 'ar' ? 'space-x-reverse' : 'space-x-2 sm:space-x-4'}`}>
        <SidebarTrigger className="lg:hidden" />
        <div className="relative w-full max-w-[180px] sm:max-w-[300px]">
          <Search className={`absolute ${language === 'ar' ? 'right-2' : 'left-2'} top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground`} />
          <Input
            placeholder={t('search')}
            className={`${language === 'ar' ? 'pr-7 sm:pr-8 text-right' : 'pl-7 sm:pl-8'} h-8 sm:h-9 w-full bg-background border-border text-xs sm:text-sm rounded-full`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
      </div>
      
      <div className={`flex items-center gap-1 sm:gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <LanguageToggle />
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 relative">
          <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-destructive rounded-full"></span>
        </Button>
        
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </Button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`relative flex items-center gap-1 sm:gap-2 h-8 sm:h-9 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              <div className={`hidden md:block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-xs sm:text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.role || "Clinical Psychologist"}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className={`w-48 sm:w-56 ${language === 'ar' ? 'text-right' : ''}`}>
            <DropdownMenuLabel className="text-xs sm:text-sm">{t('account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/my-account" className={`text-xs sm:text-sm ${language === 'ar' ? 'flex flex-row-reverse w-full' : ''}`}>{t('profile')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className={`text-xs sm:text-sm ${language === 'ar' ? 'flex flex-row-reverse w-full' : ''}`}>{t('accountSettings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className={`text-xs sm:text-sm ${language === 'ar' ? 'flex flex-row-reverse w-full' : ''}`}>{t('support')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className={`text-destructive focus:text-destructive flex items-center text-xs sm:text-sm ${language === 'ar' ? 'flex-row-reverse w-full' : ''}`}
            >
              <LogOut className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${language === 'ar' ? 'ml-1.5 sm:ml-2' : 'mr-1.5 sm:mr-2'}`} />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
