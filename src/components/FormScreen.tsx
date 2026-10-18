import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Scrollable form container for every screen size:
 * - no fixed heights; content scrolls vertically
 * - bottom space shrinks the scroll area when the keyboard is open so fields and Save stay reachable
 * - content is centred with a max width so it also looks right on tablets
 */
export default function FormScreen({ children }: { children: React.ReactNode }) {
  const [kb, setKb] = useState(0);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKb(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKb(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return (
    <View style={{ flex: 1, paddingBottom: kb }}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: 48 + (kb ? 0 : insets.bottom),
          width: '100%',
          maxWidth: 640,
          alignSelf: 'center',
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}
