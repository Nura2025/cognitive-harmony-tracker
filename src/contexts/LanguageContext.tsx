import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'ar' || savedLanguage === 'en' ? savedLanguage : 'en') as Language;
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const translations = {
    en: {
      dashboard: 'Dashboard',
      patients: 'Patients',
      analysis: 'Analysis',
      sessions: 'Sessions',
      reports: 'Reports',
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
      
      attentionExplanation: 'Measures the ability to focus on specific stimuli while filtering out distractions',
      memoryExplanation: 'Evaluates the capacity to store, retain, and recall information',
      processingSpeedExplanation: 'Assesses how quickly cognitive tasks can be performed',
      executiveFunctionExplanation: 'Measures higher-level cognitive skills including planning, problem-solving, and cognitive flexibility',
      overallExplanation: 'Combined assessment of all cognitive domains',
      responseTimeExplanation: 'Average time taken to respond to stimuli, measured in seconds',
      impulsivityExplanation: 'Number of commission errors due to responding without adequate processing',
      inattentionExplanation: 'Number of omission errors due to failure to respond to target stimuli',
      crossGameExplanation: 'Performance comparison across different cognitive exercises',
      
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
      
      // Cognitive domains
      attention: 'Attention',
      memory: 'Memory',
      executiveFunction: 'Executive Function',
      impulseControl: 'Impulse Control',
      
      // Component breakdowns
      workingMemory: 'Working Memory',
      visualMemory: 'Visual Memory',
      sequencingMemory: 'Sequencing Memory',
      patternRecognition: 'Pattern Recognition',
      inhibitoryControl: 'Inhibitory Control',
      responseControl: 'Response Control',
      decisionSpeed: 'Decision Speed',
      errorAdaptation: 'Error Adaptation',
      
      // Classifications
      excellent: 'Excellent',
      good: 'Good',
      average: 'Average',
      belowAverage: 'Below Average',
      concern: 'Concern',
      
      // Progress charts
      period: 'Period',
      days: 'Days',
      fromLastAssessment: 'from last assessment',
      
      // Cognitive analysis
      cognitiveAnalysis: 'Cognitive Analysis',
      cognitiveAnalysisDescription: 'Comprehensive analysis of cognitive performance across domains',
      rawScore: 'Raw Score',
      percentile: 'Percentile',
      score: 'Score',
      
      // Domain progress
      attentionProgress: 'Attention Progress',
      memoryProgress: 'Memory Progress',
      executiveFunctionProgress: 'Executive Function Progress',
      impulseControlProgress: 'Impulse Control Progress',
      
      // Component groupings
      memoryComponents: 'Memory Components',
      impulseControlComponents: 'Impulse Control Components',
      
      // Comparison data
      userProfile: 'User Profile',
      ageBasedNormative: 'Age-Based Normative',
      adhdComparison: 'ADHD Comparison'
    },
    ar: {
      dashboard: 'لوحة المعلومات',
      patients: 'المرضى',
      analysis: 'التحليل',
      sessions: 'الجلسات',
      reports: 'التقارير',
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
      
      attentionExplanation: 'يقيس القدرة على التركيز على المثيرات المحددة مع تصفية المشتتات',
      memoryExplanation: 'تقييم القدرة على تخزين واسترجاع المعلومات والاحتفاظ بها',
      processingSpeedExplanation: 'تقييم مدى سرعة إنجاز المهام المعرفية',
      executiveFunctionExplanation: 'يقيس المهارات المعرفية العليا بما في ذلك التخطيط وحل المشكلات والمرونة الإدراكية',
      overallExplanation: 'التقييم الشامل لجميع المجالات المعرفية',
      responseTimeExplanation: 'متوسط الوقت المستغرق للاستجابة للمثيرات، مقاس بالثواني',
      impulsivityExplanation: 'عدد أخطاء الاستجابة الناتجة عن الرد دون معالجة كافية',
      inattentionExplanation: 'عدد أخطاء الإغفال بسبب الفشل في الاستجابة للمثيرات المستهدفة',
      crossGameExplanation: 'مقارنة الأداء عبر التمارين المعرفية المختلفة',
      
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
      
      // Cognitive domains
      attention: 'الانتباه',
      memory: 'الذاكرة',
      executiveFunction: 'الوظيفة التنفيذية',
      impulseControl: 'ضبط الاندفاع',
      
      // Component breakdowns
      workingMemory: 'الذاكرة العاملة',
      visualMemory: 'الذاكرة البصرية',
      sequencingMemory: 'ذاكرة التسلسل',
      patternRecognition: 'التعرف على الأنماط',
      inhibitoryControl: 'التحكم المثبط',
      responseControl: 'التحكم في الاستجابة',
      decisionSpeed: 'سرعة القرار',
      errorAdaptation: 'التكيف مع الأخطاء',
      
      // Classifications
      excellent: 'ممتاز',
      good: 'جيد',
      average: 'متوسط',
      belowAverage: 'دون المتوسط',
      concern: 'مقلق',
      
      // Progress charts
      period: 'الفترة',
      days: 'يوم',
      fromLastAssessment: 'من التقييم الأخير',
      
      // Cognitive analysis
      cognitiveAnalysis: 'التحليل المعرفي',
      cognitiveAnalysisDescription: 'تحليل شامل للأداء المعرفي عبر المجالات',
      rawScore: 'الدرجة الخام',
      percentile: 'النسبة المئوية',
      score: 'الدرجة',
      
      // Domain progress
      attentionProgress: 'تقدم الانتباه',
      memoryProgress: 'تقدم الذاكرة',
      executiveFunctionProgress: 'تقدم الوظيفة التنفيذية',
      impulseControlProgress: 'تقدم ضبط الاندفاع',
      
      // Component groupings
      memoryComponents: 'مكونات الذاكرة',
      impulseControlComponents: 'مكونات ضبط الاندفاع',
      
      // Comparison data
      userProfile: 'ملف المستخدم',
      ageBasedNormative: 'المعيارية المستندة إلى العمر',
      adhdComparison: 'مقارنة مع اضطراب فرط الحركة ونقص الانتباه'
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      dir: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
