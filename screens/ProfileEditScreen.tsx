import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ProfileData, JAPANESE_PREFECTURES, NATIONALITIES, VISA_TYPES, JAPANESE_LEVELS, WORK_DAYS, OCCUPATIONS } from '@/types/profile';
import { iconMap } from '@/constants/iconMap';
import SmartImage from '@/components/SmartImage';
import { fetchAddressByPostalCode, fetchAddressByPostalCodeAlternative } from '@/utils/addressApi';
import { generateProfilePDF, savePDFToDownloads, sharePDF } from '@/utils/pdfGenerator';
import { useTranslation } from 'react-i18next';

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  // Map raw option values to translation keys for pickers
  const optionValueTranslationKey: Record<string, string> = {
    // Visa types
    '留学': 'visa.student',
    '就学': 'visa.school',
    '研修': 'visa.training',
    '家族滞在': 'visa.familyStay',
    '特定活動': 'visa.specificActivity',
    '短期滞在': 'visa.shortStay',
    '永住者': 'visa.permanentResident',
    '日本人の配偶者等': 'visa.spouseOfJapanese',
    '永住者の配偶者等': 'visa.spouseOfPermanent',
    '定住者': 'visa.longTermResident',
    '高度専門職': 'visa.highlySkilled',
    '技術・人文知識・国際業務': 'visa.engineerHumanitiesIntl',
    '技能': 'visa.skilledLabor',
    'その他': 'common.other',
    // Occupations (labels)
    '学生': 'occupation.student',
    '会社員': 'occupation.employed',
    '無職': 'occupation.unemployed',
    // Nationalities (examples; add more as needed)
    '中国': 'nationality.china',
    '韓国': 'nationality.korea',
    'ウズベキスタン': 'nationality.uzbekistan',
    'ベトナム': 'nationality.vietnam',
    'フィリピン': 'nationality.philippines',
    'ネパール': 'nationality.nepal',
    'インドネシア': 'nationality.indonesia',
    'タイ': 'nationality.thailand',
    'ミャンマー': 'nationality.myanmar',
    'カンボジア': 'nationality.cambodia',
    'ラオス': 'nationality.laos',
    'モンゴル': 'nationality.mongolia',
    'スリランカ': 'nationality.srilanka',
    'バングラデシュ': 'nationality.bangladesh',
    'パキスタン': 'nationality.pakistan',
    'インド': 'nationality.india',
    // Prefectures (full)
    '北海道': 'pref.hokkaido',
    '青森県': 'pref.aomori',
    '岩手県': 'pref.iwate',
    '宮城県': 'pref.miyagi',
    '秋田県': 'pref.akita',
    '山形県': 'pref.yamagata',
    '福島県': 'pref.fukushima',
    '茨城県': 'pref.ibaraki',
    '栃木県': 'pref.tochigi',
    '群馬県': 'pref.gunma',
    '埼玉県': 'pref.saitama',
    '千葉県': 'pref.chiba',
    '東京都': 'pref.tokyo',
    '神奈川県': 'pref.kanagawa',
    '新潟県': 'pref.niigata',
    '富山県': 'pref.toyama',
    '石川県': 'pref.ishikawa',
    '福井県': 'pref.fukui',
    '山梨県': 'pref.yamanashi',
    '長野県': 'pref.nagano',
    '岐阜県': 'pref.gifu',
    '静岡県': 'pref.shizuoka',
    '愛知県': 'pref.aichi',
    '三重県': 'pref.mie',
    '滋賀県': 'pref.shiga',
    '京都府': 'pref.kyoto',
    '大阪府': 'pref.osaka',
    '兵庫県': 'pref.hyogo',
    '奈良県': 'pref.nara',
    '和歌山県': 'pref.wakayama',
    '鳥取県': 'pref.tottori',
    '島根県': 'pref.shimane',
    '岡山県': 'pref.okayama',
    '広島県': 'pref.hiroshima',
    '山口県': 'pref.yamaguchi',
    '徳島県': 'pref.tokushima',
    '香川県': 'pref.kagawa',
    '愛媛県': 'pref.ehime',
    '高知県': 'pref.kochi',
    '福岡県': 'pref.fukuoka',
    '佐賀県': 'pref.saga',
    '長崎県': 'pref.nagasaki',
    '熊本県': 'pref.kumamoto',
    '大分県': 'pref.oita',
    '宮崎県': 'pref.miyazaki',
    '鹿児島県': 'pref.kagoshima',
    '沖縄県': 'pref.okinawa',
  };
  
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    age: 0,
    profilePhoto: undefined,
    nationality: '',
    gender: 'male',
    homeStation: {
      stationName: '',
      walkingMinutes: 0,
    },
    schoolStation: {
      stationName: '',
      walkingMinutes: 0,
    },
    address: {
      postalCode: '',
      prefecture: '',
      city1: '',
      city2: '',
      streetAddress: '',
    },
    email: '',
    phoneNumber: '',
    visaStatus: {
      currentVisaType: '',
      visaImage: undefined,
      plannedChange: false,
      plannedVisaType: undefined,
      certificateImage: undefined,
    },
    japaneseLevel: 'N5',
    preferredWorkDays: [],
    currentOccupation: 'student',
    desiredJobType: '',
    workHistory: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [fetchedAddress, setFetchedAddress] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const autoFillAddress = async () => {
    const postalCode = profile.address.postalCode.trim();
    if (!postalCode) {
      Alert.alert(t('error'), t('enterPostalCode'));
      return;
    }

    // Validate postal code format (6 or 7 digits)
    const cleanPostalCode = postalCode.replace(/\D/g, '');
    if (cleanPostalCode.length < 6 || cleanPostalCode.length > 7) {
      Alert.alert(t('error'), t('postalCodeLength'));
      return;
    }

    setIsLoadingAddress(true);
    try {
      // Try primary API first
      let addressData = await fetchAddressByPostalCode(cleanPostalCode);
      
      // If primary API fails, try alternative API
      if (!addressData) {
        addressData = await fetchAddressByPostalCodeAlternative(cleanPostalCode);
      }

      if (addressData) {
        setProfile({
          ...profile,
          address: {
            ...profile.address,
            postalCode: cleanPostalCode, // Update with cleaned postal code
            prefecture: addressData.prefecture,
            city1: addressData.city1,
            city2: addressData.city2,
            streetAddress: addressData.streetAddress,
          }
        });
        
        // Create display address string
        const displayAddress = [
          addressData.prefecture,
          addressData.city1,
          addressData.city2
        ].filter(Boolean).join(' ');
        setFetchedAddress(displayAddress);
        
        Alert.alert(t('success'), t('addressAutoFilled'));
      }
    } catch (error: any) {
      Alert.alert(t('error'), error.message || t('addressFetchFailed'));
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const pickImage = async (type: 'profile' | 'visa' | 'certificate') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'] as ('images' | 'videos')[],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'profile') {
        setProfile({ ...profile, profilePhoto: result.assets[0].uri });
      } else if (type === 'visa') {
        setProfile({ 
          ...profile, 
          visaStatus: { ...profile.visaStatus, visaImage: result.assets[0].uri }
        });
      } else if (type === 'certificate') {
        setProfile({ 
          ...profile, 
          visaStatus: { ...profile.visaStatus, certificateImage: result.assets[0].uri }
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    if (!fullName) newErrors.fullName = t('enterFullName');
    if (!profile.email.trim()) newErrors.email = t('enterEmail');
    if (!profile.phoneNumber.trim()) newErrors.phoneNumber = t('enterPhone');
    if (!profile.address.postalCode.trim()) newErrors.postalCode = t('enterPostalCode');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const clearAddress = () => {
    setProfile({
      ...profile,
      address: {
        ...profile.address,
        prefecture: '',
        city1: '',
        city2: '',
        streetAddress: '',
      }
    });
    setFetchedAddress('');
  };

  const handleGenerateAndDownloadPDF = async () => {
    console.log('PDF generation button pressed');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      Alert.alert(t('error'), t('requiredFields'));
      return;
    }

    console.log('Form validation passed, starting PDF generation...');
    setIsGeneratingPDF(true);
    
    try {
      console.log('Calling generateProfilePDF...');
      // Generate PDF
      const pdfUri = await generateProfilePDF(profile);
      console.log('PDF generated successfully, URI:', pdfUri);
      
      console.log('Calling savePDFToDownloads...');
      // Save PDF to Downloads folder
      const saveResult = await savePDFToDownloads(pdfUri, `${profile.firstName}_${profile.lastName}`);
      console.log('PDF saved successfully:', saveResult);
      
      // Show success message
      Alert.alert(t('success'), saveResult.message, [
        {
          text: t('share'),
          onPress: async () => {
            try {
              await sharePDF(pdfUri);
            } catch (error: any) {
              console.error('PDF sharing error:', error);
            }
          }
        },
        {
          text: t('close'),
          style: 'default'
        }
      ]);
      
    } catch (error: any) {
      console.error('PDF generation/download error:', error);
      Alert.alert(t('error'), error.message || t('pdfGenerationFailed'));
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon?: any,
    error?: string,
    readonly?: boolean
  ) => {
    const styles = getStyles({});
    return (
      <View style={styles.inputRow}>
        <View style={styles.iconContainer}>
          {icon && <SmartImage source={icon} style={styles.smallIcon} />}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput, 
              error && styles.inputError,
              readonly && styles.readonlyInput,
              { color: '#000', backgroundColor: '#fff' } // Apply colors through style prop
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#666" // Set placeholder color
            editable={!readonly}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    );
  };

  const renderPicker = (
    label: string,
    value: string,
    onValueChange: (value: string) => void,
    items: readonly ({ key: string; label: string } | string)[],
    placeholder: string,
    icon?: any
  ) => {
    const styles = getStyles({});
    return (
      <View style={styles.inputRow}>
        <View style={styles.iconContainer}>
          {icon && <SmartImage source={icon} style={styles.smallIcon} />}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              onValueChange={onValueChange}
              style={[styles.picker, { color: '#000' }]} // Apply text color through style
              dropdownIconColor="#000" // Set dropdown icon color
            >
              <Picker.Item 
                label={placeholder} 
                value="" 
                style={{ color: '#666' }} // Apply placeholder color through style
              />
              {items.map((item, index) => {
                const label = typeof item === 'string'
                  ? t(optionValueTranslationKey[item] || item)
                  : t(optionValueTranslationKey[item.label] || item.label);
                const itemValue = typeof item === 'string' ? item : item.key;
                
                return (
                  <Picker.Item
                    key={index}
                    label={label}
                    value={itemValue}
                    style={{ color: '#000' }} // Apply item text color through style
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </View>
    );
  };

  const renderGenderSelection = () => {
    const styles = getStyles({});
    return (
      <View style={styles.inputRow}>
        <View style={styles.iconContainer}>
          <SmartImage source={iconMap.gender} style={styles.smallIcon} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.genderOptionsContainer}>
            {[
              { key: 'male' as const, icon: iconMap.men },
              { key: 'female' as const, icon: iconMap.women },
            ].map((item) => {
              const active = profile.gender === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.genderOption, active && styles.genderOptionActive]}
                  onPress={() => setProfile({ ...profile, gender: item.key })}
                >
                  {active ? (
                    <SmartImage source={iconMap.done} style={styles.genderIndicatorIcon} />
                  ) : (
                    <View style={styles.genderIndicator} />
                  )}
                  <SmartImage source={item.icon} style={styles.genderIcon} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderWorkDays = () => {
    const styles = getStyles({});
    return (
      <View style={styles.inputRow}>
        <View style={styles.iconContainer}>
          <SmartImage source={iconMap.calendar} style={styles.smallIcon} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.workDaysContainer}>
            {WORK_DAYS.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[
                  styles.workDayButton,
                  profile.preferredWorkDays.includes(day.key) && styles.workDayButtonActive
                ]}
                onPress={() => {
                  const newWorkDays = profile.preferredWorkDays.includes(day.key)
                    ? profile.preferredWorkDays.filter(d => d !== day.key)
                    : [...profile.preferredWorkDays, day.key];
                  setProfile({ ...profile, preferredWorkDays: newWorkDays });
                }}
              >
                <Text style={[
                  styles.workDayButtonText,
                  profile.preferredWorkDays.includes(day.key) && styles.workDayButtonTextActive
                ]}>
                  {day.label.slice(0, 1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={getStyles({}).container}>
      <View style={getStyles({}).content}>
        {/* removed menu button and popup menu */}
        {/* 氏名と写真 */}
        <View style={getStyles({}).inputRow}>
          <View style={getStyles({}).iconContainer}>
            <SmartImage source={iconMap.id_card} style={getStyles({}).smallIcon} />
          </View>
          <View style={getStyles({}).inputContainer}>
            <View style={getStyles({}).nameRow}>
              <TextInput
                style={[
                  getStyles({}).textInput, 
                  getStyles({}).nameInput, 
                  errors.fullName && getStyles({}).inputError,
                  { color: '#000', backgroundColor: '#fff' }
                ]}
                value={`${profile.firstName} ${profile.lastName}`.trim()}
                onChangeText={(text) => {
                  const names = text.split(' ');
                  setProfile({
                    ...profile,
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || ''
                  });
                  if (text.trim()) clearError('fullName');
                }}
                placeholderTextColor="#666"
              />
              <TouchableOpacity 
                style={getStyles({}).imageIconButton}
                onPress={() => pickImage('profile')}
              >
                <SmartImage source={iconMap.person} style={getStyles({}).imageIcon} />
              </TouchableOpacity>
            </View>
            {errors.fullName && (
              <Text style={getStyles({}).errorText}>{errors.fullName}</Text>
            )}
            {profile.profilePhoto && (
              <Image source={{ uri: profile.profilePhoto }} style={getStyles({}).previewImage} />
            )}
          </View>
        </View>
        
        {renderPicker(
          '',
          profile.age.toString(),
          (value) => setProfile({ ...profile, age: parseInt(value) || 0 }),
          Array.from({ length: 100 }, (_, i) => ({ key: (i + 1).toString(), label: (i + 1).toString() })),
          t('selectAge'),
          iconMap.cake
        )}

        {renderPicker(
          '',
          profile.nationality,
          (value) => setProfile({ ...profile, nationality: value }),
          NATIONALITIES.map(n => ({ key: n, label: n })),
          t('selectNationality'),
          iconMap.globus
        )}
        
        {renderGenderSelection()}
        {renderInput(
          '',
          profile.homeStation.stationName,
          (value) => setProfile({ 
            ...profile, 
            homeStation: { ...profile.homeStation, stationName: value }
          }),
          t('homeStation'),
          iconMap.home_train
        )}
        
        {renderPicker(
          '',
          profile.homeStation.walkingMinutes.toString(),
          (value) => setProfile({ 
            ...profile, 
            homeStation: { ...profile.homeStation, walkingMinutes: parseInt(value) || 0 }
          }),
          Array.from({ length: 30 }, (_, i) => ({ key: (i + 1).toString(), label: t('minute', { minute: i + 1 }) })),
          t('selectWalkingMinutes'),
          iconMap.step
        )}

        {renderInput(
          '',
          profile.schoolStation.stationName,
          (value) => setProfile({ 
            ...profile, 
            schoolStation: { ...profile.schoolStation, stationName: value }
          }),
          t('schoolStation'),
          iconMap.school_train
        )}
        
        {renderPicker(
          '',
          profile.schoolStation.walkingMinutes.toString(),
          (value) => setProfile({ 
            ...profile, 
            schoolStation: { ...profile.schoolStation, walkingMinutes: parseInt(value) || 0 }
          }),
          Array.from({ length: 30 }, (_, i) => ({ key: (i + 1).toString(), label: t('minute', { minute: i + 1 }) })),
          t('selectWalkingMinutes'),
          iconMap.step
        )}
        {renderInput(
          '',
          profile.address.postalCode,
          (value) => {
            setProfile({ 
              ...profile, 
              address: { ...profile.address, postalCode: value }
            });
            if (value.trim()) clearError('postalCode');
          },
          t('postalCodeExample'),
          iconMap.map,
          errors.postalCode
        )}
        
        <View style={getStyles({}).autoFillContainer}>
          <TouchableOpacity 
            style={[getStyles({}).autoFillButton, isLoadingAddress && getStyles({}).autoFillButtonDisabled]}
            onPress={autoFillAddress}
            disabled={isLoadingAddress}
          >
            {isLoadingAddress ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={getStyles({}).autoFillButtonText}>{t('autoFillAddress')}</Text>
            )}
          </TouchableOpacity>
          <Text style={getStyles({}).autoFillHint}>{t('autoFillHint')}</Text>
          
          {fetchedAddress && (
            <View style={getStyles({}).fetchedAddressContainer}>
              <View style={getStyles({}).fetchedAddressHeader}>
                <Text style={getStyles({}).fetchedAddressLabel}>{t('fetchedAddress')}</Text>
                <TouchableOpacity onPress={clearAddress} style={getStyles({}).clearButton}>
                  <Text style={getStyles({}).clearButtonText}>{t('clear')}</Text>
                </TouchableOpacity>
              </View>
              <Text style={getStyles({}).fetchedAddressText}>{fetchedAddress}</Text>
            </View>
          )}
        </View>

        {renderPicker(
          '',
          profile.address.prefecture,
          (value) => setProfile({ 
            ...profile, 
            address: { ...profile.address, prefecture: value }
          }),
          JAPANESE_PREFECTURES.map(p => ({ key: p, label: p })),
          fetchedAddress ? t('selectPrefectureAuto') : t('selectPrefecture'),
          iconMap.map
        )}

        {renderInput(
          '',
          profile.address.city1,
          (value) => setProfile({ 
            ...profile, 
            address: { ...profile.address, city1: value }
          }),
          fetchedAddress ? t('selectCity1Auto') : t('selectCity1'),
          iconMap.map,
          undefined,
          !!fetchedAddress
        )}

        {renderInput(
          '',
          profile.address.city2,
          (value) => setProfile({ 
            ...profile, 
            address: { ...profile.address, city2: value }
          }),
          fetchedAddress ? t('selectCity2Auto') : t('selectCity2'),
          iconMap.map,
          undefined,
          !!fetchedAddress
        )}

        {renderInput(
          '',
          profile.address.streetAddress,
          (value) => setProfile({ 
            ...profile, 
            address: { ...profile.address, streetAddress: value }
          }),
          t('streetAddress'),
          iconMap.home
        )}
        {renderInput(
          '',
          profile.email,
          (value) => {
            setProfile({ ...profile, email: value });
            if (value.trim()) clearError('email');
          },
          t('email'),
          iconMap.email,
          errors.email
        )}

        {renderInput(
          '',
          profile.phoneNumber,
          (value) => {
            setProfile({ ...profile, phoneNumber: value });
            if (value.trim()) clearError('phoneNumber');
          },
          t('phone'),
          iconMap.phone,
          errors.phoneNumber
        )}
        {renderPicker(
          '',
          profile.visaStatus.currentVisaType,
          (value) => setProfile({ 
            ...profile, 
            visaStatus: { ...profile.visaStatus, currentVisaType: value }
          }),
          VISA_TYPES.map(v => ({ key: v, label: v })),
          t('selectVisaType'),
          iconMap.id_card
        )}

        {/* ビザ写真 */}
        <View style={getStyles({}).inputRow}>
          <View style={getStyles({}).iconContainer}>
            <SmartImage source={iconMap.id_card} style={getStyles({}).smallIcon} />
          </View>
          <View style={getStyles({}).inputContainer}>
            <TouchableOpacity 
              style={getStyles({}).imageButton}
              onPress={() => pickImage('visa')}
            >
              <Text style={getStyles({}).imageButtonText}>
                {profile.visaStatus.visaImage ? t('changePhoto') : t('selectVisaPhoto')}
              </Text>
            </TouchableOpacity>
            {profile.visaStatus.visaImage && (
              <Image source={{ uri: profile.visaStatus.visaImage }} style={getStyles({}).previewImage} />
            )}
          </View>
        </View>

        {renderPicker(
          '',
          profile.japaneseLevel,
          (value) => setProfile({ ...profile, japaneseLevel: value as any }),
          JAPANESE_LEVELS.map(l => ({ key: l, label: l })),
          t('selectJapaneseLevel'),
          iconMap.language
        )}

        {renderWorkDays()}

        {renderPicker(
          '',
          profile.currentOccupation,
          (value) => setProfile({ ...profile, currentOccupation: value as any }),
          OCCUPATIONS,
          t('selectOccupation'),
          iconMap.id_card
        )}

        {renderInput(
          '',
          profile.desiredJobType,
          (value) => setProfile({ ...profile, desiredJobType: value }),
          t('desiredJobType'),
          iconMap.id_card
        )}

        <View style={getStyles({}).bottomButtons}>
          <TouchableOpacity 
            style={[getStyles({}).confirmButton, isGeneratingPDF && getStyles({}).confirmButtonDisabled]}
            onPress={handleGenerateAndDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={getStyles({}).confirmButtonText}>{t('confirmAndDownload')}</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={getStyles({}).saveButton} 
            onPress={() => {
              if (validateForm()) {
                Alert.alert(t('success'), t('profileSaved'));
                router.back();
              }
            }}
          >
            <Text style={getStyles({}).saveButtonText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Add these theme-aware styles
const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  smallIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 55,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000', // Text color
  },
  input: {
    flex: 1,
    height: 55,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#000',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  readonlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 2,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 55,
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
    height: 55, // Match container height
    color: '#000', // Text color for the selected value
  },
  autoFillContainer: {
    marginBottom: 15,
  },
  autoFillButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  autoFillButtonDisabled: {
    backgroundColor: '#ccc',
  },
  autoFillButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  autoFillHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  fetchedAddressContainer: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  fetchedAddressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  fetchedAddressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  fetchedAddressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  genderButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#333',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  genderOptionsContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  genderOptionActive: {
    borderColor: '#007AFF',
  },
  genderIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  genderIndicatorIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#007AFF',
  },
  genderIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  workDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  workDayButton: {
    width: 33,
    height: 33,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workDayButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  workDayButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  workDayButtonTextActive: {
    color: '#fff',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    minHeight: 55,
    marginRight: 10,
  },
  imageIconButton: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
});