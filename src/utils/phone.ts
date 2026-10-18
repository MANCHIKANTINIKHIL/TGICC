import { Alert, Linking } from 'react-native';

/** Empty is valid (optional). Otherwise 7-15 digits, only + digits space - ( ). */
export function isValidPhone(v?: string | null): boolean {
  const t = (v ?? '').trim();
  if (!t) return true;
  if (!/^[+\d\s\-()]+$/.test(t)) return false;
  const digits = t.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}

/** Opens the Android dialer (user confirms the call there). */
export function dial(number?: string | null): void {
  const cleaned = (number ?? '').replace(/[^\d+]/g, '');
  if (!cleaned) return;
  Linking.openURL(`tel:${cleaned}`).catch(() => {
    Alert.alert('Unable to open dialer', 'This device could not open the phone dialer.');
  });
}
