import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import JobListItem from '@/components/JobListItem';
import JobFilterModal from '@/components/JobFilterModal';
import { JobData, JobFilter, JobSort } from '@/types/job';
import { sampleJobs } from '@/data/sampleJobs';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';
import { useJobs } from '@/context/JobsContext';

interface JobListScreenProps {
  route?: {
    params?: {
      type?: 'choose' | 'refusal';
      jobs?: JobData[];
    };
  };
  navigation: any;
}

export default function JobListScreen({ route, navigation }: JobListScreenProps) {
  const insets = useSafeAreaInsets();
  const { chosenJobs } = useJobs();
  const type: 'choose' = 'choose';
  const initialJobs: JobData[] = route?.params?.jobs ?? chosenJobs;
  const [jobs, setJobs] = useState<JobData[]>(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>(initialJobs);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [filter, setFilter] = useState<JobFilter>({
    jobTypes: [],
    japaneseLevel: [],
    salaryRange: { min: 800, max: 2000 },
    commuteConvenience: [],
    workImportance: [],
  });
  
  const [sort, setSort] = useState<JobSort>({
    type: 'postedDate',
    direction: 'desc',
  });

  const { t } = useTranslation();

  useEffect(() => {
    applyFiltersAndSort();
  }, [jobs, filter, sort]);

  const applyFiltersAndSort = () => {
    let filtered = jobs.filter(job => {
      // Job type filter
      if (filter.jobTypes.length > 0 && !filter.jobTypes.includes(job.jobType)) {
        return false;
      }
      
      // Japanese level filter
      if (filter.japaneseLevel.length > 0 && !filter.japaneseLevel.includes(job.japaneseLevel)) {
        return false;
      }
      
      // Salary range filter
      if (job.salary.min < filter.salaryRange.min || job.salary.max > filter.salaryRange.max) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sort.type) {
        case 'salary':
          aValue = a.salary.min;
          bValue = b.salary.min;
          break;
        case 'commuteHome':
          aValue = a.commuteTime.home;
          bValue = b.commuteTime.home;
          break;
        case 'commuteSchool':
          aValue = a.commuteTime.school;
          bValue = b.commuteTime.school;
          break;
        case 'postedDate':
          aValue = a.postedDate.getTime();
          bValue = b.postedDate.getTime();
          break;
        default:
          return 0;
      }
      
      if (sort.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    setFilteredJobs(filtered);
  };

  const handleApplyFilter = (newFilter: JobFilter, newSort: JobSort) => {
    setFilter(newFilter);
    setSort(newSort);
  };

  const handleResetFilter = () => {
    const defaultFilter: JobFilter = {
      jobTypes: [],
      japaneseLevel: [],
      salaryRange: { min: 800, max: 2000 },
      commuteConvenience: [],
      workImportance: [],
    };
    
    const defaultSort: JobSort = {
      type: 'postedDate',
      direction: 'desc',
    };
    
    setFilter(defaultFilter);
    setSort(defaultSort);
  };

  const handleToggleSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(job => job.id));
    }
  };

  const handleBulkApply = () => {
    if (selectedJobs.length === 0) {
      Alert.alert(t('error'), t('selectJobToApply'));
      return;
    }

    Alert.alert(
      t('bulkApply'),
      t('confirmBulkApply', { count: selectedJobs.length }),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('apply'), 
          onPress: () => {
            Alert.alert(t('success'), t('appliedJobs', { count: selectedJobs.length }));
            setSelectedJobs([]);
          }
        },
      ]
    );
  };

  const handleJobPress = (job: JobData) => {
    Alert.alert(
      job.title,
      `${job.company.name}\n${job.description}`,
      [
        { text: t('close'), style: 'cancel' },
        { text: t('apply'), onPress: () => Alert.alert(t('success'), t('applied')) },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>{t('back')}</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.headerTitle}>
        {type === 'choose' ? t('chooseList') : t('refusalList')}
      </ThemedText>
      <TouchableOpacity onPress={() => setShowFilterModal(true)} style={styles.filterButton}>
        <ThemedText style={styles.filterIcon}>{t('search')}</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyIcon}>📋</ThemedText>
      <ThemedText style={styles.emptyTitle}>
        {type === 'choose' ? t('chooseEmpty') : t('refusalEmpty')}
      </ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        {type === 'choose' ? t('chooseEmptyDesc') : t('refusalEmptyDesc')}
      </ThemedText>
    </View>
  );

  const renderJobItem = ({ item }: { item: JobData }) => (
    <JobListItem
      job={item}
      isSelected={selectedJobs.includes(item.id)}
      onToggleSelection={handleToggleSelection}
      onPress={handleJobPress}
    />
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      
      {filteredJobs.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Selection Controls */}
          <View style={styles.selectionControls}>
            <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
              <ThemedText style={styles.selectAllText}>
                {selectedJobs.length === filteredJobs.length ? t('deselectAll') : t('selectAll')}
              </ThemedText>
            </TouchableOpacity>
            {selectedJobs.length > 0 && (
              <TouchableOpacity onPress={handleBulkApply} style={styles.bulkApplyButton}>
                <ThemedText style={styles.bulkApplyText}>
                  {t('applySelected', { count: selectedJobs.length })}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Job Count */}
          <View style={styles.jobCount}>
            <ThemedText style={styles.jobCountText}>
              {t('jobCount', { count: filteredJobs.length })}
            </ThemedText>
          </View>

          {/* Job List */}
          <FlatList
            data={filteredJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Filter Modal */}
      <JobFilterModal
        visible={showFilterModal}
        filter={filter}
        sort={sort}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </ThemedView>
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
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  selectionControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 20,
  },
  selectAllText: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bulkApplyButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  bulkApplyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  jobCount: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  jobCountText: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
});
