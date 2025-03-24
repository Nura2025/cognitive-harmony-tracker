
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

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Choose a random element from an array
 */
export function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
