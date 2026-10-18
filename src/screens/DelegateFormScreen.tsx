import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types';
import DelegateFormView from '../components/DelegateFormView';

type Props = NativeStackScreenProps<RootStackParamList, 'DelegateForm'>;

export default function DelegateFormScreen({ navigation, route }: Props) {
  return (
    <DelegateFormView
      regionId={route.params?.regionId}
      delegateId={route.params?.delegateId}
      onSaved={() => navigation.goBack()}
    />
  );
}
