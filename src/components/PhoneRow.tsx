import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { clean, NOT_PROVIDED } from '../utils/text';
import { dial } from '../utils/phone';

export default function PhoneRow({ label, number }: { label: string; number?: string }) {
  const n = clean(number);
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {n ? (
          <Pressable onPress={() => dial(n)} accessibilityRole="link">
            <Text style={[styles.value, { color: colors.primary, textDecorationLine: 'underline' }]}>{n}</Text>
          </Pressable>
        ) : (
          <Text style={[styles.value, { color: colors.muted }]}>{NOT_PROVIDED}</Text>
        )}
      </View>
      {n ? (
        <Pressable onPress={() => dial(n)} style={styles.call} hitSlop={8} accessibilityLabel={`Call ${label}`}>
          <Ionicons name="call" size={20} color={colors.onPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 12, color: colors.muted, marginBottom: 2 },
  value: { fontSize: 16, color: colors.text },
  call: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
