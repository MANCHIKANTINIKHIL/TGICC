import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList, TabParamList } from '../models/types';
import { colors, APP_NAME } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import AddRegionTabScreen from '../screens/AddRegionTabScreen';
import AddDelegateTabScreen from '../screens/AddDelegateTabScreen';
import SearchScreen from '../screens/SearchScreen';
import RegionDetailsScreen from '../screens/RegionDetailsScreen';
import RegionFormScreen from '../screens/RegionFormScreen';
import DelegateDetailsScreen from '../screens/DelegateDetailsScreen';
import DelegateFormScreen from '../screens/DelegateFormScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DistrictsScreen from '../screens/DistrictsScreen';
import ManageRegionsScreen from '../screens/ManageRegionsScreen';
import ManageDelegatesScreen from '../screens/ManageDelegatesScreen';
import SeniorOfficersScreen from '../screens/SeniorOfficersScreen';
import SeniorOfficerDetailsScreen from '../screens/SeniorOfficerDetailsScreen';
import SeniorOfficerFormScreen from '../screens/SeniorOfficerFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const headerBase = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.onPrimary,
  headerTitleStyle: { fontWeight: '700' as const },
};

function HomeTitle() {
  return (
    <View style={styles.titleRow}>
      <View style={styles.logo}>
        <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.titleText}>{APP_NAME}</Text>
      </View>
    </View>
  );
}

function SettingsButton() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable onPress={() => nav.navigate('Settings')} hitSlop={10} accessibilityLabel="Menu" style={{ marginRight: 4 }}>
      <Ionicons name="menu" size={24} color={colors.onPrimary} />
    </Pressable>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerBase,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <HomeTitle />,
          headerRight: () => <SettingsButton />,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddRegion"
        component={AddRegionTabScreen}
        options={{
          title: 'Add Region',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddDelegate"
        component={AddDelegateTabScreen}
        options={{
          title: 'Add Delegate',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ ...headerBase, contentStyle: { backgroundColor: colors.bg } }}
      >
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="RegionDetails" component={RegionDetailsScreen} options={{ title: 'Region' }} />
        <Stack.Screen
          name="RegionForm"
          component={RegionFormScreen}
          options={({ route }) => ({ title: route.params?.regionId ? 'Edit Region' : 'Add Region' })}
        />
        <Stack.Screen name="DelegateDetails" component={DelegateDetailsScreen} options={{ title: 'Delegate Details' }} />
        <Stack.Screen
          name="DelegateForm"
          component={DelegateFormScreen}
          options={({ route }) => ({ title: route.params?.delegateId ? 'Edit Delegate' : 'Add Delegate' })}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="Districts" component={DistrictsScreen} options={{ title: 'Districts' }} />
        <Stack.Screen name="ManageRegions" component={ManageRegionsScreen} options={{ title: 'Regions' }} />
        <Stack.Screen name="ManageDelegates" component={ManageDelegatesScreen} options={{ title: 'Delegates' }} />
        <Stack.Screen name="SeniorOfficers" component={SeniorOfficersScreen} options={{ title: 'Senior Officers' }} />
        <Stack.Screen
          name="SeniorOfficerDetails"
          component={SeniorOfficerDetailsScreen}
          options={{ title: 'Senior Officer Details' }}
        />
        <Stack.Screen
          name="SeniorOfficerForm"
          component={SeniorOfficerFormScreen}
          options={({ route }) => ({
            title: route.params?.officerId ? 'Edit Senior Officer' : 'Add Senior Officer',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleText: { color: colors.onPrimary, fontSize: 20, fontWeight: '800' },
  subText: { color: '#C9D4E5', fontSize: 11, maxWidth: 200 },
});
