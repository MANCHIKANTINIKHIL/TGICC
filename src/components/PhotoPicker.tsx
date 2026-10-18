import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';
import Avatar from './Avatar';

interface Props {
  uri: string; // '' when no photo
  onChange: (uri: string) => void;
}

/** Photo row: tap to take a photo, choose from gallery, change or remove. */
export default function PhotoPicker({ uri, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const fromGallery = async () => {
    setOpen(false);
    try {
      const r = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!r.canceled && r.assets && r.assets[0]?.uri) onChange(r.assets[0].uri);
    } catch {
      Alert.alert('Photo', 'Could not open the photo library.');
    }
  };

  const fromCamera = async () => {
    setOpen(false);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Camera', 'Camera permission is needed to take a photo.');
        return;
      }
      const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
      if (!r.canceled && r.assets && r.assets[0]?.uri) onChange(r.assets[0].uri);
    } catch {
      Alert.alert('Camera', 'The camera is not available on this device.');
    }
  };

  return (
    <>
      <Pressable style={styles.row} onPress={() => setOpen(true)} accessibilityLabel="Photo">
        <Avatar uri={uri || undefined} size={72} />
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={styles.title}>Photo (optional)</Text>
          <Text style={styles.hint}>{uri ? 'Tap to change or remove' : 'Tap to add a photo'}</Text>
        </View>
        <Ionicons name="camera-outline" size={24} color={colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>Photo</Text>
            <Option icon="camera" label="Take Photo" onPress={fromCamera} />
            <Option icon="images" label="Choose from Gallery" onPress={fromGallery} />
            {uri ? (
              <Option
                icon="trash"
                label="Remove Photo"
                danger
                onPress={() => {
                  onChange('');
                  setOpen(false);
                }}
              />
            ) : null}
            <Option icon="close" label="Cancel" onPress={() => setOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function Option({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const c = danger ? colors.danger : colors.text;
  return (
    <Pressable style={styles.option} onPress={onPress}>
      <Ionicons name={icon} size={22} color={c} />
      <Text style={[styles.optionText, { color: c }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    marginBottom: 14,
  },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  hint: { fontSize: 13, color: colors.muted, marginTop: 2 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: colors.card, borderRadius: radius, paddingVertical: 8 },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: colors.text, padding: 16, paddingBottom: 8 },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  optionText: { fontSize: 16, marginLeft: 14 },
});
