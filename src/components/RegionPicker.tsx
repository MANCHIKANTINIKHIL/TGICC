import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Region } from '../models/types';
import { colors, radius } from '../constants/theme';

interface Props {
  regions: Region[];
  selectedId?: string;
  onSelect: (id: string) => void;
  error?: string;
}

export default function RegionPicker({ regions, selectedId, onSelect, error }: Props) {
  const [open, setOpen] = useState(false);
  const selected = regions.find((r) => r.id === selectedId);
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>
        Select Region<Text style={{ color: colors.danger }}> *</Text>
      </Text>
      <Pressable
        style={[styles.input, !!error && { borderColor: colors.danger }]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text style={[styles.text, !selected && { color: colors.muted }]} numberOfLines={1}>
          {selected ? `${selected.name} (${selected.districtName})` : 'Select Region'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.muted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>Select Region</Text>
            <FlatList
              data={regions}
              keyExtractor={(r) => r.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.item}
                  onPress={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSub}>{item.districtName}</Text>
                  </View>
                  {item.id === selectedId ? <Ionicons name="checkmark" size={20} color={colors.primary} /> : null}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  text: { flex: 1, fontSize: 16, color: colors.text },
  error: { color: colors.danger, fontSize: 13, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: colors.card, borderRadius: radius, maxHeight: '70%', paddingVertical: 8 },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: colors.text, padding: 16, paddingBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  itemName: { fontSize: 16, color: colors.text },
  itemSub: { fontSize: 13, color: colors.muted },
});
