import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../models/types';
import { colors, radius } from '../constants/theme';
import { useData } from '../storage/DataContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

interface RowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  sub: string;
  onPress: () => void;
}
function MenuRow({ icon, title, sub, onPress }: RowProps) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
}

export default function SettingsScreen({ navigation }: Props) {
  const { districts, regions, delegates, officers } = useData();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.heading}>Manage</Text>
      <View>
        <MenuRow icon="location-outline" title="Districts" sub={`${districts.length} saved`} onPress={() => navigation.navigate('Districts')} />
        <MenuRow icon="map-outline" title="Regions" sub={`${regions.length} saved`} onPress={() => navigation.navigate('ManageRegions')} />
        <MenuRow icon="people-outline" title="Delegates" sub={`${delegates.length} saved`} onPress={() => navigation.navigate('ManageDelegates')} />
        <MenuRow icon="star-outline" title="Senior Officers" sub={`${officers.length} saved`} onPress={() => navigation.navigate('SeniorOfficers')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
    minHeight: 56,
  },
  rowTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  rowSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
