// components/HeaderWithFilter.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { iconMap } from '@/constants/iconMap';
import { useTranslation } from 'react-i18next';

interface HeaderWithFilterProps {
  title: string; // endi bu i18n kaliti bo'ladi
  onFilterPress: () => void;
  onMenuPress: () => void;
}

export default function HeaderWithFilter({ title, onFilterPress, onMenuPress }: HeaderWithFilterProps) {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.centerSection}>
        <ThemedText style={styles.title}>{t(title)}</ThemedText>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
          <Image source={iconMap.sort} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 80,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
