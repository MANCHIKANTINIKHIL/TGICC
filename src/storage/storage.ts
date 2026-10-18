import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Delegate, Region, SeniorOfficer } from '../models/types';
import { parseStorage } from '../utils/dates';

const KEY = 'tgicc:data:v1';

export const emptyData = (): AppData => ({
  regions: [],
  delegates: [],
  officers: [],
  districts: [],
  profile: { name: '', district: '' },
});

const opt = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
};
const optDate = (v: unknown): string | undefined => {
  const s = opt(v);
  return s && parseStorage(s) ? s : undefined;
};
const rec = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;

function parseRegions(v: unknown): Region[] {
  if (!Array.isArray(v)) return [];
  const out: Region[] = [];
  for (const item of v) {
    const x = rec(item);
    if (!x) continue;
    const id = opt(x.id);
    const name = opt(x.name);
    if (id && name) out.push({ id, name, districtName: opt(x.districtName) ?? '' });
  }
  return out;
}

function parseDelegates(v: unknown): Delegate[] {
  if (!Array.isArray(v)) return [];
  const out: Delegate[] = [];
  for (const item of v) {
    const x = rec(item);
    if (!x) continue;
    const id = opt(x.id);
    const regionId = opt(x.regionId);
    if (!id || !regionId) continue;
    out.push({
      id,
      regionId,
      name: opt(x.name) ?? '',
      rank: opt(x.rank),
      prNo: opt(x.prNo),
      district: opt(x.district),
      workingUnit: opt(x.workingUnit),
      dob: optDate(x.dob),
      enlistmentDate: optDate(x.enlistmentDate),
      dot: optDate(x.dot),
      remarks: opt(x.remarks),
      address: opt(x.address),
      phoneNumber: opt(x.phoneNumber),
      alternatePhoneNumber: opt(x.alternatePhoneNumber),
      photoUri: opt(x.photoUri),
    });
  }
  return out;
}

function parseOfficers(v: unknown): SeniorOfficer[] {
  if (!Array.isArray(v)) return [];
  const out: SeniorOfficer[] = [];
  for (const item of v) {
    const x = rec(item);
    if (!x) continue;
    const id = opt(x.id);
    if (!id) continue;
    out.push({
      id,
      name: opt(x.name) ?? '',
      rank: opt(x.rank),
      prNo: opt(x.prNo),
      district: opt(x.district),
      workingUnit: opt(x.workingUnit),
      dob: optDate(x.dob),
      enlistmentDate: optDate(x.enlistmentDate),
      dot: optDate(x.dot),
      remarks: opt(x.remarks),
      address: opt(x.address),
      phoneNumber: opt(x.phoneNumber),
      alternatePhoneNumber: opt(x.alternatePhoneNumber),
      photoUri: opt(x.photoUri),
    });
  }
  return out;
}

function parseDistricts(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of v) {
    const s = opt(item);
    if (s && !seen.has(s.toLowerCase())) {
      seen.add(s.toLowerCase());
      out.push(s);
    }
  }
  return out;
}

/** Never throws. Returns empty data on any problem. */
export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return emptyData();
    const x = rec(JSON.parse(raw));
    if (!x) return emptyData();
    const p = rec(x.profile);
    return {
      regions: parseRegions(x.regions),
      delegates: parseDelegates(x.delegates),
      officers: parseOfficers(x.officers),
      districts: parseDistricts(x.districts),
      profile: { name: opt(p?.name) ?? '', district: opt(p?.district) ?? '' },
    };
  } catch (e) {
    console.warn('TGICC: failed to load data', e);
    return emptyData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}
