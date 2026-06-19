/** Capitalize the first letter of a Pokemon name. */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
