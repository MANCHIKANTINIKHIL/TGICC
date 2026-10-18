import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';
import { formatDisplay, parseStorage, toStorage } from '../utils/dates';

interface Props {
  label: string;
  value: string; // YYYY-MM-DD or ''
  onChange: (v: string) => void;
}

export default function DateField({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);
  const shown = formatDisplay(value);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable style={styles.input} onPress={() => setShow(true)} accessibilityRole="button">
          <Ionicons name="calendar-outline" size={18} color={colors.muted} />
          <Text style={[styles.text, !shown && { color: colors.muted }]}>
            {shown || 'Select date'}
          </Text>
        </Pressable>
        {shown ? (
          <Pressable style={styles.clear} onPress={() => onChange('')} accessibilityLabel={`Clear ${label}`}>
            <Ionicons name="close-circle" size={24} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {show ? (
        <DateTimePicker
          value={parseStorage(value) ?? new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShow(false);
            if (event.type === 'set' && date) onChange(toStorage(date));
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  text: { fontSize: 16, color: colors.text, marginLeft: 8 },
  clear: { paddingLeft: 10, paddingVertical: 8 },
});
