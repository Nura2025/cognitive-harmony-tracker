
/**
 * Generate mock recommendations based on ADHD subtype
 */
export const generateRecommendations = (subtypeOrPatient: string | any = ''): string[] => {
  // Common recommendations for all ADHD types
  const commonRecommendations = [
    'Maintain a consistent daily routine and schedule',
    'Use visual timers and reminders for task management',
    'Break down complex tasks into smaller, manageable parts',
    'Incorporate regular physical activity into daily routine',
    'Ensure adequate sleep and nutrition'
  ];
  
  // Determine subtype, handling different input formats
  let subtype = '';
  
  if (typeof subtypeOrPatient === 'string') {
    subtype = subtypeOrPatient.toLowerCase();
  } else if (subtypeOrPatient && subtypeOrPatient.adhd_subtype) {
    subtype = subtypeOrPatient.adhd_subtype.toLowerCase();
  }
  
  // Specific recommendations based on ADHD subtype
  let specificRecommendations: string[] = [];
  
  if (subtype.includes('inattentive')) {
    specificRecommendations = [
      'Use external organizers like planners or apps to help with forgetfulness',
      'Create a distraction-free work environment',
      'Implement the "Pomodoro Technique" for focused work sessions',
      'Use color-coding and visual organizers for information retention',
      'Consider cognitive training focused on working memory and attention'
    ];
  } else if (subtype.includes('hyperactive') || subtype.includes('impulsive')) {
    specificRecommendations = [
      'Incorporate movement breaks between focusing tasks',
      'Use fidget tools that don\'t disrupt others during required seated activities',
      'Practice mindfulness and self-regulation techniques',
      'Implement a token economy or point system for behavioral goals',
      'Consider cognitive behavioral therapy for impulse control'
    ];
  } else if (subtype.includes('combined')) {
    specificRecommendations = [
      'Balance structured activities with opportunities for movement',
      'Use visual schedules and timers for transitions',
      'Practice mindfulness techniques for both attention and hyperactivity',
      'Implement organizational systems that are simple and consistent',
      'Consider multimodal treatment approach including behavioral and cognitive strategies'
    ];
  }
  
  // Return a mix of common and specific recommendations
  return [...commonRecommendations.slice(0, 3), ...specificRecommendations.slice(0, 3)];
};
