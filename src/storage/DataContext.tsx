import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  AppData,
  Delegate,
  DelegateInput,
  OfficerInput,
  Profile,
  Region,
  SeniorOfficer,
} from '../models/types';
import { emptyData, loadData, saveData } from './storage';
import { genId } from '../utils/id';
import { clean } from '../utils/text';

interface Ctx extends AppData {
  loaded: boolean;
  getRegion: (id?: string) => Region | undefined;
  getDelegate: (id?: string) => Delegate | undefined;
  getOfficer: (id?: string) => SeniorOfficer | undefined;
  addRegion: (i: { name: string; districtName: string }) => Region;
  updateRegion: (id: string, i: { name: string; districtName: string }) => void;
  deleteRegion: (id: string) => void;
  addDelegate: (i: DelegateInput) => Delegate;
  updateDelegate: (id: string, i: DelegateInput) => void;
  deleteDelegate: (id: string) => void;
  addOfficer: (i: OfficerInput) => SeniorOfficer;
  updateOfficer: (id: string, i: OfficerInput) => void;
  deleteOfficer: (id: string) => void;
  addDistrict: (name: string) => boolean;
  removeDistrict: (name: string) => void;
  setProfile: (p: Profile) => void;
}

const DataCtx = createContext<Ctx | null>(null);

function cleanDelegate(i: DelegateInput): DelegateInput {
  return {
    regionId: i.regionId,
    name: i.name.trim(),
    rank: clean(i.rank),
    prNo: clean(i.prNo),
    district: clean(i.district),
    workingUnit: clean(i.workingUnit),
    dob: clean(i.dob),
    enlistmentDate: clean(i.enlistmentDate),
    dot: clean(i.dot),
    remarks: clean(i.remarks),
    address: clean(i.address),
    phoneNumber: clean(i.phoneNumber),
    alternatePhoneNumber: clean(i.alternatePhoneNumber),
    photoUri: clean(i.photoUri),
  };
}
function cleanOfficer(i: OfficerInput): OfficerInput {
  return {
    name: (i.name ?? '').trim(),
    rank: clean(i.rank),
    prNo: clean(i.prNo),
    district: clean(i.district),
    workingUnit: clean(i.workingUnit),
    dob: clean(i.dob),
    enlistmentDate: clean(i.enlistmentDate),
    dot: clean(i.dot),
    remarks: clean(i.remarks),
    address: clean(i.address),
    phoneNumber: clean(i.phoneNumber),
    alternatePhoneNumber: clean(i.alternatePhoneNumber),
    photoUri: clean(i.photoUri),
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData());
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<AppData>(data);

  useEffect(() => {
    let alive = true;
    loadData().then((d) => {
      if (!alive) return;
      ref.current = d;
      setData(d);
      setLoaded(true);
    });
    // Safety net: never leave the app on the loading screen.
    const timer = setTimeout(() => {
      if (alive) setLoaded(true);
    }, 4000);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const commit = useCallback((next: AppData) => {
    ref.current = next;
    setData(next);
    saveData(next).catch((e) => console.warn('TGICC: failed to save data', e));
  }, []);

  const value = useMemo<Ctx>(() => {
    return {
      ...data,
      loaded,
      getRegion: (id) => (id ? data.regions.find((r) => r.id === id) : undefined),
      getDelegate: (id) => (id ? data.delegates.find((d) => d.id === id) : undefined),
      getOfficer: (id) => (id ? data.officers.find((o) => o.id === id) : undefined),

      addRegion: (i) => {
        const region: Region = {
          id: genId('region'),
          name: i.name.trim(),
          districtName: i.districtName.trim(),
        };
        commit({ ...ref.current, regions: [...ref.current.regions, region] });
        return region;
      },
      updateRegion: (id, i) => {
        commit({
          ...ref.current,
          regions: ref.current.regions.map((r) =>
            r.id === id ? { ...r, name: i.name.trim(), districtName: i.districtName.trim() } : r,
          ),
        });
      },
      deleteRegion: (id) => {
        commit({
          ...ref.current,
          regions: ref.current.regions.filter((r) => r.id !== id),
          delegates: ref.current.delegates.filter((d) => d.regionId !== id),
        });
      },

      addDelegate: (i) => {
        const delegate: Delegate = { id: genId('delegate'), ...cleanDelegate(i) };
        commit({ ...ref.current, delegates: [...ref.current.delegates, delegate] });
        return delegate;
      },
      updateDelegate: (id, i) => {
        commit({
          ...ref.current,
          delegates: ref.current.delegates.map((d) =>
            d.id === id ? { id, ...cleanDelegate(i) } : d,
          ),
        });
      },
      deleteDelegate: (id) => {
        commit({ ...ref.current, delegates: ref.current.delegates.filter((d) => d.id !== id) });
      },

      addOfficer: (i) => {
        const officer: SeniorOfficer = { id: genId('officer'), ...cleanOfficer(i) };
        commit({ ...ref.current, officers: [...ref.current.officers, officer] });
        return officer;
      },
      updateOfficer: (id, i) => {
        commit({
          ...ref.current,
          officers: ref.current.officers.map((o) =>
            o.id === id ? { id, ...cleanOfficer(i) } : o,
          ),
        });
      },
      deleteOfficer: (id) => {
        commit({ ...ref.current, officers: ref.current.officers.filter((o) => o.id !== id) });
      },

      addDistrict: (name) => {
        const n = name.trim();
        if (!n) return false;
        if (ref.current.districts.some((d) => d.toLowerCase() === n.toLowerCase())) return false;
        commit({ ...ref.current, districts: [...ref.current.districts, n] });
        return true;
      },
      removeDistrict: (name) => {
        commit({ ...ref.current, districts: ref.current.districts.filter((d) => d !== name) });
      },
      setProfile: (p) => {
        commit({ ...ref.current, profile: { name: p.name.trim(), district: p.district.trim() } });
      },
    };
  }, [data, loaded, commit]);

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData(): Ctx {
  const c = useContext(DataCtx);
  if (!c) throw new Error('useData must be used inside DataProvider');
  return c;
}
