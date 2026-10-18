import React, { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../models/types';
import { useData } from '../storage/DataContext';
import { colors, radius } from '../constants/theme';
import { confirmDelete } from '../utils/confirm';
import { formatDisplay } from '../utils/dates';
import { displayOfficerName } from '../utils/text';
import Avatar from '../components/Avatar';
import InfoRow from '../components/InfoRow';
import PhoneRow from '../components/PhoneRow';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'SeniorOfficerDetails'>;

export default function SeniorOfficerDetailsScreen({ navigation, route }: Props) {
  const { officerId } = route.params;
  const { getOfficer, deleteOfficer } = useData();
  const o = getOfficer(officerId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        o ? (
          <Pressable
            onPress={() => navigation.navigate('SeniorOfficerForm', { officerId: o.id })}
            hitSlop={10}
            accessibilityLabel="Edit Senior Officer"
          >
            <Ionicons name="create-outline" size={24} color={colors.onPrimary} />
          </Pressable>
        ) : null,
    });
  }, [navigation, o]);

  if (!o) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Senior Officer not found"
        actionLabel="Go Back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.top}>
        <Avatar uri={o.photoUri} size={96} />
        <Text style={styles.name}>{displayOfficerName(o.name)}</Text>
        {o.rank ? <Text style={styles.rank}>{o.rank}</Text> : null}
      </View>
      <View style={styles.card}>
        <InfoRow label="Name" value={o.name} />
        <InfoRow label="Rank" value={o.rank} />
        <InfoRow label="PR No" value={o.prNo} />
        <InfoRow label="District" value={o.district} />
        <InfoRow label="Working Unit" value={o.workingUnit} />
        <InfoRow label="DOB" value={formatDisplay(o.dob)} />
        <InfoRow label="Enlistment Date" value={formatDisplay(o.enlistmentDate)} />
        <InfoRow label="DOT" value={formatDisplay(o.dot)} />
        <InfoRow label="Remarks" value={o.remarks} />
        <InfoRow label="Address" value={o.address} />
        <PhoneRow label="PH No" number={o.phoneNumber} />
        <PhoneRow label="Alternate Phone No" number={o.alternatePhoneNumber} />
      </View>
      <View style={{ marginTop: 18 }}>
        <Button
          title="Edit Senior Officer"
          icon="create-outline"
          variant="outline"
          onPress={() => navigation.navigate('SeniorOfficerForm', { officerId: o.id })}
        />
        <Button
          title="Delete Senior Officer"
          icon="trash-outline"
          variant="danger"
          style={{ marginTop: 10 }}
          onPress={() =>
            confirmDelete('Delete Senior Officer', 'Are you sure you want to delete this Senior Officer?', () => {
              navigation.goBack();
              deleteOfficer(o.id);
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
