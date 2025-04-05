
import React from 'react';
import { BellIcon, Search, Settings, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background z-10">
      <div className={`flex items-center space-x-4 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
      
      <div className={`flex items-center space-x-2 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <LanguageToggle />
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className="w-56">
            <DropdownMenuLabel>{t('settings')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('preferences')}</DropdownMenuItem>
            <DropdownMenuItem>{t('notifications')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-muted-foreground" />
              <div className={`hidden md:block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Clinical Psychologist</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className="w-56">
            <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('accountSettings')}</DropdownMenuItem>
            <DropdownMenuItem>{t('support')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
