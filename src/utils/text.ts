/** Trim; return undefined when empty. */
export function clean(v?: string | null): string | undefined {
  const t = (v ?? '').trim();
  return t.length ? t : undefined;
}
export function displayName(name?: string | null): string {
  return clean(name) ?? 'Unnamed Delegate';
}
export function displayOfficerName(name?: string | null): string {
  return clean(name) ?? 'Unnamed Officer';
}
export const NOT_PROVIDED = 'Not provided';
export function orNotProvided(v?: string | null): string {
  return clean(v) ?? NOT_PROVIDED;
}
