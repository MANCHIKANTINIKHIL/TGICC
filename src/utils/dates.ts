const pad = (n: number) => String(n).padStart(2, '0');

/** Date -> "YYYY-MM-DD" using LOCAL parts (no UTC conversion). */
export function toStorage(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM-DD" -> local Date, or null when invalid. */
export function parseStorage(s?: string | null): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

/** "YYYY-MM-DD" -> "DD/MM/YYYY" ('' when empty/invalid). */
export function formatDisplay(s?: string | null): string {
  const dt = parseStorage(s);
  return dt ? `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}` : '';
}
