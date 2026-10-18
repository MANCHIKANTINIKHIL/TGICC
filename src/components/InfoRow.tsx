import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { clean, NOT_PROVIDED } from '../utils/text';

export default function InfoRow({ label, value }: { label: string; value?: string }) {
  const v = clean(value);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, !v && { color: colors.muted }]}>{v ?? NOT_PROVIDED}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  label: { fontSize: 12, color: colors.muted, marginBottom: 2 },
  value: { fontSize: 16, color: colors.text },
});
