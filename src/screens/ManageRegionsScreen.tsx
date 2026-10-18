import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { confirmDelete } from '../utils/confirm';
import { allTokensMatch, regionHaystack, tokenize } from '../utils/search';
import SearchBar from '../components/SearchBar';
import BottomAction from '../components/BottomAction';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageRegions'>;

export default function ManageRegionsScreen({ navigation }: Props) {
  const { regions, delegates, deleteRegion } = useData();
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of delegates) m[d.regionId] = (m[d.regionId] ?? 0) + 1;
    return m;
  }, [delegates]);

  const filtered = useMemo(() => {
    const t = tokenize(query);
    const sorted = [...regions].sort((a, b) => a.name.localeCompare(b.name));
    return t.length ? sorted.filter((r) => allTokensMatch(regionHaystack(r), t)) : sorted;
  }, [regions, query]);

  const remove = (id: string) => {
    const n = counts[id] ?? 0;
    const msg =
      n > 0
        ? `Are you sure you want to delete this Region?\n\nDeleting this Region will also remove its ${n} associated ${
            n === 1 ? 'Delegate' : 'Delegates'
          }. Do you want to continue?`
        : 'Are you sure you want to delete this Region?';
    confirmDelete('Delete Region', msg, () => deleteRegion(id));
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search regions" />
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={{ paddingVertical: 40 }}>
            <Text style={styles.empty}>{regions.length === 0 ? 'No Regions Added' : 'No results found'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => navigation.navigate('RegionDetails', { regionId: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>
                {item.districtName} · {counts[item.id] ?? 0} Delegate(s)
              </Text>
            </View>
            <Pressable
              hitSlop={10}
              style={styles.icon}
              onPress={() => navigation.navigate('RegionForm', { regionId: item.id })}
              accessibilityLabel="Edit Region"
            >
              <Ionicons name="create-outline" size={22} color={colors.primary} />
            </Pressable>
            <Pressable hitSlop={10} style={styles.icon} onPress={() => remove(item.id)} accessibilityLabel="Remove Region">
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </Pressable>
          </Pressable>
        )}
      />
      <BottomAction title="Add Region" onPress={() => navigation.navigate('RegionForm')} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
  },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  icon: { paddingHorizontal: 8, paddingVertical: 4 },
  empty: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
