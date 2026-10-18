import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Delegate, DelegateInput, RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { isValidPhone } from '../utils/phone';
import Field from './Field';
import DateField from './DateField';
import Button from './Button';
import FormScreen from './FormScreen';
import RegionPicker from './RegionPicker';
import DistrictField from './DistrictField';
import PhotoPicker from './PhotoPicker';
import EmptyState from './EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  regionId?: string; // preselected + locked (when adding from a Region)
  delegateId?: string; // edit mode
  onSaved: (regionId: string) => void;
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

const fromDelegate = (d?: Delegate): FormState => ({
  name: d?.name ?? '',
  rank: d?.rank ?? '',
  prNo: d?.prNo ?? '',
  district: d?.district ?? '',
  workingUnit: d?.workingUnit ?? '',
  dob: d?.dob ?? '',
  enlistmentDate: d?.enlistmentDate ?? '',
  dot: d?.dot ?? '',
  remarks: d?.remarks ?? '',
  address: d?.address ?? '',
  phoneNumber: d?.phoneNumber ?? '',
  alternatePhoneNumber: d?.alternatePhoneNumber ?? '',
  photoUri: d?.photoUri ?? '',
});

export default function DelegateFormView({ regionId, delegateId, onSaved }: Props) {
  const nav = useNavigation<Nav>();
  const { regions, getDelegate, getRegion, addDelegate, updateDelegate, addDistrict } = useData();
  const existing = getDelegate(delegateId);
  const [selRegion, setSelRegion] = useState<string | undefined>(existing?.regionId ?? regionId);
  const [f, setF] = useState<FormState>(() => fromDelegate(existing));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saving = useRef(false);

  const set = (k: keyof FormState) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  if (delegateId && !existing) {
    return <EmptyState icon="alert-circle-outline" title="Delegate not found" />;
  }
  if (!existing && regions.length === 0) {
    return (
      <EmptyState
        icon="map-outline"
        title="Please add a Region first."
        message="A Delegate must belong to a Region."
        actionLabel="Add Region"
        onAction={() => nav.navigate('RegionForm')}
      />
    );
  }

  const locked = !!regionId && !existing;
  const lockedRegion = getRegion(regionId);

  const save = () => {
    if (saving.current) return;
    const e: Record<string, string> = {};
    if (!selRegion || !regions.some((r) => r.id === selRegion)) e.region = 'Please select a Region.';
    const phoneMsg = 'Please enter a valid phone number (7 to 15 digits).';
    if (!isValidPhone(f.phoneNumber)) e.phoneNumber = phoneMsg;
    if (!isValidPhone(f.alternatePhoneNumber)) e.alternatePhoneNumber = phoneMsg;
    setErrors(e);
    if (Object.keys(e).length > 0 || !selRegion) return;

    const input: DelegateInput = {
      regionId: selRegion,
      name: f.name,
      rank: f.rank,
      prNo: f.prNo,
      district: f.district,
      workingUnit: f.workingUnit,
      dob: f.dob,
      enlistmentDate: f.enlistmentDate,
      dot: f.dot,
      remarks: f.remarks,
      address: f.address,
      phoneNumber: f.phoneNumber,
      alternatePhoneNumber: f.alternatePhoneNumber,
      photoUri: f.photoUri,
    };
    saving.current = true;
    if (f.district.trim()) addDistrict(f.district);
    if (existing) updateDelegate(existing.id, input);
    else addDelegate(input);
    onSaved(selRegion);
  };

  return (
    <FormScreen>
      {locked ? (
        <View style={styles.lockedBox}>
          <Text style={styles.lockedLabel}>Region</Text>
          <Text style={styles.lockedValue}>
            {lockedRegion ? `${lockedRegion.name} (${lockedRegion.districtName})` : 'Unknown Region'}
          </Text>
        </View>
      ) : (
        <RegionPicker regions={regions} selectedId={selRegion} onSelect={setSelRegion} error={errors.region} />
      )}

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
        label="Phone Number"
        keyboardType="phone-pad"
        value={f.phoneNumber}
        onChangeText={set('phoneNumber')}
        error={errors.phoneNumber}
      />
      <Field
        label="Alternate Phone Number"
        keyboardType="phone-pad"
        value={f.alternatePhoneNumber}
        onChangeText={set('alternatePhoneNumber')}
        error={errors.alternatePhoneNumber}
      />
      <Button title={existing ? 'Save Changes' : 'Save Delegate'} icon="checkmark" onPress={save} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  lockedBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    marginBottom: 14,
  },
  lockedLabel: { fontSize: 12, color: colors.muted },
  lockedValue: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 2 },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    marginBottom: 14,
  },
  photoTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  photoHint: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
