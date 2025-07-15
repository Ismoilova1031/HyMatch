import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';

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
  icons: ['star', 'deadline', 'chine', 'traincoin'],
}));

// Iconlar
const iconMap: Record<string, any> = {
  company: require('../assets/images/icons/company.png'),
  todo: require('../assets/images/icons/todo.png'),
  coin: require('../assets/images/icons/coin.png'),
  policeman: require('../assets/images/icons/policeman.png'),
  language: require('../assets/images/icons/language.png'),
  steps: require('../assets/images/icons/steps.png'),
  train: require('../assets/images/icons/train.png'),
  calendar: require('../assets/images/icons/calendar.png'),
  clock: require('../assets/images/icons/clock.png'),
  star: require('../assets/images/icons/star.png'),
  deadline: require('../assets/images/icons/deadline.png'),
  chine: require('../assets/images/icons/chine.png'),
  traincoin: require('../assets/images/icons/train_coin.png'),
};

export default function SwipeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9efe7' }}>
      <Swiper
        cards={jobs}
        renderCard={(job) => {
          if (!job) return <Text>Loading...</Text>;

          return (
            <View style={styles.card}>
              {/* Qator 1 */}
                <View style={styles.row}>
                <Image source={iconMap.company} style={styles.icon} />
                <Text style={styles.text}>{job.company}</Text>
                </View>
              <View style={styles.separator} />

              {/* Qator 2 */}
              <View style={styles.rowSpaceBetween}>
                <View style={styles.row}>
                  <Image source={iconMap.todo} style={styles.icon} />
                  <Text> {job.jobTitle}</Text>
                </View>
                <Image source={iconMap.policeman} style={styles.icon} />
              </View>
              <View style={styles.separator} />

              {/* Qator 3 */}
              <View style={styles.rowSpaceBetween}>
                <View style={styles.row}>
                  <Image source={iconMap.coin} style={styles.icon} />
                  <Text> {job.wage}</Text>
                </View>
<View style={{ alignItems: 'flex-end' }}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image source={iconMap.language} style={styles.icon} />
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
                  <Image source={iconMap.steps} style={styles.icon} />
                  <Text> {job.commuteTime}</Text>
                </View>
                <View style={styles.row}>
                  <Image source={iconMap.train} style={styles.icon} />
                  <Text> {job.station}</Text>
                </View>
              </View>
              <View style={styles.separator} />

              {/* Qator 5 */}
              <View style={styles.row}>
                <Image source={iconMap.calendar} style={styles.icon} />
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
                  <Image source={iconMap.clock} style={{ width: 14, height: 14, marginRight: 6 }} />
                  <Text>{job.shiftTime}</Text>
                </View>
              <View style={styles.separator} />

              {/* Qator 6 */}
              <View style={styles.row}>
                {Array.isArray(job.icons) &&
                  job.icons.map((iconName, index) => (
                    <Image
                      key={index}
                      source={iconMap[iconName]}
                      style={[styles.icon, { marginRight: 8 }]}
                    />
                  ))}
              </View>
            </View>
          );
        }}
        onSwipedRight={() => console.log('Choose')}
        onSwipedLeft={() => console.log('Refuse')}
        stackSize={3}
        overlayLabels={{
    left: {
      element: (
        <View style={styles.overlayLabelLeft}>
          <Image source={require('../assets/images/icons/refusal.png')} style={styles.overlayImage} />
        </View>
      ),
      style: {
        wrapper: {
          position: 'absolute',
          top: 20,
          right: 20,
        },
      },
    },
    right: {
      element: (
        <View style={styles.overlayLabelRight}>
          <Image source={require('../assets/images/icons/choose.png')} style={styles.overlayImage} />
        </View>
      ),
      style: {
        wrapper: {
          position: 'absolute',
          top: 20,
          left: 20,
        },
      },
    },
  }}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  japaneseLevelText: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 2,
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
  width: 140,            // 🔁 Kattalashtirildi
  height: 140,
  resizeMode: 'contain',
  opacity: 0.6,   
},
overlayLabelLeft: {
  alignItems: 'flex-end',
},
overlayLabelRight: {
  alignItems: 'flex-start',
},
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9efe7', // 🔁 orqa fon rangi
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#e9e8e4', // 🔁 card fon rangi
    borderRadius: 12,
    padding: 28,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
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
    marginBottom: 8,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16, // 🔁 oldingi 14
    fontWeight: '600',
  },
  flagText: {
    fontSize: 20, 
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  icon: {
    width: 36, // 🔁 oldingi 20
    height: 36,
    resizeMode: 'contain',
    marginRight: 8,
  },
});

