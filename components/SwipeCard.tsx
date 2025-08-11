import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { JobData, JOB_TYPE_ICONS, WORK_DAY_LABELS } from '@/types/job';
import { useTranslation } from 'react-i18next';
import ContactModal from './ContactModal';

const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_DOWN_THRESHOLD = height * 0.1;
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = height * 0.6;

interface SwipeCardProps {
  job: JobData;
  onChoose: (job: JobData) => void;
  onRefuse: (job: JobData) => void;
  onContact: (job: JobData) => void;
  isTop: boolean;
}

export default function SwipeCard({ job, onChoose, onRefuse, onContact, isTop }: SwipeCardProps) {
  const [translateX, setTranslateX] = React.useState(0);
  const [translateY, setTranslateY] = React.useState(0);
  const [rotation, setRotation] = React.useState(0);
  const [showContactModal, setShowContactModal] = React.useState(false);
  const { t } = useTranslation();

  const handleGestureEvent = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    console.log('Gesture event:', { translationX, translationY });
    setTranslateX(translationX);
    setTranslateY(translationY);
    setRotation(translationX * 0.1);
  };

  const handleStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      
      console.log('Swipe ended:', { translationX, translationY, SWIPE_DOWN_THRESHOLD });
      
      if (translationY > SWIPE_DOWN_THRESHOLD) {
        // Down swipe - Contact
        console.log('Down swipe detected! Opening contact modal');
        setShowContactModal(true);
        onContact(job);
      } else if (translationX > SWIPE_THRESHOLD) {
        // Right swipe - Choose
        onChoose(job);
      } else if (translationX < -SWIPE_THRESHOLD) {
        // Left swipe - Refuse
        onRefuse(job);
      } else {
        // Return to center
        console.log('Returning to center');
        setTranslateX(0);
        setTranslateY(0);
        setRotation(0);
      }
    }
  };

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

  const getSwipeIndicator = () => {
    if (translateY > 50) {
      return (
        <View style={[styles.swipeIndicator, styles.contactIndicator]}>
          <Text style={styles.swipeIndicatorText}>📞 {t('contactCompany')}</Text>
        </View>
      );
    } else if (translateX > 50) {
      return (
        <View style={[styles.swipeIndicator, styles.chooseIndicator]}>
          <Text style={styles.swipeIndicatorText}>{t('choose')}</Text>
        </View>
      );
    } else if (translateX < -50) {
      return (
        <View style={[styles.swipeIndicator, styles.refuseIndicator]}>
          <Text style={styles.swipeIndicatorText}>{t('refuse')}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
      enabled={isTop}
    >
      <View
        style={[
          styles.card,
          {
            transform: [
              { translateX },
              { translateY },
              { rotate: `${rotation}deg` },
            ],
            zIndex: isTop ? 10 : 1,
          },
        ]}
      >
        <ThemedView style={styles.cardContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.jobTypeContainer}>
              <Text style={styles.jobTypeIcon}>{JOB_TYPE_ICONS[job.jobType]}</Text>
            </View>
            <View style={styles.titleContainer}>
              <ThemedText style={styles.title}>{job.title}</ThemedText>
              <ThemedText style={styles.company}>{job.company.name}</ThemedText>
            </View>
          </View>

          {/* Salary and Japanese Level */}
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
          </View>

          {/* Commute Time */}
          <View style={styles.commuteContainer}>
            <ThemedText style={styles.commuteLabel}>{t('commuteTime')}</ThemedText>
            <View style={styles.commuteTimes}>
              <View style={styles.commuteItem}>
                <ThemedText style={styles.commuteType}>{t('fromHome')}</ThemedText>
                <ThemedText style={styles.commuteTime}>
                  {formatCommuteTime(job.commuteTime.home)}
                </ThemedText>
              </View>
              <View style={styles.commuteItem}>
                <ThemedText style={styles.commuteType}>{t('fromSchool')}</ThemedText>
                <ThemedText style={styles.commuteTime}>
                  {formatCommuteTime(job.commuteTime.school)}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Work Days */}
          <View style={styles.workDaysContainer}>
            <ThemedText style={styles.workDaysLabel}>{t('workDays')}</ThemedText>
            <View style={styles.workDaysList}>
              {job.workDays.map((day) => (
                <View key={day} style={styles.workDayBadge}>
                  <Text style={styles.workDayText}>{t(WORK_DAY_LABELS[day])}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Appeal Points */}
          <View style={styles.appealContainer}>
            <ThemedText style={styles.appealLabel}>{t('appealPoints')}</ThemedText>
            <View style={styles.appealList}>
              {job.appealPoints.map((point, index) => (
                <View key={index} style={styles.appealBadge}>
                  <Text style={styles.appealText}>{t(point)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Swipe Indicator */}
          {getSwipeIndicator()}
        </ThemedView>
        
        {/* Contact Modal */}
        <ContactModal
          visible={showContactModal}
          onClose={() => setShowContactModal(false)}
          job={job}
        />
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width * 0.9,
    height: height * 0.6,
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  jobTypeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  jobTypeIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  company: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  salaryContainer: {
    flex: 1,
  },
  salaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  salary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  levelContainer: {
    alignItems: 'flex-end',
  },
  levelLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  level: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  commuteContainer: {
    marginBottom: 20,
  },
  commuteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commuteTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commuteItem: {
    alignItems: 'center',
    flex: 1,
  },
  commuteType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  commuteTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workDaysContainer: {
    marginBottom: 20,
  },
  workDaysLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workDaysList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  workDayBadge: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  workDayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appealContainer: {
    flex: 1,
  },
  appealLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appealList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  appealBadge: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appealText: {
    fontSize: 12,
    color: '#495057',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
  },
  chooseIndicator: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    borderColor: '#2ecc71',
  },
  refuseIndicator: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    borderColor: '#e74c3c',
  },
  contactIndicator: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    borderColor: '#3498db',
  },
  swipeIndicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});