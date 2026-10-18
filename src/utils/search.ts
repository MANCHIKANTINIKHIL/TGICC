import type { Delegate, Region, SeniorOfficer } from '../models/types';

export function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function hay(parts: (string | undefined)[]): string {
  const out: string[] = [];
  for (const p of parts) {
    if (!p) continue;
    out.push(p);
    const digits = p.replace(/\D/g, '');
    if (digits.length >= 3 && digits !== p) out.push(digits); // match phones typed without spaces/dashes
  }
  return out.join(' ').toLowerCase();
}

export function allTokensMatch(haystack: string, tokens: string[]): boolean {
  return tokens.every((t) => haystack.includes(t));
}

export function regionHaystack(r: Region): string {
  return hay([r.name, r.districtName]);
}

export function delegateHaystack(d: Delegate, region?: Region): string {
  return hay([
    d.name,
    d.rank,
    d.prNo,
    d.district,
    d.workingUnit,
    d.phoneNumber,
    d.alternatePhoneNumber,
    d.address,
    d.remarks,
    region?.name,
    region?.districtName,
  ]);
}

export function officerHaystack(o: SeniorOfficer): string {
  return hay([
    o.name,
    o.rank,
    o.prNo,
    o.district,
    o.workingUnit,
    o.phoneNumber,
    o.alternatePhoneNumber,
    o.address,
    o.remarks,
  ]);
}
