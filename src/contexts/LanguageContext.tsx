
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Translation dictionary with improved Arabic translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Dashboard and Navigation
    dashboard: 'Dashboard',
    overview: 'Overview',
    patients: 'Patients',
    analysis: 'Analysis',
    sessions: 'Sessions',
    reports: 'Reports',
    recentActivity: 'Recent Activity',
    upcomingSessions: 'Upcoming Sessions',
    patientProgress: 'Patient Progress',
    viewAll: 'View All',
    todaysSessions: 'Today\'s Sessions',
    noSessions: 'No sessions scheduled for today',
    
    // Common UI elements
    darkMode: 'Dark Mode',
    connected: 'Connected',
    search: 'Search patients, sessions...',
    settings: 'Settings',
    profile: 'Profile',
    preferences: 'Preferences',
    notifications: 'Notifications',
    account: 'My Account',
    accountSettings: 'Account Settings',
    support: 'Support',
    logout: 'Log out',
    logoutSuccess: 'You have been logged out successfully',
    
    // Report translations
    clinicalReport: 'Clinical Assessment Report',
    downloadPdf: 'Download PDF Report',
    executiveSummary: 'Executive Summary',
    recommendations: 'Recommendations',
    metricsOverTime: 'Individual Metrics Over Time',
    performanceComparison: 'Before vs. After Performance Comparison',
    comparativeAnalysis: 'Comparative Analysis',
    firstSession: 'First Session',
    latestSession: 'Latest Session',
    change: '% Change',
    attention: 'Attention',
    memory: 'Memory',
    processingSpeed: 'Processing Speed',
    executiveFunction: 'Executive Function',
    overall: 'Overall',
    date: 'Date',
    
    attentionExplanation: 'Measures the ability to focus on specific stimuli while filtering out distractions',
    memoryExplanation: 'Evaluates the capacity to store, retain, and recall information',
    processingSpeedExplanation: 'Assesses how quickly cognitive tasks can be performed',
    executiveFunctionExplanation: 'Measures higher-level cognitive skills including planning, problem-solving, and cognitive flexibility',
    overallExplanation: 'Combined assessment of all cognitive domains',
    responseTimeExplanation: 'Average time taken to respond to stimuli, measured in seconds',
    impulsivityExplanation: 'Number of commission errors due to responding without adequate processing',
    inattentionExplanation: 'Number of omission errors due to failure to respond to target stimuli',
    crossGameExplanation: 'Performance comparison across different cognitive exercises',
    
    // Patient management translations
    managePatientProfiles: 'Manage patient profiles and assessment data',
    addPatient: 'Add Patient',
    searchPatientsByName: 'Search patients by name...',
    patientName: 'Patient Name',
    age: 'Age',
    adhdSubtype: 'ADHD Subtype',
    lastSession: 'Last Session',
    percentile: 'Percentile',
    actions: 'Actions',
    viewAnalysis: 'View analysis',
    viewReports: 'View reports',
    filters: 'Filters',
    resetFilters: 'Reset filters',
    adhdSubtypes: 'ADHD Subtypes',
    ageRange: 'Age Range',
    years: 'years',
    inattentive: 'Inattentive',
    hyperactive: 'Hyperactive-Impulsive',
    combined: 'Combined',
    retry: 'Retry',
    retrying: 'Retrying',

    // Session related
    sessionDetails: 'Session Details',
    duration: 'Duration',
    completionRate: 'Completion Rate',
    startSession: 'Start Session',
    endSession: 'End Session',
    reschedule: 'Reschedule',
    cancel: 'Cancel',
    minutes: 'minutes',
    
    // Status and metrics
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    cancelled: 'Cancelled',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    needsImprovement: 'Needs Improvement',
    
    // Common actions
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
  },
  ar: {
    // Dashboard and Navigation
    dashboard: 'لوحة المعلومات',
    overview: 'نظرة عامة',
    patients: 'المرضى',
    analysis: 'التحليل',
    sessions: 'الجلسات',
    reports: 'التقارير',
    recentActivity: 'النشاط الأخير',
    upcomingSessions: 'الجلسات القادمة',
    patientProgress: 'تقدم المريض',
    viewAll: 'عرض الكل',
    todaysSessions: 'جلسات اليوم',
    noSessions: 'لا توجد جلسات مجدولة لليوم',
    
    // Common UI elements
    darkMode: 'الوضع المظلم',
    connected: 'متصل',
    search: 'بحث عن المرضى، الجلسات...',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    preferences: 'التفضيلات',
    notifications: 'الإشعارات',
    account: 'حسابي',
    accountSettings: 'إعدادات الحساب',
    support: 'الدعم الفني',
    logout: 'تسجيل الخروج',
    logoutSuccess: 'تم تسجيل الخروج بنجاح',
    
    // Report translations
    clinicalReport: 'تقرير التقييم السريري',
    downloadPdf: 'تحميل التقرير بصيغة PDF',
    executiveSummary: 'الملخص التنفيذي',
    recommendations: 'التوصيات',
    metricsOverTime: 'المقاييس الفردية على مدار الوقت',
    performanceComparison: 'مقارنة الأداء قبل وبعد',
    comparativeAnalysis: 'التحليل المقارن',
    firstSession: 'الجلسة الأولى',
    latestSession: 'الجلسة الأخيرة',
    change: 'نسبة التغيير %',
    attention: 'الانتباه',
    memory: 'الذاكرة',
    processingSpeed: 'سرعة المعالجة',
    executiveFunction: 'الوظائف التنفيذية',
    overall: 'التقييم العام',
    date: 'التاريخ',
    
    attentionExplanation: 'يقيس القدرة على التركيز على المثيرات المحددة مع تصفية المشتتات',
    memoryExplanation: 'تقييم القدرة على تخزين واسترجاع المعلومات والاحتفاظ بها',
    processingSpeedExplanation: 'تقييم مدى سرعة إنجاز المهام المعرفية',
    executiveFunctionExplanation: 'يقيس المهارات المعرفية العليا بما في ذلك التخطيط وحل المشكلات والمرونة الإدراكية',
    overallExplanation: 'التقييم الشامل لجميع المجالات المعرفية',
    responseTimeExplanation: 'متوسط الوقت المستغرق للاستجابة للمثيرات، مقاس بالثواني',
    impulsivityExplanation: 'عدد أخطاء الاستجابة الناتجة عن الرد دون معالجة كافية',
    inattentionExplanation: 'عدد أخطاء الإغفال بسبب الفشل في الاستجابة للمثيرات المستهدفة',
    crossGameExplanation: 'مقارنة الأداء عبر التمارين المعرفية المختلفة',
    
    // Patient management translations
    managePatientProfiles: 'إدارة ملفات المرضى وبيانات التقييم',
    addPatient: 'إضافة مريض',
    searchPatientsByName: 'البحث عن المرضى بالاسم...',
    patientName: 'اسم المريض',
    age: 'العمر',
    adhdSubtype: 'نوع اضطراب فرط الحركة ونقص الانتباه',
    lastSession: 'آخر جلسة',
    percentile: 'النسبة المئوية',
    actions: 'الإجراءات',
    viewAnalysis: 'عرض التحليل',
    viewReports: 'عرض التقارير',
    filters: 'الفلاتر',
    resetFilters: 'إعادة تعيين الفلاتر',
    adhdSubtypes: 'أنواع اضطراب فرط الحركة ونقص الانتباه',
    ageRange: 'الفئة العمرية',
    years: 'سنوات',
    inattentive: 'نقص الانتباه',
    hyperactive: 'فرط الحركة والاندفاع',
    combined: 'مشترك',
    retry: 'إعادة المحاولة',
    retrying: 'جاري إعادة المحاولة',

    // Session related
    sessionDetails: 'تفاصيل الجلسة',
    duration: 'المدة',
    completionRate: 'معدل الإكمال',
    startSession: 'بدء الجلسة',
    endSession: 'إنهاء الجلسة',
    reschedule: 'إعادة جدولة',
    cancel: 'إلغاء',
    minutes: 'دقائق',
    
    // Status and metrics
    completed: 'مكتمل',
    inProgress: 'قيد التنفيذ',
    notStarted: 'لم يبدأ',
    cancelled: 'ملغى',
    high: 'مرتفع',
    medium: 'متوسط',
    low: 'منخفض',
    excellent: 'ممتاز',
    good: 'جيد',
    average: 'متوسط',
    needsImprovement: 'يحتاج إلى تحسين',
    
    // Common actions
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add special class for RTL layout
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Store language preference
    localStorage.setItem('language', language);
  }, [language]);
  
  // Load preferred language on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
