import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import Button from './Button';

interface Props {
  title: string;
  onPress: () => void;
}

/**
 * Fixed bottom action bar. It sits in normal layout flow below the list (not absolutely positioned),
 * and adds the device's bottom inset so it is never hidden by the Android navigation bar.
 */
export default function BottomAction({ title, onPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) + 12 }]}>
      <Button title={title} icon="add" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
