import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useJobs } from '@/context/JobsContext';
import { JobData, JOB_TYPE_ICONS } from '@/types/job';
import SmartImage from '@/components/SmartImage';
import { iconMap } from '@/constants/iconMap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function ListScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const { t } = useTranslation();
  const { chosenJobs, filteredChosenJobs, markRefused } = useJobs();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight?.() || 0;

  // Debug: observe chosen jobs and selection state
  React.useEffect(() => {
    console.log('[ChooseList] chosenJobs', chosenJobs.map(j => j.id));
  }, [chosenJobs]);
  React.useEffect(() => {
    console.log('[ChooseList] filteredChosenJobs', filteredChosenJobs.map(j => j.id));
  }, [filteredChosenJobs]);
  React.useEffect(() => {
    console.log('[ChooseList] selected local', selected);
  }, [selected]);
  // console.log removed: referenced undefined variables currentIndex/job

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkApply = () => {
    Alert.alert(t('bulkApplyAlert', { count: selected.length }));
  };

  return (
    <View style={[styles.container, { paddingTop: 70 + insets.top, paddingBottom: 70 + insets.bottom }] }>
      {filteredChosenJobs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>{t('noJobs')}</Text>
        </View>
      ) : (
        <>
          {selected.length > 0 && (
            <View style={[styles.headerContent, { marginBottom: 8 }]}>
              <TouchableOpacity style={styles.headerApplyBtn} onPress={handleBulkApply}>
                <Text style={styles.headerApplyText}>
                  {t('bulkApplyBtn', { count: selected.length })}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={filteredChosenJobs}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
            extraData={{ selected, chosenLen: filteredChosenJobs.length }}
            style={{ flex: 1 }}
            scrollEnabled={true}
            removeClippedSubviews={false}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            renderItem={({ item, index }: { item: JobData, index: number }) => {
              const onRefuse = () => {
                markRefused(item.id);
                setSelected(prev => prev.filter(i => i !== item.id));
              };
              const RightActions = () => (
                <View style={styles.rightActionContainer}>
                  <Pressable style={styles.rightActionButton} onPress={onRefuse}>
                    <Text style={styles.rightActionText}>X</Text>
                  </Pressable>
                </View>
              );
              return (
                <Swipeable renderRightActions={RightActions} overshootRight={false}>
                  <View style={styles.jobBox}>
                    <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkbox}>
                      {selected.includes(item.id) && <View style={styles.checkedBox} />}
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      {/* 1-qator */}
                      <View style={styles.row}>
                        <SmartImage source={iconMap.company} style={styles.rowIcon} />
                        <Text style={styles.companyName}>{`${index + 1}. ${item.title}`}</Text>
                        <View style={{ flex: 1 }} />
                      </View>
                      {/* 2-qator */}
                      <View style={styles.row}>
                        <Text style={styles.jobTypeIcon}>{JOB_TYPE_ICONS[item.jobType]}</Text>
                        <Text style={styles.japaneseLevel}>{item.japaneseLevel}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.wage}>{`${item.salary.currency}${item.salary.min}〜${item.salary.max}`}</Text>
                      </View>
                    </View>
                  </View>
                </Swipeable>
              );
            }}
          />
          {/* Bottom floating button removed to avoid overlapping jobs */}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9efe7', position: 'relative' },
  headerContent: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerApplyBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  headerApplyText: { color: '#fff', fontWeight: 'bold' },
  jobBox: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  icon: { width: 40, height: 40, marginRight: 16 },
  title: { fontSize: 16, fontWeight: 'bold' },
  detail: { color: '#666', fontSize: 13, marginTop: 4 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#000', marginRight: 12, alignItems: 'center', justifyContent: 'center',
  },
  checkedBox: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#000',
  },
  // bulkApplyBtn removed (replaced by headerApplyBtn)
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  rowIcon: { width: 25, height: 25, marginRight: 12 },
  companyName: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  japaneseLevel: { flex: 1, textAlign: 'center', fontSize: 14, color: '#333' },
  wage: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  // Swipe-to-refuse styles
  rightActionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightActionButton: {
    width: 64,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  rightActionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  jobTypeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
});
