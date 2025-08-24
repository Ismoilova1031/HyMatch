import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { iconMap } from '@/constants/iconMap';
import SmartImage from '@/components/SmartImage';

// using centralized iconMap

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MenuModal({ visible, onClose }: MenuModalProps) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<'ja' | 'en' | 'uz'>('ja');

  const handleLanguagePress = () => {
    Alert.alert(
      t('languageSelectTitle'),
      t('languageSelectDesc'),
      [
        { 
          text: t('japanese'), 
          onPress: () => {
            setSelectedLanguage('ja');
            setTimeout(() => i18n.changeLanguage('ja'), 0);
          }
        },
        { 
          text: t('english'), 
          onPress: () => {
            setSelectedLanguage('en');
            setTimeout(() => i18n.changeLanguage('en'), 0);
          }
        },
        { 
          text: t('uzbek'), 
          onPress: () => {
            setSelectedLanguage('uz');
            setTimeout(() => i18n.changeLanguage('uz'), 0);
          }
        },
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  const handleProfilePress = () => {
    router.push('/profile-edit');
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <View style={styles.topBar}>
          <Text style={styles.title}>{t('menu')}</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <SmartImage source={iconMap.close} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Language Selection */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLanguagePress} activeOpacity={0.7}>
          <View style={styles.circle}>
            <SmartImage source={iconMap.language} style={styles.menuIcon} />
          </View>
          <View style={styles.menuContent}>
            <ThemedText style={styles.menuText}>{t('languageSetting')}</ThemedText>
            <Text style={styles.selectedValue}>
              {t(selectedLanguage === 'ja' ? 'japanese' : selectedLanguage === 'en' ? 'english' : 'uzbek')}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Profile */}
        <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress} activeOpacity={0.7}>
          <View style={styles.circle}>
            <SmartImage source={iconMap.company} style={styles.menuIcon} />
          </View>
          <View style={styles.menuContent}>
            <ThemedText style={styles.menuText}>{t('profile')}</ThemedText>
            <Text style={styles.subText}>{t('editProfile')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: 300,
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    flex: 1,
    marginLeft: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  selectedValue: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
});