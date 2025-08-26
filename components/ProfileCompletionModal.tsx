import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { iconMap } from '@/constants/iconMap';
import { MissingField, formatMissingFieldsMessage } from '@/utils/profileValidation';
import { useTranslation } from 'react-i18next';

interface ProfileCompletionModalProps {
  visible: boolean;
  missingFields: MissingField[];
  onClose: () => void;
  onNavigateToProfile: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ProfileCompletionModal({
  visible,
  missingFields,
  onClose,
  onNavigateToProfile,
}: ProfileCompletionModalProps) {
  const { t } = useTranslation();
  const message = formatMissingFieldsMessage(missingFields);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{t('profileIncomplete')}</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.iconContainer}>
              <ThemedText style={styles.icon}>⚠️</ThemedText>
            </View>

            <ThemedText style={styles.message}>
              {t('profileRequiredMessage')}
            </ThemedText>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>{t('missingFields')}</ThemedText>
                <ThemedText style={styles.summaryValue}>{missingFields.length}{t('fieldsUnit')}</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>{t('missingSections')}</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {[...new Set(missingFields.map(field => field.section))].length}{t('sectionsUnit')}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <ThemedText style={styles.detailsTitle}>{t('missingFieldsDetail')}</ThemedText>
              {[...new Set(missingFields.map(field => field.section))].map((section) => (
                <View key={section} style={styles.sectionContainer}>
                  <ThemedText style={styles.sectionTitle}>{section}</ThemedText>
                  {missingFields
                    .filter(field => field.section === section)
                    .map((field, index) => (
                      <View key={index} style={styles.fieldItem}>
                        <ThemedText style={styles.fieldBullet}>•</ThemedText>
                        <ThemedText style={styles.fieldLabel}>{field.label}</ThemedText>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <ThemedText style={styles.cancelButtonText}>{t('later')}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateToProfile} style={styles.profileButton}>
              <ThemedText style={styles.profileButtonText}>{t('editProfile')}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
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
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 48,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 3,
  },
  fieldBullet: {
    fontSize: 12,
    color: '#ff6b6b',
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  profileButton: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});