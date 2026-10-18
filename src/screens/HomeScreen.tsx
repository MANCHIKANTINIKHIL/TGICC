import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { regions, delegates } = useData();

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of delegates) m[d.regionId] = (m[d.regionId] ?? 0) + 1;
    return m;
  }, [delegates]);

  const sorted = useMemo(
    () => [...regions].sort((a, b) => a.name.localeCompare(b.name)),
    [regions],
  );

  if (regions.length === 0) {
    return (
      <EmptyState
        icon="map-outline"
        title="No Regions Added"
        message="Add a Region to start adding Delegates."
        actionLabel="Add Region"
        onAction={() => nav.navigate('RegionForm')}
      />
    );
  }

  return (
    <FlatList
      data={sorted}
      keyExtractor={(r) => r.id}
      numColumns={2}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
          onPress={() => nav.navigate('RegionDetails', { regionId: item.id })}
        >
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.district} numberOfLines={1}>
            {item.districtName}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {counts[item.id] ?? 0} {(counts[item.id] ?? 0) === 1 ? 'Delegate' : 'Delegates'}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%',
    margin: 6,
    minHeight: 100,
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 14,
    justifyContent: 'space-between',
  },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  district: { fontSize: 13, color: colors.muted, marginTop: 2 },
  badge: { marginTop: 10, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
});
