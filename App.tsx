import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DataProvider, useData } from './src/storage/DataContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/constants/theme';

function Root() {
  const { loaded } = useData();
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <DataProvider>
        <Root />
      </DataProvider>
    </SafeAreaProvider>
  );
}
