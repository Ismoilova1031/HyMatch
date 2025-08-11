import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, PanResponder } from 'react-native';
import { ToastAndroid, Pressable, Modal, Linking } from 'react-native';
import { iconMap } from '../constants/iconMap';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_DOWN_THRESHOLD = 0.12 * Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 580;

interface Job {
  id: number;
  company: string;
  jobTitle: string;
  wage: string;
  japaneseLevel: string;
  commuteTime: string;
  station: string;
  days: string[];
  shiftTime: string;
  icons: string[];
}

// Sample data (10 ta karta)
const jobs: Job[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  company: `Company_${i + 1}`,
  jobTitle: 'Delivery (bicycle)',
  wage: '¥1,400〜¥1,700',
  japaneseLevel: 'N3',
  commuteTime: '10 min',
  station: 'Ikebukuro',
  days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  shiftTime: '10:00 ~ 16:00',
  icons: ['deadline', 'chine', 'trainCoin'],
}));

export default function SwipeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const handlePress = (text: string) => {
    setSelectedText(text);
    setModalVisible(true);
  };

  const panResponder = useRef(
    PanResponder.create({
      // Only start handling after a meaningful move so taps go to children
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        // Reset offset when starting new gesture
        translateX.setOffset(0);
        translateY.setOffset(0);
        // Also reset the current values to ensure clean gesture start
        translateX.setValue(0);
        translateY.setValue(0);
        rotate.setValue(0);
        // Reset swipe direction flags
        setIsSwipingLeft(false);
        setIsSwipingRight(false);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy);
        
        // Swipe yo'nalishiga qarab overlay ko'rsatish
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
        // Down swipe => open contact modal (phone/SMS)
        if (
          gestureState.dy > SWIPE_DOWN_THRESHOLD &&
          Math.abs(gestureState.dx) < SWIPE_THRESHOLD / 2
        ) {
          setContactVisible(true);
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: false }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: false }),
            Animated.spring(rotate, { toValue: 0, useNativeDriver: false }),
          ]).start();
          setIsSwipingLeft(false);
          setIsSwipingRight(false);
          return;
        }

        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
          const isRight = gestureState.dx > 0;
          const toValue = isRight ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

          Animated.parallel([
            Animated.timing(translateX, {
              toValue,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(translateY, {
              toValue: gestureState.dy,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(rotate, {
              toValue: isRight ? 1 : -1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start(() => {
            if (currentIndex < jobs.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            }
            // Keyingi karta uchun animatsiyalarni tozalash
            translateX.setValue(0);
            translateY.setValue(0);
            rotate.setValue(0);
            translateX.setOffset(0);
            translateY.setOffset(0);
            setIsSwipingLeft(false);
            setIsSwipingRight(false);
          });
        } else {
          setIsSwipingLeft(false);
          setIsSwipingRight(false);
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: false }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: false }),
            Animated.spring(rotate, { toValue: 0, useNativeDriver: false }),
          ]).start();
        }
      },
    })
  ).current;

  const renderCard = (job: Job, index: number) => {
    // Faqat hozirgi top karta va undan keyingi bitta kartani ko'rsatamiz
    if (index < currentIndex) return null; // Olib tashlangan kartalar umuman ko'rinmasin
    if (index > currentIndex + 1) return null; // 3-chi va undan keyingi kartalar ko'rsatilmasin

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
        zIndex: 3,
        elevation: 12
      };
    } else if (isSecond) {
      scale = 0.95;
      cardStyle = {
        // Slightly smaller (positional offset applied below via absolute top/left)
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
            top: (index - currentIndex) * 8, // Back cards sit slightly lower
            left: (index - currentIndex) * 5, // and slightly to the right
          }
        ]}
        // Faqat ustki karta touch olsin
        pointerEvents={isFirst ? 'auto' : 'none'}
      >
        {/* Qator 1 */}
        <View style={styles.row}>
          <Pressable onPress={() => handlePress('Kampaniya nomi!')}>
            <Image source={iconMap.company} style={styles.icon} />
          </Pressable>
          <Text style={styles.text}>{job.company}</Text>
        </View>
        <View style={styles.separator} />

        {/* Qator 2 */}
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress('Ish turi!')}>
              <Image source={iconMap.todo} style={styles.icon} />
            </Pressable>
            <Text> {job.jobTitle}</Text>
          </View>
          <Image source={iconMap.policeman} style={styles.icon} />
        </View>
        <View style={styles.separator} />

        {/* Qator 3 */}
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress('Maosh!')}>
              <Image source={iconMap.coin} style={styles.icon} />
            </Pressable>
            <Text> {job.wage}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={() => handlePress('Yapon tili darajasi!')}>
                <Image source={iconMap.language} style={styles.icon} />
              </Pressable>
              <View style={{ alignItems: 'center', marginLeft: 8 }}>
                <Text style={styles.japaneseLevelText}>{job.japaneseLevel}</Text>
                <View style={styles.levelDots}>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.activeDot}>•</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.dot}>•</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Qator 4 */}
        <View style={styles.rowSpaceBetween}>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress('Yurish vaqti!')}>
              <Image source={iconMap.steps} style={styles.icon} />
            </Pressable>
            <Text> {job.commuteTime}</Text>
          </View>
          <View style={styles.row}>
            <Pressable onPress={() => handlePress('Vokzal!')}>
              <Image source={iconMap.train} style={styles.icon} />
            </Pressable>
            <Text> {job.station}</Text>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Qator 5 */}
        <View style={styles.row}>
          <Pressable onPress={() => handlePress('Ish kunlari!')}>
            <Image source={iconMap.calendar} style={styles.icon} />
          </Pressable>
          {Array.isArray(job.days) &&
            job.days.map((d, idx) => (
              <View
                key={d}
                style={[
                  styles.dayCircle,
                  { backgroundColor: idx < 4 ? 'orange' : '#ccc' },
                ]}
              >
                <Text style={{ fontSize: 10, color: '#fff' }}>{d}</Text>
              </View>
            ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <Pressable onPress={() => handlePress('Ish vaqti!')}>
            <Image source={iconMap.clock} style={{ width: 14, height: 14, marginRight: 6 }} />
          </Pressable>
          <Text>{job.shiftTime}</Text>
        </View>
        <View style={styles.separator} />

        {/* Qator 6 */}
        <View style={styles.row}>
          <Pressable onPress={() => handlePress('Ish belgilar!')}>
            <Image source={iconMap.star} style={[styles.icon, { marginRight: 8 }]} />
          </Pressable>
          {Array.isArray(job.icons) &&
            job.icons
              .filter((iconName) => iconName !== 'star')
              .map((iconName, index) => (
                <Image
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
      {/* Contact modal (down swipe) */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={contactVisible}
        onRequestClose={() => setContactVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Kompaniya bilan bog'lanish</Text>
            <View style={{ flexDirection: 'row', gap: 16, marginVertical: 12 }}>
              <Pressable onPress={() => Linking.openURL('sms:05012345678')}>
                <Image source={iconMap.todo} style={{ width: 40, height: 40 }} />
              </Pressable>
              <Pressable onPress={() => Linking.openURL('tel:05012345678')}>
                <Image source={iconMap.clock} style={{ width: 40, height: 40 }} />
              </Pressable>
            </View>
            <Pressable style={styles.button} onPress={() => setContactVisible(false)}>
              <Text style={styles.buttonText}>Yopish</Text>
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
              <Text style={styles.buttonText}>Yopish</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {jobs.map((job, index) => renderCard(job, index))}
      </View>

      {/* Dynamic gesture overlay: har doim hozirgi top card uchun */}
      {currentIndex < jobs.length && (
        <Animated.View
          key={`gesture-${currentIndex}`} // Key qo'shib, har yangi top card uchun yangi overlay
          pointerEvents="auto"
          style={[
            styles.gestureOverlay,
            {
              // Overlay hozirgi top card hududi bilan bir xil joyda
              top: 100 + (0 * 8), // Top card har doim 0-offset
              left: (SCREEN_WIDTH - CARD_WIDTH) / 2 + (0 * 5), // Top card har doim 0-offset
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            },
          ]}
          {...panResponder.panHandlers}
        />
      )}

      {/* Overlay Labels - Now positioned relative to the card and move with it */}
      {isSwipingLeft && (
        <Animated.View 
          style={[
            styles.overlayLabelRight, // Changed to overlayLabelRight for top-right corner
            {
              transform: [
                { translateX: translateX },
                { translateY: translateY }
              ],
              opacity: translateX.interpolate({
                inputRange: [-SCREEN_WIDTH, 0],
                outputRange: [1, 0.3],
                extrapolate: 'clamp'
              })
            }
          ]}
        >
          <Image source={iconMap.refusal} style={styles.overlayImage} />
        </Animated.View>
      )}
      
      {isSwipingRight && (
        <Animated.View 
          style={[
            styles.overlayLabelLeft, // Changed to overlayLabelLeft for top-left corner
            {
              transform: [
                { translateX: translateX },
                { translateY: translateY }
              ],
              opacity: translateX.interpolate({
                inputRange: [0, SCREEN_WIDTH],
                outputRange: [0.3, 1],
                extrapolate: 'clamp'
              })
            }
          ]}
        >
          <Image source={iconMap.choose} style={styles.overlayImage} />
        </Animated.View>
      )}

      {/* Trash – chap burchakda 1/4 aylana */}
      <View style={styles.quarterCircleLeft}>
        <Image
          source={
            isSwipingLeft
              ? iconMap.trashFilled
              : iconMap.trash
          }
          style={styles.iconTrashCorner}
        />
      </View>

      <View style={styles.quarterCircleRight}>
        <Image
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
    bottom: 8,
    left: 8,
  },

  iconHeartCorner: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 8,
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
    fontSize: 24, // 🔁 biroz kattaroq
    color: '#bbb',
    marginHorizontal: 2,
  },

  activeDot: {
    fontSize: 24, // 🔁 biroz kattaroq
    color: 'green',
    marginHorizontal: 2,
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
    width: 29,
    height: 29,
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

