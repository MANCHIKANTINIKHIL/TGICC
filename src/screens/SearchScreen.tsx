import React, { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Delegate, Region, RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { allTokensMatch, delegateHaystack, regionHaystack, tokenize } from '../utils/search';
import { dial } from '../utils/phone';
import SearchBar from '../components/SearchBar';
import DelegateCard from '../components/DelegateCard';
import EmptyState from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Item = { kind: 'region'; region: Region } | { kind: 'delegate'; delegate: Delegate };

export default function SearchScreen() {
  const nav = useNavigation<Nav>();
  const { regions, delegates } = useData();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);

  const regionMap = useMemo(() => {
    const m = new Map<string, Region>();
    regions.forEach((r) => m.set(r.id, r));
    return m;
  }, [regions]);

  const results = useMemo<Item[]>(() => {
    const tokens = tokenize(deferred);
    if (tokens.length === 0) return [];
    const out: Item[] = [];
    for (const r of regions) {
      if (allTokensMatch(regionHaystack(r), tokens)) out.push({ kind: 'region', region: r });
    }
    for (const d of delegates) {
      if (allTokensMatch(delegateHaystack(d, regionMap.get(d.regionId)), tokens)) {
        out.push({ kind: 'delegate', delegate: d });
      }
    }
    return out;
  }, [deferred, regions, delegates, regionMap]);

  const hasQuery = tokenize(query).length > 0;

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search regions or delegates" />
      {!hasQuery ? (
        <EmptyState
          icon="search-outline"
          title="Search TGICC"
          message="Search by name, rank, PR No, district, unit, phone, address, remarks or region. Use several words to narrow results."
        />
      ) : results.length === 0 ? (
        <EmptyState icon="alert-circle-outline" title="No results found" message="Try different or fewer keywords." />
      ) : (
        <FlatList
          data={results}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(it) => (it.kind === 'region' ? `r:${it.region.id}` : `d:${it.delegate.id}`)}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          renderItem={({ item }) =>
            item.kind === 'region' ? (
              <Pressable
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
                onPress={() => nav.navigate('RegionDetails', { regionId: item.region.id })}
              >
                <Text style={styles.tag}>REGION</Text>
                <Text style={styles.title}>{item.region.name}</Text>
                <Text style={styles.sub}>District: {item.region.districtName}</Text>
              </Pressable>
            ) : (
              <View>
                <Text style={styles.tag}>DELEGATE</Text>
                <DelegateCard
                  delegate={item.delegate}
                  regionName={regionMap.get(item.delegate.regionId)?.name ?? ''}
                  onPress={() => nav.navigate('DelegateDetails', { delegateId: item.delegate.id })}
                  onCall={() => dial(item.delegate.phoneNumber)}
                />
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 14,
    marginBottom: 10,
  },
  tag: { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  sub: { fontSize: 14, color: colors.muted, marginTop: 2 },
});
