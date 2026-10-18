import React, { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { confirmDelete } from '../utils/confirm';
import { formatDisplay } from '../utils/dates';
import { displayName } from '../utils/text';
import Avatar from '../components/Avatar';
import InfoRow from '../components/InfoRow';
import PhoneRow from '../components/PhoneRow';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'DelegateDetails'>;

export default function DelegateDetailsScreen({ navigation, route }: Props) {
  const { delegateId } = route.params;
  const { getDelegate, getRegion, deleteDelegate } = useData();
  const d = getDelegate(delegateId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        d ? (
          <Pressable
            onPress={() => navigation.navigate('DelegateForm', { delegateId: d.id })}
            hitSlop={10}
            accessibilityLabel="Edit Delegate"
          >
            <Ionicons name="create-outline" size={24} color={colors.onPrimary} />
          </Pressable>
        ) : null,
    });
  }, [navigation, d]);

  if (!d) {
    return <EmptyState icon="alert-circle-outline" title="Delegate not found" actionLabel="Go Back" onAction={() => navigation.goBack()} />;
  }
  const region = getRegion(d.regionId);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.top}>
        <Avatar uri={d.photoUri} size={96} />
        <Text style={styles.name}>{displayName(d.name)}</Text>
        {d.rank ? <Text style={styles.rank}>{d.rank}</Text> : null}
      </View>
      <View style={styles.card}>
        <InfoRow label="Region" value={region ? `${region.name} (${region.districtName})` : 'Region not found'} />
        <InfoRow label="Name" value={d.name} />
        <InfoRow label="Rank" value={d.rank} />
        <InfoRow label="PR No" value={d.prNo} />
        <InfoRow label="District" value={d.district} />
        <InfoRow label="Working Unit" value={d.workingUnit} />
        <InfoRow label="DOB" value={formatDisplay(d.dob)} />
        <InfoRow label="Enlistment Date" value={formatDisplay(d.enlistmentDate)} />
        <InfoRow label="DOT" value={formatDisplay(d.dot)} />
        <InfoRow label="Remarks" value={d.remarks} />
        <InfoRow label="Address" value={d.address} />
        <PhoneRow label="Phone Number" number={d.phoneNumber} />
        <PhoneRow label="Alternate Phone Number" number={d.alternatePhoneNumber} />
      </View>
      <View style={{ marginTop: 18 }}>
        <Button
          title="Edit Delegate"
          icon="create-outline"
          variant="outline"
          onPress={() => navigation.navigate('DelegateForm', { delegateId: d.id })}
        />
        <Button
          title="Delete Delegate"
          icon="trash-outline"
          variant="danger"
          style={{ marginTop: 10 }}
          onPress={() =>
            confirmDelete('Delete Delegate', 'Are you sure you want to delete this Delegate?', () => {
              navigation.goBack();
              deleteDelegate(d.id);
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 10, textAlign: 'center' },
  rank: { fontSize: 15, color: colors.muted, marginTop: 2 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
  },
});
