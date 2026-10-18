import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Text, View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors } from '../constants/theme';
import { confirmDelete } from '../utils/confirm';
import { dial } from '../utils/phone';
import { allTokensMatch, delegateHaystack, tokenize } from '../utils/search';
import SearchBar from '../components/SearchBar';
import DelegateCard from '../components/DelegateCard';
import BottomAction from '../components/BottomAction';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageDelegates'>;

export default function ManageDelegatesScreen({ navigation }: Props) {
  const { regions, delegates, deleteDelegate } = useData();
  const [query, setQuery] = useState('');

  const regionMap = useMemo(() => new Map(regions.map((r) => [r.id, r])), [regions]);

  const filtered = useMemo(() => {
    const t = tokenize(query);
    const sorted = [...delegates].sort((a, b) => a.name.localeCompare(b.name));
    return t.length
      ? sorted.filter((d) => allTokensMatch(delegateHaystack(d, regionMap.get(d.regionId)), t))
      : sorted;
  }, [delegates, query, regionMap]);

  const add = () => {
    if (regions.length === 0) {
      Alert.alert('Add Delegate', 'Please add a Region first.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Region', onPress: () => navigation.navigate('RegionForm') },
      ]);
      return;
    }
    navigation.navigate('DelegateForm');
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search delegates" />
      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={{ paddingVertical: 40 }}>
            <Text style={styles.empty}>{delegates.length === 0 ? 'No Delegates Added' : 'No results found'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DelegateCard
            delegate={item}
            regionName={regionMap.get(item.regionId)?.name ?? ''}
            onPress={() => navigation.navigate('DelegateDetails', { delegateId: item.id })}
            onCall={() => dial(item.phoneNumber)}
            onDelete={() =>
              confirmDelete('Delete Delegate', 'Are you sure you want to delete this Delegate?', () =>
                deleteDelegate(item.id),
              )
            }
          />
        )}
      />
      <BottomAction title="Add Delegate" onPress={add} />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
