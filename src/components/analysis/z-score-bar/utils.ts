
/**
 * Returns the CSS color class for a z-score bar
 */
export const getZScoreBarColor = (value: number): string => {
  if (value < -2) return "bg-red-500";
  if (value < -1) return "bg-red-400";
  if (value < 0) return "bg-amber-400";
  if (value < 1) return "bg-amber-500";
  if (value < 2) return "bg-green-500";
  return "bg-emerald-600";
};

/**
 * Returns the CSS text color class for a z-score value
 */
export const getZScoreTextColor = (value: number): string => {
  if (value < -2) return "text-red-500";
  if (value < -1) return "text-red-400";
  if (value < 0) return "text-amber-400";
  if (value < 1) return "text-amber-500";
  if (value < 2) return "text-green-500";
  return "text-emerald-600";
};

/**
 * Calculate position and width for the z-score indicator
 */
export const calculateBarStyles = (value: number): React.CSSProperties => {
  // Clamp z-score between -3 and 3 for visualization purposes
  const clampedValue = Math.max(-3, Math.min(3, value));
  
  // Convert z-score to position percentage (centered at 50% for z=0)
  // -3 => 0%, 0 => 50%, 3 => 100%
  const position = ((clampedValue + 3) / 6) * 100;
  
  return {
    left: `${position}%`,
    transform: 'translateX(-50%)'
  };
};
