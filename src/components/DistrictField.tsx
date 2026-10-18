import React, { useMemo, useState } from 'react';
import { FlatList, Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';
import { useData } from '../storage/DataContext';

/** All known districts: saved in Settings + used by regions, delegates and senior officers. */
export function useDistrictOptions(): string[] {
  const { districts, regions, delegates, officers } = useData();
  return useMemo(() => {
    const seen = new Map<string, string>();
    const add = (v?: string) => {
      const t = (v ?? '').trim();
      if (t && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
    };
    districts.forEach(add);
    regions.forEach((r) => add(r.districtName));
    delegates.forEach((d) => add(d.district));
    officers.forEach((o) => add(o.district));
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }, [districts, regions, delegates, officers]);
}

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  required?: boolean;
  error?: string;
}

/** Text input you can type in OR pick from a dropdown of existing districts. */
export default function DistrictField({ label, value, onChangeText, required, error }: Props) {
  const options = useDistrictOptions();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={{ color: colors.danger }}> *</Text> : null}
      </Text>
      <View style={[styles.box, !!error && { borderColor: colors.danger }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Select district / type manually"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          style={styles.input}
        />
        <Pressable
          style={styles.arrow}
          hitSlop={6}
          accessibilityLabel="Choose district"
          onPress={() => {
            Keyboard.dismiss();
            setOpen(true);
          }}
        >
          <Ionicons name="chevron-down" size={22} color={colors.muted} />
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>Select District</Text>
            {options.length === 0 ? (
              <Text style={styles.none}>No districts saved yet. Type a district name instead.</Text>
            ) : (
              <FlatList
                data={options}
                keyExtractor={(d) => d}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.item}
                    onPress={() => {
                      onChangeText(item);
                      setOpen(false);
                    }}
                  >
                    <Text style={styles.itemText}>{item}</Text>
                    {item.toLowerCase() === value.trim().toLowerCase() ? (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    ) : null}
                  </Pressable>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    minHeight: 48,
  },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingHorizontal: 12, paddingVertical: 10 },
  arrow: { paddingHorizontal: 12, alignSelf: 'stretch', justifyContent: 'center' },
  error: { color: colors.danger, fontSize: 13, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: colors.card, borderRadius: radius, maxHeight: '70%', paddingVertical: 8 },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: colors.text, padding: 16, paddingBottom: 8 },
  none: { fontSize: 14, color: colors.muted, padding: 16 },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  itemText: { flex: 1, fontSize: 16, color: colors.text },
});
