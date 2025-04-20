
export const getDomainInsights = (domain: string, score: number): string[] => {
  if (score < 60) {
    switch (domain) {
      case 'attention':
        return [
          'Difficulty maintaining sustained attention during extended tasks',
          'Increased susceptibility to distractions in the environment',
          'Inconsistent performance over time with fluctuating focus'
        ];
      case 'memory':
        return [
          'Challenges with working memory tasks requiring information retention',
          'Difficulty recalling sequential information accurately',
          'Better performance with visual memory compared to verbal memory'
        ];
      case 'executiveFunction':
        return [
          'Struggles with planning and organizing multi-step activities',
          'Difficulty adjusting to changing task requirements',
          'Challenges with inhibitory control in response-based activities'
        ];
      case 'behavioral':
      case 'impulseControl':
        return [
          'Exhibits impulsive responses before fully processing information',
          'Difficulty managing frustration during challenging tasks',
          'Inconsistent self-monitoring during extended activities'
        ];
      default:
        return [];
    }
  }
  
  switch (domain) {
    case 'attention':
      return [
        'Shows good sustained attention across multiple activities',
        'Successfully filters distractions during focused tasks',
        'Consistent performance across different attention requirements'
      ];
    case 'memory':
      return [
        'Strong working memory capabilities across varied tasks',
        'Effectively retains and manipulates information when needed',
        'Shows appropriate memory strategies during complex tasks'
      ];
    case 'executiveFunction':
      return [
        'Demonstrates effective planning and organizational skills',
        'Good cognitive flexibility when adapting to changing requirements',
        'Shows appropriate inhibitory control during challenging activities'
      ];
    case 'behavioral':
    case 'impulseControl':
      return [
        'Maintains appropriate response control during activities',
        'Manages frustration effectively during challenging segments',
        'Shows consistent self-monitoring throughout sessions'
      ];
    default:
      return [];
  }
};
