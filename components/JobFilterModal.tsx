import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Switch,
} from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { iconMap } from '@/constants/iconMap';
import {
  JobFilter,
  JobSort,
  JapaneseLevel,
  JOB_TYPE_LABELS,
  JAPANESE_LEVELS,
  COMMUTE_CONVENIENCE_OPTIONS,
  WORK_IMPORTANCE_OPTIONS,
} from '@/types/job';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next'; // Qo'shildi

const { width, height } = Dimensions.get('window');

interface JobFilterModalProps {
  visible: boolean;
  filter: JobFilter;
  sort: JobSort;
  onClose: () => void;
  onApply: (filter: JobFilter, sort: JobSort) => void;
  onReset: () => void;
}

export default function JobFilterModal({
  visible,
  filter,
  sort,
  onClose,
  onApply,
  onReset,
}: JobFilterModalProps) {
  const [localFilter, setLocalFilter] = useState<JobFilter>(filter);
  const [localSort, setLocalSort] = useState<JobSort>(sort);
  const { t } = useTranslation(); // Qo'shildi

  const handleJobTypeToggle = (jobType: string) => {
    setLocalFilter(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType as any)
        ? prev.jobTypes.filter(type => type !== jobType)
        : [...prev.jobTypes, jobType as any],
    }));
  };

  const handleJapaneseLevelToggle = (level: JapaneseLevel) => {
    setLocalFilter(prev => ({
      ...prev,
      japaneseLevel: prev.japaneseLevel.includes(level as any)
        ? prev.japaneseLevel.filter(l => l !== level)
        : [...prev.japaneseLevel, level as any],
    }));
  };

  const handleCommuteConvenienceToggle = (option: string) => {
    setLocalFilter(prev => ({
      ...prev,
      commuteConvenience: prev.commuteConvenience.includes(option)
        ? prev.commuteConvenience.filter(c => c !== option)
        : [...prev.commuteConvenience, option],
    }));
  };

  const handleWorkImportanceToggle = (option: string) => {
    setLocalFilter(prev => ({
      ...prev,
      workImportance: prev.workImportance.includes(option)
        ? prev.workImportance.filter(w => w !== option)
        : [...prev.workImportance, option],
    }));
  };

  const handleApply = () => {
    onApply(localFilter, localSort);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setLocalFilter(filter);
    setLocalSort(sort);
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{t(title)}</ThemedText>
      {children}
    </View>
  );

  const renderCheckbox = (
    label: string,
    checked: boolean,
    onToggle: () => void
  ) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onToggle}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <ThemedText style={styles.checkboxText}>✓</ThemedText>}
      </View>
      <ThemedText style={styles.checkboxLabel}>{t(label)}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>{t('cancel')}</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('filterSort')}</ThemedText>
          <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
            <ThemedText style={styles.applyButtonText}>{t('apply')}</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sort Section */}
          {renderSection('sort', (
            <View style={styles.sortContainer}>
              <ThemedText style={styles.sortLabel}>{t('sortOrder')}</ThemedText>
              <View style={styles.sortOptions}>
                {[
                  { key: 'salary', label: 'sortBySalary' },
                  { key: 'commuteHome', label: 'sortByCommuteHome' },
                  { key: 'commuteSchool', label: 'sortByCommuteSchool' },
                  { key: 'postedDate', label: 'sortByPostedDate' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOption,
                      localSort.type === option.key && styles.sortOptionSelected,
                    ]}
                    onPress={() => setLocalSort(prev => ({ ...prev, type: option.key as any }))}
                  >
                    <ThemedText style={[
                      styles.sortOptionText,
                      localSort.type === option.key && styles.sortOptionTextSelected,
                    ]}>
                      {t(option.label)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.directionContainer}>
                <TouchableOpacity
                  style={[
                    styles.directionButton,
                    localSort.direction === 'asc' && styles.directionButtonSelected,
                  ]}
                  onPress={() => setLocalSort(prev => ({ ...prev, direction: 'asc' }))}
                >
                  <ThemedText style={[
                    styles.directionButtonText,
                    localSort.direction === 'asc' && styles.directionButtonTextSelected,
                  ]}>
                    {t('ascending')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.directionButton,
                    localSort.direction === 'desc' && styles.directionButtonSelected,
                  ]}
                  onPress={() => setLocalSort(prev => ({ ...prev, direction: 'desc' }))}
                >
                  <ThemedText style={[
                    styles.directionButtonText,
                    localSort.direction === 'desc' && styles.directionButtonTextSelected,
                  ]}>
                    {t('descending')}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Job Type Filter */}
          {renderSection('jobType', (
            <View style={styles.optionsContainer}>
              {Object.entries(JOB_TYPE_LABELS).map(([key, label]) => (
                <View key={key} style={styles.optionRow}>
                  {renderCheckbox(
                    label,
                    localFilter.jobTypes.includes(key as any),
                    () => handleJobTypeToggle(key)
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* Japanese Level Filter */}
          {renderSection('japaneseLevel', (
            <View style={styles.optionsContainer}>
              {JAPANESE_LEVELS.map((level) => (
                <View key={level} style={styles.optionRow}>
                  {renderCheckbox(
                    level,
                    localFilter.japaneseLevel.includes(level),
                    () => handleJapaneseLevelToggle(level)
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* Salary Range */}
          {renderSection('wageRange', (
            <View style={styles.sliderContainer}>
              <View style={styles.sliderLabels}>
                <ThemedText style={styles.sliderLabel}>
                  ¥{localFilter.salaryRange.min.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.sliderLabel}>
                  ¥{localFilter.salaryRange.max.toLocaleString()}
                </ThemedText>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={800}
                maximumValue={2000}
                step={50}
                value={localFilter.salaryRange.min}
                onValueChange={(value) => setLocalFilter(prev => ({
                  ...prev,
                  salaryRange: { ...prev.salaryRange, min: value },
                }))}
                minimumTrackTintColor={Colors.light.tint}
                maximumTrackTintColor="#ddd"
              />
              <Slider
                style={styles.slider}
                minimumValue={800}
                maximumValue={2000}
                step={50}
                value={localFilter.salaryRange.max}
                onValueChange={(value) => setLocalFilter(prev => ({
                  ...prev,
                  salaryRange: { ...prev.salaryRange, max: value },
                }))}
                minimumTrackTintColor={Colors.light.tint}
                maximumTrackTintColor="#ddd"
              />
            </View>
          ))}

          {/* Commute Convenience */}
          {renderSection('commuteConvenience', (
            <View style={styles.optionsContainer}>
              {COMMUTE_CONVENIENCE_OPTIONS.map((option) => (
                <View key={option} style={styles.optionRow}>
                  {renderCheckbox(
                    option,
                    localFilter.commuteConvenience.includes(option),
                    () => handleCommuteConvenienceToggle(option)
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* Work Importance */}
          {renderSection('workImportance', (
            <View style={styles.optionsContainer}>
              {WORK_IMPORTANCE_OPTIONS.map((option) => (
                <View key={option} style={styles.optionRow}>
                  {renderCheckbox(
                    option,
                    localFilter.workImportance.includes(option),
                    () => handleWorkImportanceToggle(option)
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* Reset Button */}
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <ThemedText style={styles.resetButtonText}>{t('resetFilter')}</ThemedText>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sortContainer: {
    marginBottom: 10,
  },
  sortLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  sortOptions: {
    marginBottom: 15,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  sortOptionTextSelected: {
    color: 'white',
  },
  directionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  directionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  directionButtonSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  directionButtonText: {
    fontSize: 14,
    color: '#333',
  },
  directionButtonTextSelected: {
    color: 'white',
  },
  optionsContainer: {
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  checkboxText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1,
  },
  sliderContainer: {
    marginBottom: 10,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  sliderThumb: {
    backgroundColor: Colors.light.tint,
  },
  resetButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
});