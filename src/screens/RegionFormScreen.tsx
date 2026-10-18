import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types';
import RegionFormView from '../components/RegionFormView';

type Props = NativeStackScreenProps<RootStackParamList, 'RegionForm'>;

export default function RegionFormScreen({ navigation, route }: Props) {
  return <RegionFormView regionId={route.params?.regionId} onSaved={() => navigation.goBack()} />;
}
