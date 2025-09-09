import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, PanResponder } from 'react-native';
import { Pressable, Modal, Linking } from 'react-native';
import { iconMap } from '../constants/iconMap';
import { JOB_TYPE_ICONS } from '@/types/job';
import SmartImage from '../components/SmartImage';
import { useJobs } from '@/context/JobsContext';
import { JobData, WORK_DAY_LABELS } from '@/types/job';
import { useTranslation } from 'react-i18next';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_DOWN_THRESHOLD = 0.12 * Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 580;
// Render order for days of week
const ALL_DAYS: (keyof typeof WORK_DAY_LABELS)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default function SwipeScreen() {
  const { filteredJobs: jobs, markChosen, markRefused } = useJobs();
  const [modalVisible, setModalVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const { t } = useTranslation();

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  // Refs to ensure latest values in pan handlers
  const currentIndexRef = useRef(0);
  const jobsRef = useRef<JobData[]>(jobs);

  const handlePress = (text: string) => {
    setSelectedText(text);
    setModalVisible(true);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        translateX.setOffset(0);
        translateY.setOffset(0);
        translateX.setValue(0);
        translateY.setValue(0);
        rotate.setValue(0);
        setIsSwipingLeft(false);
        setIsSwipingRight(false);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy);
        if (gestureState.dx < -10) {
          setIsSwipingLeft(true);
          setIsSwipingRight(false);
        } else if (gestureState.dx > 10) {
          setIsSwipingRight(true);
          setIsSwipingLeft(false);
        } else {
          setIsSwipingLeft(false);
          setIsSwipingRight(false);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const idx = currentIndexRef.current;
        const job = jobsRef.current[idx];
        if (!job) return;
        console.log("[Swipe] release => idx:", idx, "job.id:", job.id, "dx:", gestureState.dx, "dy:", gestureState.dy, "vx:", gestureState.vx, "vy:", gestureState.vy);
        if (
          Math.abs(gestureState.dy) > SWIPE_DOWN_THRESHOLD &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          gestureState.dy > 0
        ) {
          setContactVisible(true);
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: false }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: false }),
            Animated.spring(rotate, { toValue: 0, useNativeDriver: false }),
          ]).start();
          return;
        }

        // Left/Right swipe to refuse/choose
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          const isRight = gestureState.dx > 0;
          const toValue = isRight ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

          setIsSwipingLeft(false);
          setIsSwipingRight(false);
          setIsAnimatingOut(true);

          Animated.parallel([
            Animated.timing(translateX, { toValue, duration: 200, useNativeDriver: false }),
            Animated.timing(translateY, { toValue: gestureState.dy, duration: 200, useNativeDriver: false }),
            Animated.timing(rotate, { toValue: isRight ? 1 : -1, duration: 200, useNativeDriver: false }),
          ]).start(() => {
            if (isRight) markChosen(String(job.id));
            else markRefused(String(job.id));

            const len = jobsRef.current.length;
            if (idx < len - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              // reached end of jobs
            }

            translateX.setValue(0);
            translateY.setValue(0);
            rotate.setValue(0);
            setIsAnimatingOut(false);
          });
        } else {
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: false }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: false }),
            Animated.spring(rotate, { toValue: 0, useNativeDriver: false }),
          ]).start();
        }
      }
      ,
    })
  ).current;

  useEffect(() => {
    setIsSwipingLeft(false);
    setIsSwipingRight(false);
  }, [currentIndex]);

  useEffect(() => {
    console.log('[Swipe] jobs.length changed =>', jobs.length, 'reset currentIndex to 0');
    setCurrentIndex(0);
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
  }, [jobs.length]);  

  useEffect(() => {
    console.log('[Swipe] currentIndex changed =>', currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);

  const renderCard = (job: JobData, index: number) => {
    if (index < currentIndex) return null;
    if (index > currentIndex + 1) return null;

    const isFirst = index === currentIndex;
    const isSecond = index === currentIndex + 1;
    const isThird = index === currentIndex + 2;

    let cardStyle = {};
    let scale = 1;
    let zIndex = 1;

    if (isFirst) {
      cardStyle = {
        transform: [
          { translateX: translateX },
          { translateY: translateY },
          { rotate: rotate.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['-10deg', '0deg', '10deg']
          })}
        ],
        zIndex: isAnimatingOut ? 1 : 3,
        elevation: isAnimatingOut ? 0 : 12,
        opacity: isAnimatingOut ? 0 : 1,
      };
    } else if (isSecond) {
      scale = 0.95;
      cardStyle = {
        transform: [{ scale }],
        zIndex: 2,
        elevation: 8
      };
    } else if (isThird) {
      scale = 0.9;
      cardStyle = {
        transform: [{ scale }],
        zIndex: 1,
        elevation: 4
      };
    }

    return (
      <Animated.View
        key={job.id}
        style={[
          styles.card,
          cardStyle,
          {
            position: 'absolute',
            top: (index - currentIndex) * 8,
            left: (index - currentIndex) * 5,
          }
        ]}
        pointerEvents={isFirst ? 'auto' : 'none'}
        {...(isFirst ? panResponder.panHandlers : {})}
      >
        {/* Row 1 */}
        <View style={styles.row}>
          <Pressable onPress={() => handlePress(t('companyName'))}>
            <SmartImage source={iconMap.companyISvg} style={styles.icon} />
          </Pressable>
          <Text style={styles.text}>{job.company.name}</Text>
        </View>
        <View style={styles.separator} />

        {/* Row 2 */}
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress(t('jobType'))}>
              <SmartImage source={iconMap.todoISvg} style={styles.icon} />
            </Pressable>
            <Text> {job.title}</Text>
          </View>
          <Text style={styles.jobTypeIcon}>{JOB_TYPE_ICONS[job.jobType]}</Text>
        </View>
        <View style={styles.separator} />

        {/* Row 3 */}
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress(t('wage'))}>
              <SmartImage source={iconMap.coinISvg} style={styles.icon} />
            </Pressable>
            <Text>
              {`${job.salary.currency}${job.salary.min}〜${job.salary.max}`}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={() => handlePress(t('japaneseLevel'))}>
                <SmartImage source={iconMap.languageISvg} style={styles.icon} />
              </Pressable>
              <View style={{ alignItems: 'center', marginLeft: 8 }}>
                <Text style={styles.japaneseLevelText}>{job.japaneseLevel}</Text>
                <View style={styles.levelDots}>
                  {[1, 2, 3, 4, 5].map((level) => {
                    const levelNumber = parseInt(job.japaneseLevel.replace('N', ''));
                    const isActive = level === (6 - levelNumber); // N5 = 1, N4 = 2, ..., N1 = 5
                    return (
                      <Text 
                        key={level} 
                        style={isActive ? styles.activeDot : styles.dot}>
                        •
                      </Text>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Row 4 */}
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress(t('commute'))}>
              <SmartImage source={iconMap.stepsISvg} style={styles.icon} />
            </Pressable>
            <Text> {`${job.commuteTime.home} min`}</Text>
          </View>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress(t('station'))}>
              <SmartImage source={iconMap.trainISvg} style={styles.icon} />
            </Pressable>
            <Text> {job.company.location}</Text>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Row 5 */}
        <View style={styles.row}>
          <Pressable onPress={() => handlePress(t('workDays'))}>
            <SmartImage source={iconMap.calendarISvg} style={styles.icon} />
          </Pressable>
          {ALL_DAYS.map((d) => {
            const isWorking = Array.isArray(job.workDays) && job.workDays.includes(d as any);
            return (
              <View
                key={d}
                style={[
                  styles.dayCircle,
                  { backgroundColor: isWorking ? 'orange' : '#ccc' },
                ]}
              >
                <Text style={{ fontSize: 10, color: '#fff' }}>{WORK_DAY_LABELS[d]}</Text>
              </View>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <Pressable onPress={() => handlePress(t('shiftTime'))}>
            <SmartImage source={iconMap.clockISvg} style={{ width: 14, height: 14, marginRight: 6 }} />
          </Pressable>
          <Text>{'10:00 ~ 16:00'}</Text>
        </View>
        <View style={styles.separator} />

        {/* Row 6 */}
        <View style={styles.row}>
          <Pressable onPress={() => handlePress(t('icons'))}>
            <SmartImage source={iconMap.starISvg} style={[styles.icon, { marginRight: 8 }]} />
          </Pressable>
          {['deadline', 'chine', 'trainCoin'].map((iconName, index) => (
            <SmartImage
              key={index}
              source={iconMap[iconName as keyof typeof iconMap]}
              style={[styles.icon, { marginRight: 8 }]}
            />
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Contact modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={contactVisible}
        onRequestClose={() => setContactVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{t('contactCompany')}</Text>
            <View style={{ flexDirection: 'row', gap: 16, marginVertical: 12 }}>
              <Pressable onPress={() => Linking.openURL('sms:05012345678')}>
                <SmartImage source={iconMap.email} style={{ width: 40, height: 40 }} />
              </Pressable>
              <Pressable onPress={() => Linking.openURL('tel:05012345678')}>
                <SmartImage source={iconMap.phone} style={{ width: 40, height: 40 }} />
              </Pressable>
            </View>
            <Pressable style={styles.button} onPress={() => setContactVisible(false)}>
              <Text style={styles.buttonText}>{t('close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{selectedText}</Text>
            <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>{t('close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {jobs.map((job, index) => renderCard(job, index))}
      </View>

      {/* Gesture overlay removed; panHandlers are attached to the top card itself */}
      {/* Overlay Labels */}
      <Animated.View 
        style={[
          styles.overlayLabelRight,
          {
            opacity: translateX.interpolate({
              inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
              outputRange: [1, 0, 0],
              extrapolate: 'clamp'
            }),
            transform: [
              { translateX: translateX },
              { translateY: translateY }
            ]
          }
        ]}
      >
        <SmartImage source={iconMap.refusal} style={styles.overlayImage} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.overlayLabelLeft,
          {
            opacity: translateX.interpolate({
              inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp'
            }),
            transform: [
              { translateX: translateX },
              { translateY: translateY }
            ]
          }
        ]}
      >
        <SmartImage source={iconMap.choose} style={styles.overlayImage} />
      </Animated.View>

      {/* Trash */}
      <View style={styles.quarterCircleLeft}>
        <SmartImage
          source={
            isSwipingLeft
              ? iconMap.trashFilled
              : iconMap.trash
          }
          style={styles.iconTrashCorner}
        />
      </View>

      <View style={styles.quarterCircleRight}>
        <SmartImage
          source={
            isSwipingRight
              ? iconMap.heartFilled
              : iconMap.heart
          }
          style={styles.iconHeartCorner}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  jobTypeIcon: {
    fontSize: 30,
    marginLeft: 6,
  },
  quarterCircleLeft: {
    position: 'absolute',
    bottom: 100, // TabBar ustidan biroz yuqorida
    left: 0,
    width: 85,
    height: 85,
    borderTopRightRadius: 100,
    backgroundColor: '#e9e8e4',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 100,
    opacity: 0.8,
    borderColor: '#ccc',
    borderRightWidth: 1,
    borderTopWidth: 1,
  },

  quarterCircleRight: {
    position: 'absolute',
    bottom: 100, // TabBar ustidan biroz yuqorida
    right: 0,
    width: 85,
    height: 85,
    borderTopLeftRadius: 100,
    backgroundColor: '#e9e8e4',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 100,
    opacity: 0.8,
    borderColor: '#ccc',
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  iconTrashCorner: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 22,
    left: 8,
  },

  iconHeartCorner: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 22,
    right: 8,
  },

  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 80, // 👇 TabBardan biroz yuqoriroq
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },

  actionCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // ← ✅ AYRIMLAR uchun oq fon
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  iconInsideCircle: {
    width: 36,
    height: 36,
    tintColor: '#fff',
  },

  japaneseLevelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  image: {
    width: 80,
    height: 80,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 250,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  levelDots: {
    flexDirection: 'row',
    gap: 2,
  },

  dot: {
    fontSize: 20, 
    color: '#bbb',
    marginHorizontal: 2,
  },
  
  activeDot: {
    fontSize: 32, 
    color: 'green',
    lineHeight: 30,
  },
  overlayImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    opacity: 0.8, // Increased opacity for better visibility
  },
  overlayLabelLeft: {
    position: 'absolute',
    top: 120, // Position at top-left corner of the card
    left: 40, // Position at left edge of the card
    zIndex: 1000, // Very high z-index to be above all cards
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelRight: {
    position: 'absolute',
    top: 120, // Position at top-right corner of the card
    right: 40, // Position at right edge of the card
    zIndex: 1000, // Very high z-index to be above all cards
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#f9efe7', 
    justifyContent: 'center',
    paddingTop: 80, // Header uchun joy
    paddingBottom: 90, // Tab bar uchun joy
  },
  cardContainer: {
    position: 'absolute',
    top: 100,
    left: (SCREEN_WIDTH - CARD_WIDTH) / 2, // Center the cards horizontally
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#e9e8e4', // 🔁 card fon rangi
    borderRadius: 12,
    padding: 20,
    borderColor: '#ccc',
    elevation: 8, // Increased elevation for better layering
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: CARD_HEIGHT, // Kattalashtirildi
    width: CARD_WIDTH, // Kattalashtirildi
    position: 'absolute',
    top: 0,
    left: 0,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 7,
    marginTop: 7,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 20, // Kattalashtirildi
    fontWeight: '600',
  },
  flagText: {
    fontSize: 24, // Kattalashtirildi
  },
  dayCircle: {
    width: 27,
    height: 27,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  icon: {
    width: 40, // Kattalashtirildi
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  // Ustki karta hududi uchun gesture overlay (faqat shu maydonda swipe ishlaydi)
  gestureOverlay: {
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: 'transparent',
  },
});

