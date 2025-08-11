import React, { useState } from 'react';
import { View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useSegments } from 'expo-router';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

import HeaderWithFilter from '@/components/HeaderWithFilter';
import FilterModal from '@/components/FilterModal';
import MenuModal from '@/components/MenuModal';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [filterVisible, setFilterVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const segments = useSegments();
  const currentTab = segments[1] === undefined ? 'index' : segments[1];
  const { t } = useTranslation();

  // 👉 Shu yerda sizning onApply funksiyangiz:
  const handleFilterApply = (
    sortKey: string | null,
    sortDirection: 'asc' | 'desc' | null,
    wage: number,
    filters: Record<string, string[]>
  ) => {
    console.log('Sort Key:', sortKey);
    console.log('Sort Direction:', sortDirection);
    console.log('Wage:', wage);
    console.log('Filters:', filters);
    // TODO: filtering logic goes here
  };

  return (
    <>
      <HeaderWithFilter
        title={
          currentTab === 'index'
            ? t('swipe')
            : currentTab === 'choose-list'
            ? t('choose')
            : t('phone')
        }
        onFilterPress={() => setFilterVisible(true)}
        onMenuPress={() => setMenuVisible(true)}
      />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('swipe'),
            tabBarIcon: ({ color }) => <TabBarIcon name="hand-o-right" color={color} />,
          }}
        />
        <Tabs.Screen
          name="phone"
          options={{
            title: t('phone'),
            tabBarIcon: ({ color }) => <TabBarIcon name="phone" color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              // TODO: Show phone/mail modal
              console.log('Phone pressed');
            },
          }}
        />
        <Tabs.Screen
          name="choose-list"
          options={{
            title: t('choose'),
            tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          }}
        />
      </Tabs>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleFilterApply}
      />
      
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
}
