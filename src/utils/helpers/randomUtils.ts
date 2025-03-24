
/**
 * Generate a random date between two dates
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random domain score between 0-100
 */
export function randomDomainScore(): number {
  return Math.floor(Math.random() * 100);
}
