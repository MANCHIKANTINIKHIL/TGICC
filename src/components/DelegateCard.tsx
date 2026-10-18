import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Delegate } from '../models/types';
import { colors, radius } from '../constants/theme';
import { clean, displayName } from '../utils/text';
import Avatar from './Avatar';

interface Props {
  delegate: Delegate;
  regionName?: string;
  onPress: () => void;
  onCall?: () => void;
  onDelete?: () => void;
}

function Line({ label, value }: { label: string; value?: string }) {
  const v = clean(value);
  if (!v) return null;
  return (
    <Text style={styles.line} numberOfLines={1}>
      <Text style={styles.lineLabel}>{label}: </Text>
      {v}
    </Text>
  );
}

function DelegateCardImpl({ delegate, regionName, onPress, onCall, onDelete }: Props) {
  const hasPhone = !!clean(delegate.phoneNumber);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <Avatar uri={delegate.photoUri} size={56} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName(delegate.name)}
        </Text>
        <Line label="Rank" value={delegate.rank} />
        <Line label="PR No" value={delegate.prNo} />
        <Line label="District" value={delegate.district} />
        <Line label="Working Unit" value={delegate.workingUnit} />
        {regionName !== undefined ? <Line label="Region" value={regionName || 'Unknown'} /> : null}
      </View>
      <View style={styles.actions}>
        {hasPhone && onCall ? (
          <Pressable onPress={onCall} hitSlop={8} style={styles.callBtn} accessibilityLabel="Call">
            <Ionicons name="call" size={20} color={colors.onPrimary} />
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable onPress={onDelete} hitSlop={8} style={styles.delBtn} accessibilityLabel="Delete delegate">
            <Ionicons name="close" size={22} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export default React.memo(DelegateCardImpl);

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
  lineLabel: { color: colors.muted },
  actions: { alignItems: 'center', justifyContent: 'space-between' },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  delBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
