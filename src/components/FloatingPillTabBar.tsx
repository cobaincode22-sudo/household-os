import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BorderRadius, Spacing } from '@/constants/Theme';

interface FloatingPillTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function FloatingPillTabBar({ state, descriptors, navigation }: FloatingPillTabBarProps) {
  const getTabMeta = (name: string) => {
    switch (name) {
      case 'index':
        return { label: 'Beranda', icon: '🏡', badge: null };
      case 'tasks':
        return { label: 'Tugas', icon: '✓', badge: '3' };
      case 'calendar':
        return { label: 'Kalender', icon: '📅', badge: null };
      case 'family':
        return { label: 'Keluarga', icon: '👥', badge: null };
      case 'more':
        return { label: 'Lainnya', icon: '⊞', badge: null };
      default:
        return { label: name, icon: '•', badge: null };
    }
  };

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <View style={styles.pillContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const { label, icon, badge } = getTabMeta(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemFocused,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Text style={[styles.iconText, isFocused && styles.iconTextFocused]}>
                  {icon}
                </Text>
                {badge && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{badge}</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Warna biru muda segar dan modern (Sky / Light Blue 100)
    backgroundColor: '#E0F2FE', // Sky 100
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: '#7DD3FC', // Sky 300 border
    width: '100%',
    maxWidth: 380,
    // Bayangan biru lembut
    shadowColor: '#0284C7', // Sky 600
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tabItemFocused: {
    // Kapsul tab aktif berwarna biru muda yang lebih pekat (Sky 200)
    backgroundColor: '#BAE6FD',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#0369A1', // Sky 700
  },
  iconTextFocused: {
    color: '#075985', // Sky 800
    fontWeight: '700',
  },
  badgePill: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#0284C7', // Sky 600
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0369A1', // Sky 700
    marginTop: 2,
  },
  tabLabelFocused: {
    color: '#075985', // Sky 800
    fontWeight: '800',
  },
});
