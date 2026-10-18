import React, { useRef, useState } from 'react';
import type { SeniorOfficer, OfficerInput } from '../models/types';
import { useData } from '../storage/DataContext';
import { isValidPhone } from '../utils/phone';
import Field from './Field';
import DateField from './DateField';
import Button from './Button';
import FormScreen from './FormScreen';
import DistrictField from './DistrictField';
import PhotoPicker from './PhotoPicker';
import EmptyState from './EmptyState';

interface Props {
  officerId?: string;
  onSaved: () => void;
}

interface FormState {
  name: string;
  rank: string;
  prNo: string;
  district: string;
  workingUnit: string;
  dob: string;
  enlistmentDate: string;
  dot: string;
  remarks: string;
  address: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  photoUri: string;
}

const fromOfficer = (o?: SeniorOfficer): FormState => ({
  name: o?.name ?? '',
  rank: o?.rank ?? '',
  prNo: o?.prNo ?? '',
  district: o?.district ?? '',
  workingUnit: o?.workingUnit ?? '',
  dob: o?.dob ?? '',
  enlistmentDate: o?.enlistmentDate ?? '',
  dot: o?.dot ?? '',
  remarks: o?.remarks ?? '',
  address: o?.address ?? '',
  phoneNumber: o?.phoneNumber ?? '',
  alternatePhoneNumber: o?.alternatePhoneNumber ?? '',
  photoUri: o?.photoUri ?? '',
});

export default function OfficerFormView({ officerId, onSaved }: Props) {
  const { getOfficer, addOfficer, updateOfficer, addDistrict } = useData();
  const existing = getOfficer(officerId);
  const [f, setF] = useState<FormState>(() => fromOfficer(existing));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saving = useRef(false);
  const set = (k: keyof FormState) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  if (officerId && !existing) {
    return <EmptyState icon="alert-circle-outline" title="Senior Officer not found" />;
  }

  const save = () => {
    if (saving.current) return;
    const e: Record<string, string> = {};
    const msg = 'Please enter a valid phone number (7 to 15 digits).';
    if (!isValidPhone(f.phoneNumber)) e.phoneNumber = msg;
    if (!isValidPhone(f.alternatePhoneNumber)) e.alternatePhoneNumber = msg;
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const input: OfficerInput = { ...f };
    saving.current = true;
    if (f.district.trim()) addDistrict(f.district);
    if (existing) updateOfficer(existing.id, input);
    else addOfficer(input);
    onSaved();
  };

  return (
    <FormScreen>
      <PhotoPicker uri={f.photoUri} onChange={set('photoUri')} />
      <Field label="Name" value={f.name} onChangeText={set('name')} autoCapitalize="words" />
      <Field label="Rank" value={f.rank} onChangeText={set('rank')} autoCapitalize="words" />
      <Field label="PR No" value={f.prNo} onChangeText={set('prNo')} autoCapitalize="characters" />
      <DistrictField label="District" value={f.district} onChangeText={set('district')} />
      <Field label="Working Unit" value={f.workingUnit} onChangeText={set('workingUnit')} autoCapitalize="words" />
      <DateField label="DOB" value={f.dob} onChange={set('dob')} />
      <DateField label="Enlistment Date" value={f.enlistmentDate} onChange={set('enlistmentDate')} />
      <DateField label="DOT" value={f.dot} onChange={set('dot')} />
      <Field label="Remarks" multiline value={f.remarks} onChangeText={set('remarks')} />
      <Field label="Address" multiline value={f.address} onChangeText={set('address')} />
      <Field
        label="PH No"
        keyboardType="phone-pad"
        value={f.phoneNumber}
        onChangeText={set('phoneNumber')}
        error={errors.phoneNumber}
      />
      <Field
        label="Alternate Phone No"
        keyboardType="phone-pad"
        value={f.alternatePhoneNumber}
        onChangeText={set('alternatePhoneNumber')}
        error={errors.alternatePhoneNumber}
      />
      <Button title={existing ? 'Save Changes' : 'Save Senior Officer'} icon="checkmark" onPress={save} />
    </FormScreen>
  );
}
