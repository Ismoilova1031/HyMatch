import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text as ThemedText } from '@/components/Themed';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import ProfileCompletionModal from './ProfileCompletionModal';
import { validateProfileForJobApplication } from '@/utils/profileValidation';
import { ProfileData } from '@/types/profile';
import { useTranslation } from 'react-i18next';

// Example usage of profile validation
export default function ProfileValidationExample() {
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<any[]>([]);
  const { t } = useTranslation();

  // Example profile data (incomplete)
  const exampleProfile: ProfileData = {
    firstName: '田中',
    lastName: '', // Missing
    age: 25,
    profilePhoto: '',
    nationality: '中国',
    gender: 'male',
    homeStation: { stationName: '新宿駅', walkingMinutes: 5 },
    schoolStation: { stationName: '', walkingMinutes: 0 }, // Missing
    address: {
      postalCode: '1600022',
      prefecture: '東京都',
      city1: '新宿区',
      city2: '',
      streetAddress: '新宿3-1-1',
    },
    email: 'tanaka@example.com',
    phoneNumber: '090-1234-5678',
    visaStatus: {
      currentVisaType: '留学',
      visaImage: '', // Missing
      plannedChange: false,
      plannedVisaType: '',
      certificateImage: '',
    },
    japaneseLevel: 'N3',
    preferredWorkDays: ['monday', 'tuesday'], // Missing some days
    currentOccupation: 'student',
    desiredJobType: 'アルバイト',
    workHistory: 'コンビニで1年間アルバイト経験あり',
  };

  const handleJobApplication = () => {
    const missing = validateProfileForJobApplication(exampleProfile);
    
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowModal(true);
    } else {
      // Proceed with job application
      console.log('Profile is complete, proceeding with application');
    }
  };

  const handleNavigateToProfile = () => {
    setShowModal(false);
    router.push('/profile-edit');
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{t('jobApplicationExample')}</ThemedText>
      <ThemedText style={styles.description}>
        {t('jobApplicationExampleDesc')}
      </ThemedText>
      
      <TouchableOpacity style={styles.button} onPress={handleJobApplication}>
        <ThemedText style={styles.buttonText}>{t('applyForJob')}</ThemedText>
      </TouchableOpacity>

      <ProfileCompletionModal
        visible={showModal}
        missingFields={missingFields}
        onClose={() => setShowModal(false)}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    color: '#666',
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});