import React from 'react';
import { Tabs } from 'expo-router';
import { FloatingPillTabBar } from '@/components/FloatingPillTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingPillTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tugas',
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Kalender',
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Keluarga',
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Lainnya',
        }}
      />
    </Tabs>
  );
}
