import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
} from 'react-native';
import SwipeCard from './SwipeCard';
import { JobData } from '@/types/job';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const CARD_OFFSET = 8;
const MAX_VISIBLE_CARDS = 3;

interface SwipeCardStackProps {
  jobs: JobData[];
  onChoose: (job: JobData) => void;
  onRefuse: (job: JobData) => void;
}

export default function SwipeCardStack({ jobs, onChoose, onRefuse }: SwipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardAnimations] = useState(() => 
    (jobs || []).slice(0, MAX_VISIBLE_CARDS).map(() => new Animated.Value(0))
  );
  const { t } = useTranslation();

  useEffect(() => {
    // Animate cards to their positions
    const animations = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: index * CARD_OFFSET,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  }, []);

  const handleChoose = (job: JobData) => {
    animateCardOut('right', () => {
      onChoose(job);
      moveToNextCard();
    });
  };

  const handleRefuse = (job: JobData) => {
    animateCardOut('left', () => {
      onRefuse(job);
      moveToNextCard();
    });
  };

  const animateCardOut = (direction: 'left' | 'right', callback: () => void) => {
    const translateX = direction === 'right' ? width * 1.5 : -width * 1.5;
    
    Animated.timing(cardAnimations[0], {
      toValue: translateX,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      callback();
    });
  };

  const moveToNextCard = () => {
    setCurrentIndex(prev => prev + 1);
    
    // Reset animations for next cards
    cardAnimations.forEach((anim, index) => {
      if (index < cardAnimations.length - 1) {
        anim.setValue(0);
      } else {
        anim.setValue(0);
      }
    });

    // Animate remaining cards to their new positions
    const animations = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: index * CARD_OFFSET,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  };

  const getVisibleJobs = () => {
    return (jobs || []).slice(currentIndex, currentIndex + MAX_VISIBLE_CARDS);
  };

  const renderCards = () => {
    const visibleJobs = getVisibleJobs();
    
    return visibleJobs.map((job, index) => {
      const isTop = index === 0;
      const cardIndex = index;
      
      return (
        <Animated.View
          key={`${job.id}-${currentIndex + index}`}
          style={[
            styles.cardContainer,
            {
              transform: [
                {
                  translateY: cardAnimations[cardIndex] || new Animated.Value(index * CARD_OFFSET),
                },
              ],
              zIndex: MAX_VISIBLE_CARDS - index,
            },
          ]}
        >
          <SwipeCard
            job={job}
            onChoose={handleChoose}
            onRefuse={handleRefuse}
            isTop={isTop}
          />
        </Animated.View>
      );
    });
  };

  if (currentIndex >= (jobs || []).length) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t('noJobs')}</Text>
          <Text style={styles.emptySubtext}>{t('waitForNewJobs')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderCards()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#adb5bd',
  },
});