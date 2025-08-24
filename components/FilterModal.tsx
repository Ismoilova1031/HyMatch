// components/FilterModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { iconMap } from '@/constants/iconMap';
import SmartImage from '@/components/SmartImage';

// using centralized iconMap from constants

const filterValueIcons = {
  // 希望職種
  'レストラン': iconMap.company,
  'コンビニ': iconMap.coin,
  'オフィス': iconMap.calendar,
  'デリバリー': iconMap.steps,
  '清掃': iconMap.todo,
  // 日本語レベル
  N1: iconMap.language,
  N2: iconMap.language,
  N3: iconMap.language,
  N4: iconMap.language,
  N5: iconMap.language,
  // 通勤に便利なこと
  '駅近': iconMap.train,
  '交通費支給': iconMap.train_coin,
  '自転車OK': iconMap.steps,
  'バス利用可': iconMap.step,
  // 仕事で大事な事
  'シフト自由': iconMap.clock,
  '研修あり': iconMap.school_steps,
  '未経験OK': iconMap.star,
  '語学力活かせる': iconMap.language,
};
const defaultIcon = iconMap.star;

// Map raw option values to stable translation keys
const filterValueTranslationKey: Record<string, string> = {
  // job types
  'レストラン': 'jobType.restaurant',
  'コンビニ': 'jobType.convenienceStore',
  'オフィス': 'jobType.office',
  'デリバリー': 'jobType.delivery',
  '清掃': 'jobType.cleaning',
  // japanese levels
  N1: 'japaneseLevel.N1',
  N2: 'japaneseLevel.N2',
  N3: 'japaneseLevel.N3',
  N4: 'japaneseLevel.N4',
  N5: 'japaneseLevel.N5',
  // commute convenience
  '駅近': 'commute.nearStation',
  '交通費支給': 'commute.transportationCovered',
  '自転車OK': 'commute.bikeOk',
  'バス利用可': 'commute.busOk',
  // work importance
  'シフト自由': 'important.flexibleShift',
  '研修あり': 'important.training',
  '未経験OK': 'important.noExperienceOk',
  '語学力活かせる': 'important.useLanguage',
};

const filterRowIcons: Record<string, any> = {
  jobType: iconMap.company,
  japaneseLevel: iconMap.language,
  wageRange: iconMap.coin,
  convenient: iconMap.steps,
  important: iconMap.star,
};

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (sortKey: string | null, sortDirection: 'asc' | 'desc' | null, wage: number, filters: Record<string, string[]>) => void;
}

// Factory helpers to generate i18n-aware labels inside the component
const getFilterOptions = (t: (key: string) => string) => ([
  { key: 'jobType', label: t('desiredJobType'), values: ['レストラン', 'コンビニ', 'オフィス', 'デリバリー', '清掃'] },
  { key: 'japaneseLevel', label: t('japaneseLevel'), values: ['N1', 'N2', 'N3', 'N4', 'N5'] },
  { key: 'wageRange', label: t('wageRange'), values: [] },
  { key: 'convenient', label: t('commuteConvenience'), values: ['駅近', '交通費支給', '自転車OK', 'バス利用可'] },
  { key: 'important', label: t('workImportance'), values: ['シフト自由', '研修あり', '未経験OK', '語学力活かせる'] },
]);

const getSortOptions = (t: (key: string) => string) => ([
  { key: 'salary', label: t('salary') },
  { key: 'home_step', label: t('homeStep') },
  { key: 'school_step', label: t('schoolStep') },
  { key: 'date', label: t('date') },
]);

const getSalaryTypes = (t: (key: string) => string) => ([t('hourly'), t('daily'), t('weekly'), t('monthly')]);

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const { t } = useTranslation();
  const filterOptions = getFilterOptions(t);
  const sortOptions = getSortOptions(t);
  const salaryTypes = getSalaryTypes(t);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [activeSortKey, setActiveSortKey] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [selectedSortDirection, setSelectedSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [selectedWageType, setSelectedWageType] = useState<string>(salaryTypes[0]);
  const [selectedWage, setSelectedWage] = useState(1400);

  const toggleValue = (key: string, value: string) => {
    setSelectedValues(prev => {
      const prevValues = prev[key] || [];
      const newValues = prevValues.includes(value)
        ? prevValues.filter(v => v !== value)
        : [...prevValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleApply = () => {
    onApply(selectedSort, selectedSortDirection, selectedWage, selectedValues);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <View style={styles.topBar}>
          <SmartImage source={iconMap.sort} style={styles.icon} />
          <Text style={styles.title}>{t('sort')}</Text>
          <Pressable onPress={onClose}>
            <SmartImage source={iconMap.close} style={styles.icon} />
          </Pressable>
        </View>

        <View style={styles.divider} />

{/* Sort: 給与 */}
<TouchableOpacity onPress={() => setActiveSortKey('salary')}>
  <View style={styles.sortItem}>
    <View style={styles.circle}>
      {selectedSort === 'salary' && (
        <SmartImage source={iconMap.done} style={{ width: 30, height: 30 }} />
      )}
    </View>
    <SmartImage source={iconMap.coin} style={styles.sortIconLeft} />
    <Text style={styles.sortLabel}>{t('salary')}</Text>
    <SmartImage
      source={
        selectedSort === 'salary' && selectedSortDirection
          ? selectedSortDirection === 'asc'
            ? iconMap.sort_check_up
            : iconMap.sort_check_down
          : iconMap.sort_check
      }
      style={styles.sortIconRight}
    />
  </View>
</TouchableOpacity>

{/* Sort: 通勤時間（自宅から） */}
<TouchableOpacity onPress={() => setActiveSortKey('home_step')}>
  <View style={styles.sortItem}>
    <View style={styles.circle}>
      {selectedSort === 'home_step' && (
        <SmartImage source={iconMap.done} style={{ width: 30, height: 30 }} />
      )}
    </View>
    <SmartImage source={iconMap.steps} style={styles.sortIconLeft} />
    <Text style={styles.sortLabel}>{t('homeStep')}</Text>
    <SmartImage
      source={
        selectedSort === 'home_step' && selectedSortDirection
          ? selectedSortDirection === 'asc'
            ? iconMap.sort_check_up
            : iconMap.sort_check_down
          : iconMap.sort_check
      }
      style={styles.sortIconRight}
    />
  </View>
</TouchableOpacity>

{/* Sort: 通勤時間（学校から） */}
<TouchableOpacity onPress={() => setActiveSortKey('school_step')}>
  <View style={styles.sortItem}>
    <View style={styles.circle}>
      {selectedSort === 'school_step' && (
        <SmartImage source={iconMap.done} style={{ width: 30, height: 30 }} />
      )}
    </View>
    <SmartImage source={iconMap.school_steps} style={styles.sortIconLeft} />
    <Text style={styles.sortLabel}>{t('schoolStep')}</Text>
    <SmartImage
      source={
        selectedSort === 'school_step' && selectedSortDirection
          ? selectedSortDirection === 'asc'
            ? iconMap.sort_check_up
            : iconMap.sort_check_down
          : iconMap.sort_check
      }
      style={styles.sortIconRight}
    />
  </View>
</TouchableOpacity>

{/* Sort: 投稿日順 */}
<TouchableOpacity onPress={() => setActiveSortKey('date')}>
  <View style={styles.sortItem}>
    <View style={styles.circle}>
      {selectedSort === 'date' && (
        <SmartImage source={iconMap.done} style={{ width: 30, height: 30 }} />
      )}
    </View>
    <SmartImage source={iconMap.calendar} style={styles.sortIconLeft} />
    <Text style={styles.sortLabel}>{t('date')}</Text>
    <SmartImage
      source={
        selectedSort === 'date' && selectedSortDirection
          ? selectedSortDirection === 'asc'
            ? iconMap.sort_check_up
            : iconMap.sort_check_down
          : iconMap.sort_check
      }
      style={styles.sortIconRight}
    />
  </View>
</TouchableOpacity>



{sortOptions.map(opt => (
  <Modal
    key={opt.key}
    visible={activeSortKey === opt.key}
    animationType="slide"
    transparent
    onRequestClose={() => setActiveSortKey(null)}
  >
    <View style={styles.subModalOverlay}>
      <View style={styles.subModalBox}>
        <Text style={styles.subTitle}>{opt.label}</Text>

        {opt.key === 'salary' ? (
          salaryTypes.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                if (selectedWageType === type) {
                  // Faqat direction toggle
                  setSelectedSort('salary');
                  setSelectedWageType(type);
                  setSelectedSortDirection(selectedSortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  // Yangi wage type tanlandi, default direction 'asc'
                  setSelectedSort('salary');
                  setSelectedWageType(type);
                  setSelectedSortDirection('asc');
                }
              }}
              style={styles.optionItem}
            >
              <View style={styles.circle}>
                {selectedWageType === type && (
                  <SmartImage
                    source={iconMap.done}
                    style={{ width: 30, height: 30 }}
                  />
                )}
              </View>
              <Text style={{ flex: 1 }}>{t(type)}</Text>
              {selectedWageType === type && (
                <SmartImage
                  source={
                    selectedSortDirection === 'asc'
                      ? iconMap.sort_check_up
                      : iconMap.sort_check_down
                  }
                  style={{ width: 16, height: 32, marginLeft: 10 }}
                />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setSelectedSort(opt.key);
                setSelectedSortDirection('asc');
              }}
            >
              <View style={styles.circle}>
                {selectedSort === opt.key && selectedSortDirection === 'asc' && (
                  <SmartImage
                    source={iconMap.done}
                    style={{ width: 30, height: 30 }}
                  />
                )}
              </View>
              <Text style={{ flex: 1 }}>{opt.label} {t('smallToLarge')}</Text>
              {selectedSort === opt.key && selectedSortDirection === 'asc' && (
                <SmartImage
                  source={iconMap.sort_check_up}
                  style={{ width: 16, height: 32, marginLeft: 10 }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setSelectedSort(opt.key);
                setSelectedSortDirection('desc');
              }}
            >
              <View style={styles.circle}>
                {selectedSort === opt.key && selectedSortDirection === 'desc' && (
                  <SmartImage
                    source={iconMap.done}
                    style={{ width: 30, height: 30 }}
                  />
                )}
              </View>
              <Text style={{ flex: 1 }}>{opt.label} {t('largeToSmall')}</Text>
              {selectedSort === opt.key && selectedSortDirection === 'desc' && (
                <SmartImage
                  source={iconMap.sort_check_down}
                  style={{ width: 16, height: 32, marginLeft: 10 }}
                />
              )}
            </TouchableOpacity>
          </>
        )}

        <Pressable onPress={() => setActiveSortKey(null)} style={styles.closeSubModal}>
          <Text style={{ color: '#fff' }}>{t('select')}</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
))}


        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('filter')}</Text>
        </View>

        <ScrollView>
          {filterOptions.map(opt => (
            <TouchableOpacity key={opt.key} onPress={() => setActiveModal(opt.key)}>
              <View style={styles.filterRow}>
                <View style={styles.circle}>
                  {opt.key === 'wageRange'
                    ? selectedWage > 1000 && (
                        <SmartImage
                          source={iconMap.done}
                          style={{ width: 30, height: 30 }}
                        />
                      )
                    : selectedValues[opt.key]?.length ? (
                        <SmartImage
                          source={iconMap.done}
                          style={{ width: 30, height: 30 }}
                        />
                      ) : null}
                </View>
                <SmartImage
                  source={filterRowIcons[opt.key] || defaultIcon}
                  style={{ width: 28, height: 28, marginRight: 8 }}
                />
                <Text style={styles.filterLabel}>
                  {t(opt.label)}
                  {opt.key === 'wageRange' && selectedWage ? `: ${selectedWage}円 以上` : ''}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* WageRange uchun modal */}
        <Modal
          visible={activeModal === 'wageRange'}
          animationType="slide"
          transparent
          onRequestClose={() => setActiveModal(null)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalBox}>
              <Text style={styles.subTitle}>{t('wageRange')}</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{selectedWage}{t('yenOrMore')}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1000}
                maximumValue={3000}
                step={50}
                value={selectedWage}
                onValueChange={setSelectedWage}
                minimumTrackTintColor="#000"
                maximumTrackTintColor="#ccc"
              />
              <Pressable onPress={() => setActiveModal(null)} style={styles.closeSubModal}>
                <Text style={{ color: '#fff' }}>{t('select')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {filterOptions.map(opt => (
          opt.key !== 'wageRange' && (
            <Modal
              key={opt.key}
              visible={activeModal === opt.key}
              animationType="slide"
              transparent
              onRequestClose={() => setActiveModal(null)}
            >
              <View style={styles.subModalOverlay}>
                <View style={styles.subModalBox}>
                  <Text style={styles.subTitle}>{opt.label}</Text>
                  <FlatList
                    data={opt.values}
                    keyExtractor={(item) => item}
                    extraData={selectedValues}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => toggleValue(opt.key, item)}>
                        <View style={styles.optionItem}>
                          <View style={styles.checkbox}>
                            {selectedValues[opt.key]?.includes(item) && (
                              <SmartImage source={iconMap.done} style={{ width: 30, height: 30 }} />
                            )}
                          </View>
                          <Text>{
                            filterValueTranslationKey[item]
                              ? t(filterValueTranslationKey[item], { defaultValue: item })
                              : item
                          }</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                  <Pressable onPress={() => setActiveModal(null)} style={styles.closeSubModal}>
                    <Text style={{ color: '#fff' }}>{t('select')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )
        ))}
      </View>
    </View>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 40, right: 0, zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.4)', width: '100%', height: '100%',
    alignItems: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff', width: 300, padding: 16,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', flex: 1, marginLeft: 10 },
  icon: { width: 30, height: 30 },
  divider: {
    height: 1, backgroundColor: '#ccc', marginVertical: 12,
  },
  sortItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  sortLabel: { fontSize: 16, flex: 1 },
  sortIconLeft: { width: 30, height: 30, marginHorizontal: 8 },
  sortIconRight: {
  width: 16,
  height: 32,
  marginLeft: 8,
},
  doneIcon: { width: 30, height: 30, tintColor: '#fff' },
  sectionHeader: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  filterRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  circle: {
    width: 30, height: 30, borderRadius: 20, borderWidth: 1, borderColor: '#ccc', marginRight: 12,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  filterLabel: { fontSize: 16 },
  subModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center'
  },
  subModalBox: {
    width: 300, backgroundColor: '#fff', padding: 20, borderRadius: 20
  },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  optionItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10
  },
  checkbox: {
    width: 30, height: 30, borderRadius: 20, borderWidth: 1,
    borderColor: '#000000', marginRight: 12, justifyContent: 'center', alignItems: 'center'
  },
  checkedBox: {
    width: 12, height: 12, backgroundColor: '#000000'
  },
  closeSubModal: {
    backgroundColor: '#000000', padding: 10, marginTop: 20, borderRadius: 20,
    alignItems: 'center'
  },
  applyButton: {
    backgroundColor: '#000000', padding: 12, marginTop: 16, borderRadius: 20, alignItems: 'center'
  },
});

