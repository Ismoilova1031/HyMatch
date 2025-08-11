import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { JobData, JOB_TYPE_ICONS, WORK_DAY_LABELS } from '@/types/job';
import { useTranslation } from 'react-i18next';

interface JobListItemProps {
  job: JobData;
  isSelected: boolean;
  onToggleSelection: (jobId: string) => void;
  onPress: (job: JobData) => void;
}

export default function JobListItem({
  job,
  isSelected,
  onToggleSelection,
  onPress,
}: JobListItemProps) {
  const { t } = useTranslation();

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()}〜${max.toLocaleString()}`;
  };

  const formatCommuteTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return t('hourMinute', { hour: hours, minute: mins });
    }
    return t('minute', { minute: mins });
  };

  const handleToggleSelection = (e: any) => {
    e.stopPropagation();
    onToggleSelection(job.id);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onPress(job)}
    >
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.jobTypeContainer}>
            <ThemedText style={styles.jobTypeIcon}>{JOB_TYPE_ICONS[job.jobType]}</ThemedText>
          </View>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>{job.title}</ThemedText>
            <ThemedText style={styles.company}>{job.company.name}</ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.checkbox, isSelected && styles.checkboxChecked]}
            onPress={handleToggleSelection}
          >
            {isSelected && <ThemedText style={styles.checkboxText}>✓</ThemedText>}
          </TouchableOpacity>
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.salaryContainer}>
            <ThemedText style={styles.salaryLabel}>{t('salary')}</ThemedText>
            <ThemedText style={styles.salary}>
              {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
            </ThemedText>
          </View>
          <View style={styles.levelContainer}>
            <ThemedText style={styles.levelLabel}>{t('japaneseLevel')}</ThemedText>
            <ThemedText style={styles.level}>{job.japaneseLevel}</ThemedText>
          </View>
          <View style={styles.commuteContainer}>
            <ThemedText style={styles.commuteLabel}>{t('commute')}</ThemedText>
            <ThemedText style={styles.commuteTime}>
              {formatCommuteTime(job.commuteTime.home)}
            </ThemedText>
          </View>
        </View>

        {/* Work Days */}
        <View style={styles.workDaysContainer}>
          <ThemedText style={styles.workDaysLabel}>{t('workDays')}</ThemedText>
          <View style={styles.workDaysList}>
            {job.workDays.map((day) => (
              <View key={day} style={styles.workDayBadge}>
                <ThemedText style={styles.workDayText}>{t(WORK_DAY_LABELS[day])}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Appeal Points */}
        <View style={styles.appealContainer}>
          <ThemedText style={styles.appealLabel}>{t('appealPoints')}</ThemedText>
          <View style={styles.appealList}>
            {job.appealPoints.slice(0, 3).map((point, index) => (
              <View key={index} style={styles.appealBadge}>
                <ThemedText style={styles.appealText}>{t(point)}</ThemedText>
              </View>
            ))}
            {job.appealPoints.length > 3 && (
              <ThemedText style={styles.moreText}>
                {t('moreAppealPoints', { count: job.appealPoints.length - 3 })}
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTypeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobTypeIcon: {
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  checkboxText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  salaryContainer: {
    flex: 1,
  },
  salaryLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  salary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  levelContainer: {
    alignItems: 'center',
    flex: 1,
  },
  levelLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  level: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  commuteContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  commuteLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  commuteTime: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  workDaysContainer: {
    marginBottom: 12,
  },
  workDaysLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  workDaysList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  workDayBadge: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  workDayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  appealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appealLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  appealList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  appealBadge: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  appealText: {
    fontSize: 10,
    color: '#495057',
  },
  moreText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
});