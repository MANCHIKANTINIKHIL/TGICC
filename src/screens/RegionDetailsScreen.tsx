import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { confirmDelete } from '../utils/confirm';
import { dial } from '../utils/phone';
import DelegateCard from '../components/DelegateCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'RegionDetails'>;

export default function RegionDetailsScreen({ navigation, route }: Props) {
  const { regionId } = route.params;
  const { getRegion, delegates, deleteRegion, deleteDelegate } = useData();
  const region = getRegion(regionId);
  const insets = useSafeAreaInsets();

  const list = useMemo(
    () =>
      delegates
        .filter((d) => d.regionId === regionId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [delegates, regionId],
  );

  if (!region) {
    return <EmptyState icon="alert-circle-outline" title="Region not found" actionLabel="Go Back" onAction={() => navigation.goBack()} />;
  }

  const onDeleteRegion = () => {
    const n = list.length;
    const msg =
      n > 0
        ? `Are you sure you want to delete this Region?\n\nDeleting this Region will also remove its ${n} associated ${
            n === 1 ? 'Delegate' : 'Delegates'
          }. Do you want to continue?`
        : 'Are you sure you want to delete this Region?';
    confirmDelete('Delete Region', msg, () => {
      navigation.goBack();
      deleteRegion(region.id);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 + insets.bottom, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.regionName}>{region.name}</Text>
            <Text style={styles.district}>District: {region.districtName}</Text>
            <View style={styles.headerBtns}>
              <Button
                title="Edit"
                icon="create-outline"
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
                onPress={() => navigation.navigate('RegionForm', { regionId: region.id })}
              />
              <Button
                title="Delete"
                icon="trash-outline"
                variant="danger"
                style={{ flex: 1, marginLeft: 8 }}
                onPress={onDeleteRegion}
              />
            </View>
            <Text style={styles.section}>Delegates ({list.length})</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingVertical: 40 }}>
            <Text style={styles.empty}>No Delegates Added</Text>
            <Text style={styles.emptySub}>Tap the + button to add a Delegate.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DelegateCard
            delegate={item}
            onPress={() => navigation.navigate('DelegateDetails', { delegateId: item.id })}
            onCall={() => dial(item.phoneNumber)}
            onDelete={() =>
              confirmDelete('Delete Delegate', 'Are you sure you want to delete this Delegate?', () =>
                deleteDelegate(item.id),
              )
            }
          />
        )}
      />
      <Pressable
        style={[styles.fab, { bottom: 28 + insets.bottom }]}
        onPress={() => navigation.navigate('DelegateForm', { regionId: region.id })}
        accessibilityLabel="Add Delegate"
      >
        <Ionicons name="add" size={32} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 6 },
  regionName: { fontSize: 24, fontWeight: '800', color: colors.text },
  district: { fontSize: 15, color: colors.muted, marginTop: 4 },
  headerBtns: { flexDirection: 'row', marginTop: 14 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 20, marginBottom: 10 },
  empty: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptySub: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 6 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: radius * 3,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
