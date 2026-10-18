import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '../models/types';
import RegionFormView from '../components/RegionFormView';

export default function AddRegionTabScreen() {
  const nav = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [key, setKey] = useState(0);
  // Fresh empty form every time the tab is opened.
  useFocusEffect(
    useCallback(() => {
      setKey((k) => k + 1);
    }, []),
  );
  return <RegionFormView key={key} onSaved={() => nav.navigate('Home')} />;
}
