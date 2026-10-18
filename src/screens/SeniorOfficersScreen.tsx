import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { confirmDelete } from '../utils/confirm';
import { allTokensMatch, officerHaystack, tokenize } from '../utils/search';
import { clean, displayOfficerName } from '../utils/text';
import SearchBar from '../components/SearchBar';
import BottomAction from '../components/BottomAction';
import Avatar from '../components/Avatar';

type Props = NativeStackScreenProps<RootStackParamList, 'SeniorOfficers'>;

export default function SeniorOfficersScreen({ navigation }: Props) {
  const { officers, deleteOfficer } = useData();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const t = tokenize(query);
    const sorted = [...officers].sort((a, b) => a.name.localeCompare(b.name));
    return t.length ? sorted.filter((o) => allTokensMatch(officerHaystack(o), t)) : sorted;
  }, [officers, query]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search senior officers" />
      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={{ paddingVertical: 40 }}>
            <Text style={styles.empty}>{officers.length === 0 ? 'No Senior Officers Added' : 'No results found'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
            onPress={() => navigation.navigate('SeniorOfficerDetails', { officerId: item.id })}
          >
            <Avatar uri={item.photoUri} size={56} />
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={1}>
                {displayOfficerName(item.name)}
              </Text>
              {clean(item.rank) ? (
                <Text style={styles.line} numberOfLines={1}>
                  <Text style={styles.label}>Rank: </Text>
                  {item.rank}
                </Text>
              ) : null}
              {clean(item.prNo) ? (
                <Text style={styles.line} numberOfLines={1}>
                  <Text style={styles.label}>PR No: </Text>
                  {item.prNo}
                </Text>
              ) : null}
            </View>
            <Pressable
              hitSlop={8}
              style={styles.del}
              onPress={() =>
                confirmDelete('Delete Senior Officer', 'Are you sure you want to delete this Senior Officer?', () =>
                  deleteOfficer(item.id),
                )
              }
              accessibilityLabel="Delete Senior Officer"
            >
              <Ionicons name="close" size={22} color={colors.danger} />
            </Pressable>
          </Pressable>
        )}
      />
      <BottomAction title="Add Senior Officer" onPress={() => navigation.navigate('SeniorOfficerForm')} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  body: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 2 },
  line: { fontSize: 13, color: colors.text, marginTop: 1 },
  label: { color: colors.muted },
  del: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
