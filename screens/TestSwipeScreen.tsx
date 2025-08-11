import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { Text as ThemedText } from '@/components/Themed';
import SwipeCard from '@/components/SwipeCard';
import { sampleJobs } from '@/data/sampleJobs';
import { JobData } from '@/types/job';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function TestSwipeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenJobs, setChosenJobs] = useState<JobData[]>([]);
  const [refusedJobs, setRefusedJobs] = useState<JobData[]>([]);
  const { t } = useTranslation();

  const handleChoose = (job: JobData) => {
    setChosenJobs(prev => [...prev, job]);
    setCurrentIndex(prev => prev + 1);
    Alert.alert(t('choose'), `${job.title} - ${job.company.name}`);
  };

  const handleRefuse = (job: JobData) => {
    setRefusedJobs(prev => [...prev, job]);
    setCurrentIndex(prev => prev + 1);
    Alert.alert(t('refuse'), `${job.title} - ${job.company.name}`);
  };

  const handleContact = (job: JobData) => {
    // ContactModal will handle the actual contact logic
    console.log('Contact initiated for:', job.company.name);
  };

  const currentJob = sampleJobs[currentIndex];

  if (!currentJob) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.endMessage}>
          {t('noJobs')}
        </ThemedText>
        <ThemedText style={styles.stats}>
          {t('chooseList')}: {chosenJobs.length}
        </ThemedText>
        <ThemedText style={styles.stats}>
          {t('refusalList')}: {refusedJobs.length}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>
          {t('swipe')} ({currentIndex + 1}/{sampleJobs.length})
        </ThemedText>
      </View>

      <View style={styles.cardContainer}>
        <SwipeCard
          job={currentJob}
          onChoose={handleChoose}
          onRefuse={handleRefuse}
          onContact={handleContact}
          isTop={true}
        />
        
        {/* Show next card behind current one */}
        {sampleJobs[currentIndex + 1] && (
          <View style={styles.nextCard}>
            <SwipeCard
              job={sampleJobs[currentIndex + 1]}
              onChoose={() => {}}
              onRefuse={() => {}}
              onContact={() => {}}
              isTop={false}
            />
          </View>
        )}
      </View>

      <View style={styles.instructions}>
        <ThemedText style={styles.instructionText}>
          ← {t('refuse')} | {t('choose')} →
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          ↓ {t('contactCompany')}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9efe7',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  nextCard: {
    position: 'absolute',
    transform: [{ scale: 0.95 }],
    zIndex: 0,
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
    color: '#666',
  },
  endMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
  },
  stats: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
