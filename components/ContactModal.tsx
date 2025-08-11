import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { JobData } from '@/types/job';

interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
  job: JobData | null;
}

export default function ContactModal({ visible, onClose, job }: ContactModalProps) {
  const { t } = useTranslation();

  const handleSMS = async () => {
    console.log('SMS button pressed');
    if (!job?.company.phone) {
      Alert.alert(t('error'), t('phoneNumberNotAvailable'));
      return;
    }

    try {
      const smsUrl = `sms:${job.company.phone}`;
      console.log('SMS URL:', smsUrl);
      
      const canOpen = await Linking.canOpenURL(smsUrl);
      console.log('Can open SMS URL:', canOpen);
      
      if (canOpen) {
        console.log('Opening SMS app...');
        await Linking.openURL(smsUrl);
        onClose();
      } else {
        console.log('Cannot open SMS URL');
        // In Expo Go, show phone number for manual dialing
        Alert.alert(
          t('contactCompany'),
          `SMS: ${job.company.phone}\n\n${t('cannotOpenSMS')}`,
          [
            { text: t('cancel'), style: 'cancel' },
            { text: 'OK', onPress: () => onClose() }
          ]
        );
      }
    } catch (error) {
      console.log('SMS error:', error);
      Alert.alert(
        t('contactCompany'),
        `SMS: ${job.company.phone}\n\n${t('errorOpeningSMS')}`,
        [
          { text: t('cancel'), style: 'cancel' },
          { text: 'OK', onPress: () => onClose() }
        ]
      );
    }
  };

  const handleCall = async () => {
    console.log('Phone button pressed');
    if (!job?.company.phone) {
      Alert.alert(t('error'), t('phoneNumberNotAvailable'));
      return;
    }

    try {
      const phoneUrl = `tel:${job.company.phone}`;
      console.log('Phone URL:', phoneUrl);
      
      const canOpen = await Linking.canOpenURL(phoneUrl);
      console.log('Can open phone URL:', canOpen);
      
      if (canOpen) {
        console.log('Opening phone app...');
        await Linking.openURL(phoneUrl);
        onClose();
      } else {
        console.log('Cannot open phone URL');
        // In Expo Go, show phone number for manual dialing
        Alert.alert(
          t('contactCompany'),
          `${t('phone')}: ${job.company.phone}\n\n${t('cannotMakeCall')}`,
          [
            { text: t('cancel'), style: 'cancel' },
            { text: 'OK', onPress: () => onClose() }
          ]
        );
      }
    } catch (error) {
      console.log('Phone error:', error);
      Alert.alert(
        t('contactCompany'),
        `${t('phone')}: ${job.company.phone}\n\n${t('errorMakingCall')}`,
        [
          { text: t('cancel'), style: 'cancel' },
          { text: 'OK', onPress: () => onClose() }
        ]
      );
    }
  };

  if (!job) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('contactCompany')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{job.company.name}</Text>
            <Text style={styles.jobTitle}>{job.title}</Text>
            {job.company.phone && (
              <Text style={styles.phoneNumber}>{job.company.phone}</Text>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.smsButton]} 
              onPress={handleSMS}
            >
              <Ionicons name="chatbubble-outline" size={32} color="white" />
              <Text style={styles.buttonText}>{t('sendSMS')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.callButton]} 
              onPress={handleCall}
            >
              <Ionicons name="call-outline" size={32} color="white" />
              <Text style={styles.buttonText}>{t('makeCall')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  companyInfo: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  smsButton: {
    backgroundColor: '#34c759',
  },
  callButton: {
    backgroundColor: '#007aff',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
