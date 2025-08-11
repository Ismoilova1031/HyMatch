import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next'; // Qo'shildi

// Mock jobs data
const jobs = [
  {
    id: '1',
    title: 'レストランスタッフ',
    jobType: 'Resutoran',
    wage: 1200,
    japaneseLevel: 'N3',
  },
  {
    id: '2',
    title: 'コンビニスタッフ',
    jobType: 'Konbini',
    wage: 1100,
    japaneseLevel: 'N4',
  },
  {
    id: '3',
    title: 'オフィスワーク',
    jobType: 'Ofis',
    wage: 1400,
    japaneseLevel: 'N2',
  },
];

export default function ListScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const { t } = useTranslation(); // Qo'shildi

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkApply = () => {
    alert(
      t('bulkApplyAlert', { count: selected.length })
    );
  };

  return (
    <View style={styles.container}>
      {jobs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>{t('noJobs')}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={jobs}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <View style={styles.jobBox}>
                <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkbox}>
                  {selected.includes(item.id) && <View style={styles.checkedBox} />}
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  {/* 1-qator */}
                  <View style={styles.row}>
                    <Image source={require('../../assets/images/icons/company.png')} style={styles.rowIcon} />
                    <Text style={styles.companyName}>{item.title}</Text>
                    <View style={{ flex: 1 }} />
                  </View>
                  {/* 2-qator */}
                  <View style={styles.row}>
                    <Image source={require('../../assets/images/icons/policeman.png')} style={styles.rowIcon} />
                    <Text style={styles.japaneseLevel}>{item.japaneseLevel}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.wage}>{item.wage}円</Text>
                  </View>
                </View>
              </View>
            )}
          />
          {selected.length > 0 && (
            <TouchableOpacity style={styles.bulkApplyBtn} onPress={handleBulkApply}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {t('bulkApplyBtn', { count: selected.length })}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9efe7' },
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
  bulkApplyBtn: {
    position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#000', padding: 16, borderRadius: 30, alignItems: 'center',
  },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  rowIcon: { width: 25, height: 25, marginRight: 12 },
  companyName: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  japaneseLevel: { flex: 1, textAlign: 'center', fontSize: 14, color: '#333' },
  wage: { fontWeight: 'bold', fontSize: 14, color: '#222' },
});
