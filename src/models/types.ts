import type { NavigatorScreenParams } from '@react-navigation/native';

export interface Region {
  id: string;
  name: string;
  districtName: string;
}

export interface Delegate {
  id: string;
  regionId: string;
  name: string;
  rank?: string;
  prNo?: string;
  district?: string;
  workingUnit?: string;
  dob?: string; // YYYY-MM-DD
  enlistmentDate?: string; // YYYY-MM-DD
  dot?: string; // YYYY-MM-DD
  remarks?: string;
  address?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  photoUri?: string;
}
export type DelegateInput = Omit<Delegate, 'id'>;

export interface SeniorOfficer {
  id: string;
  name: string; // optional in the UI; '' when not provided
  rank?: string;
  prNo?: string;
  district?: string;
  workingUnit?: string;
  dob?: string; // YYYY-MM-DD
  enlistmentDate?: string; // YYYY-MM-DD
  dot?: string; // YYYY-MM-DD
  remarks?: string;
  address?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  photoUri?: string;
}
export type OfficerInput = Omit<SeniorOfficer, 'id'>;

export interface Profile {
  name: string;
  district: string;
}

export interface AppData {
  regions: Region[];
  delegates: Delegate[];
  officers: SeniorOfficer[];
  districts: string[];
  profile: Profile;
}

export type TabParamList = {
  Home: undefined;
  AddRegion: undefined;
  AddDelegate: undefined;
  Search: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  RegionDetails: { regionId: string };
  RegionForm: { regionId?: string } | undefined;
  DelegateDetails: { delegateId: string };
  DelegateForm: { regionId?: string; delegateId?: string } | undefined;
  Settings: undefined;
  Districts: undefined;
  ManageRegions: undefined;
  ManageDelegates: undefined;
  SeniorOfficers: undefined;
  SeniorOfficerForm: { officerId?: string } | undefined;
  SeniorOfficerDetails: { officerId: string };
};
