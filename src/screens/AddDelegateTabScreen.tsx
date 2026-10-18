import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types';
import DelegateFormView from '../components/DelegateFormView';

export default function AddDelegateTabScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [key, setKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setKey((k) => k + 1);
    }, []),
  );
  return (
    <DelegateFormView key={key} onSaved={(regionId) => nav.navigate('RegionDetails', { regionId })} />
  );
}
