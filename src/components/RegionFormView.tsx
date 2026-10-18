import React, { useRef, useState } from 'react';
import Field from './Field';
import Button from './Button';
import FormScreen from './FormScreen';
import DistrictField from './DistrictField';
import EmptyState from './EmptyState';
import { useData } from '../storage/DataContext';

interface Props {
  regionId?: string;
  onSaved: () => void;
}

export default function RegionFormView({ regionId, onSaved }: Props) {
  const { getRegion, addRegion, updateRegion, addDistrict } = useData();
  const existing = getRegion(regionId);
  const [name, setName] = useState(existing?.name ?? '');
  const [districtName, setDistrictName] = useState(existing?.districtName ?? '');
  const [errors, setErrors] = useState<{ name?: string; districtName?: string }>({});
  const saving = useRef(false);

  if (regionId && !existing) {
    return <EmptyState icon="alert-circle-outline" title="Region not found" />;
  }

  const save = () => {
    if (saving.current) return;
    const e: { name?: string; districtName?: string } = {};
    if (!name.trim()) e.name = 'Please enter Region Name.';
    if (!districtName.trim()) e.districtName = 'Please enter District Name.';
    setErrors(e);
    if (e.name || e.districtName) return;
    saving.current = true;
    addDistrict(districtName);
    if (existing) updateRegion(existing.id, { name, districtName });
    else addRegion({ name, districtName });
    onSaved();
  };

  return (
    <FormScreen>
      <Field label="Region Name" required value={name} onChangeText={setName} error={errors.name} autoCapitalize="words" />
      <DistrictField
        label="District Name"
        required
        value={districtName}
        onChangeText={setDistrictName}
        error={errors.districtName}
      />
      <Button title={existing ? 'Save Changes' : 'Save Region'} icon="checkmark" onPress={save} />
    </FormScreen>
  );
}
