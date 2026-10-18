import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { confirmDelete } from '../utils/confirm';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';

export default function DistrictsScreen() {
  const { districts, addDistrict, removeDistrict } = useData();
  const [query, setQuery] = useState('');
  const [newName, setNewName] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...districts].sort((a, b) => a.localeCompare(b));
    return q ? sorted.filter((d) => d.toLowerCase().includes(q)) : sorted;
  }, [districts, query]);

  const add = () => {
    if (!newName.trim()) {
      Alert.alert('District', 'Please enter District Name.');
      return;
    }
    if (!addDistrict(newName)) {
      Alert.alert('District', 'This District already exists.');
      return;
    }
    setNewName('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.addRow}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="New District name"
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCapitalize="words"
          onSubmitEditing={add}
        />
        <Button title="Add" icon="add" onPress={add} style={{ marginLeft: 10 }} />
      </View>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search districts" />
      <FlatList
        data={filtered}
        keyExtractor={(d) => d}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingTop: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={{ paddingVertical: 40 }}>
            <Text style={styles.empty}>{districts.length === 0 ? 'No Districts Added' : 'No results found'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
            <Pressable
              hitSlop={10}
              onPress={() =>
                confirmDelete('Delete District', 'Are you sure you want to delete this District?', () =>
                  removeDistrict(item),
                )
              }
              accessibilityLabel={`Remove ${item}`}
            >
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 0 },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: 12,
    minHeight: 48,
    fontSize: 16,
    color: colors.text,
  },
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
  itemText: { flex: 1, fontSize: 16, color: colors.text },
  empty: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
