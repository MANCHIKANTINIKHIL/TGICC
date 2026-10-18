import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types';
import OfficerFormView from '../components/OfficerFormView';

type Props = NativeStackScreenProps<RootStackParamList, 'SeniorOfficerForm'>;

export default function SeniorOfficerFormScreen({ navigation, route }: Props) {
  return <OfficerFormView officerId={route.params?.officerId} onSaved={() => navigation.goBack()} />;
}
