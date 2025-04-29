
/**
 * Returns the CSS color class for a percentile value gauge
 */
export const getColorClass = (value: number): string => {
  if (value < 16) return "bg-red-500";
  if (value < 50) return "bg-amber-500";
  if (value < 85) return "bg-green-500";
  return "bg-emerald-600";
};

/**
 * Returns the CSS text color class for a percentile value
 */
export const getTextColorClass = (value: number): string => {
  if (value < 16) return "text-red-500";
  if (value < 50) return "text-amber-500";
  if (value < 85) return "text-green-500";
  return "text-emerald-600";
};
