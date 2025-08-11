import { ProfileData, ProfileValidationErrors } from '@/types/profile';

export interface MissingField {
  section: string;
  field: string;
  label: string;
}

export const validateProfileForJobApplication = (profile: ProfileData): MissingField[] => {
  const missingFields: MissingField[] = [];

  // 基本情報の検証
  if (!profile.firstName.trim()) {
    missingFields.push({ section: '基本情報', field: 'firstName', label: '姓' });
  }
  if (!profile.lastName.trim()) {
    missingFields.push({ section: '基本情報', field: 'lastName', label: '名' });
  }
  if (profile.age < 16 || profile.age > 100) {
    missingFields.push({ section: '基本情報', field: 'age', label: '年齢' });
  }
  if (!profile.nationality) {
    missingFields.push({ section: '基本情報', field: 'nationality', label: '国籍' });
  }
  if (!profile.gender) {
    missingFields.push({ section: '基本情報', field: 'gender', label: '性別' });
  }

  // 最寄り駅情報の検証
  if (!profile.homeStation.stationName.trim()) {
    missingFields.push({ section: '最寄り駅情報', field: 'homeStation', label: '自宅最寄り駅' });
  }
  if (profile.homeStation.walkingMinutes <= 0) {
    missingFields.push({ section: '最寄り駅情報', field: 'homeWalkingMinutes', label: '自宅からの徒歩時間' });
  }
  if (!profile.schoolStation.stationName.trim()) {
    missingFields.push({ section: '最寄り駅情報', field: 'schoolStation', label: '学校最寄り駅' });
  }
  if (profile.schoolStation.walkingMinutes <= 0) {
    missingFields.push({ section: '最寄り駅情報', field: 'schoolWalkingMinutes', label: '学校からの徒歩時間' });
  }

  // 住所情報の検証
  if (!/^\d{7}$/.test(profile.address.postalCode)) {
    missingFields.push({ section: '住所情報', field: 'postalCode', label: '郵便番号' });
  }
  if (!profile.address.prefecture) {
    missingFields.push({ section: '住所情報', field: 'prefecture', label: '都道府県' });
  }
  if (!profile.address.city1.trim()) {
    missingFields.push({ section: '住所情報', field: 'city1', label: '市区町村1' });
  }
  if (!profile.address.streetAddress.trim()) {
    missingFields.push({ section: '住所情報', field: 'streetAddress', label: '番地・建物名' });
  }

  // 連絡先の検証
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    missingFields.push({ section: '連絡先', field: 'email', label: 'メールアドレス' });
  }
  if (!/^[\d-+()\s]+$/.test(profile.phoneNumber)) {
    missingFields.push({ section: '連絡先', field: 'phoneNumber', label: '電話番号' });
  }

  // 在留資格の検証
  if (!profile.visaStatus.currentVisaType) {
    missingFields.push({ section: '在留資格', field: 'currentVisaType', label: '現在のビザの種類' });
  }
  if (!profile.visaStatus.visaImage) {
    missingFields.push({ section: '在留資格', field: 'visaImage', label: '在留資格画像' });
  }

  // その他の情報の検証
  if (!profile.japaneseLevel) {
    missingFields.push({ section: 'その他の情報', field: 'japaneseLevel', label: '日本語レベル' });
  }
  if (profile.preferredWorkDays.length === 0) {
    missingFields.push({ section: 'その他の情報', field: 'preferredWorkDays', label: '勤務希望曜日' });
  }
  if (!profile.currentOccupation) {
    missingFields.push({ section: 'その他の情報', field: 'currentOccupation', label: '現在の職業' });
  }
  if (!profile.desiredJobType.trim()) {
    missingFields.push({ section: 'その他の情報', field: 'desiredJobType', label: '希望の職種' });
  }

  return missingFields;
};

export const getSectionKey = (section: string): string => {
  const sectionMap: { [key: string]: string } = {
    '基本情報': 'basic',
    '最寄り駅情報': 'station',
    '住所情報': 'address',
    '連絡先': 'contact',
    '在留資格': 'visa',
    'その他の情報': 'other',
  };
  return sectionMap[section] || 'basic';
};

export const formatMissingFieldsMessage = (missingFields: MissingField[]): string => {
  if (missingFields.length === 0) return '';

  const sections = [...new Set(missingFields.map(field => field.section))];
  const sectionCount = sections.length;
  const fieldCount = missingFields.length;

  let message = `プロフィールの必須項目が未入力です。\n\n`;
  message += `未入力項目: ${fieldCount}項目\n`;
  message += `未入力セクション: ${sectionCount}セクション\n\n`;
  message += `未入力項目の詳細:\n`;

  sections.forEach(section => {
    const sectionFields = missingFields.filter(field => field.section === section);
    message += `\n${section}:\n`;
    sectionFields.forEach(field => {
      message += `• ${field.label}\n`;
    });
  });

  return message;
}; 