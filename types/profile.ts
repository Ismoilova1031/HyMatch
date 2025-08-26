export interface ProfileData {
  // 基本情報
  firstName: string;
  lastName: string;
  age: number;
  profilePhoto?: string;
  nationality: string;
  gender: 'male' | 'female' | 'other';
  
  // 最寄り駅情報
  homeStation: {
    stationName: string;
    walkingMinutes: number;
  };
  schoolStation: {
    stationName: string;
    walkingMinutes: number;
  };
  
  // 住所情報
  address: {
    postalCode: string;
    prefecture: string;
    city1: string;
    city2: string;
    streetAddress: string;
  };
  
  // 連絡先
  email: string;
  phoneNumber: string;
  
  // 在留資格
  visaStatus: {
    currentVisaType: string;
    visaImage?: string;
    plannedChange: boolean;
    plannedVisaType?: string;
    certificateImage?: string;
  };
  
  // その他の情報
  japaneseLevel: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
  preferredWorkDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  currentOccupation: 'student' | 'employed' | 'unemployed' | 'other';
  desiredJobType: string;
  workHistory: string;
}

export interface ProfileValidationErrors {
  [key: string]: string[];
}

export const JAPANESE_PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
] as const;

export const NATIONALITIES = [
  '中国', '韓国','ウズベキスタン', 'ベトナム', 'フィリピン', 'ネパール', 'インドネシア',
  'タイ', 'ミャンマー', 'カンボジア', 'ラオス', 'モンゴル', 'スリランカ',
  'バングラデシュ', 'パキスタン', 'インド', 'その他'
] as const;

export const VISA_TYPES = [
  '留学', '就学', '研修', '家族滞在', '特定活動', '短期滞在',
  '永住者', '日本人の配偶者等', '永住者の配偶者等', '定住者',
  '高度専門職', '技術・人文知識・国際業務', '技能', 'その他'
] as const;

export const JAPANESE_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'] as const;

export const WORK_DAYS = [
  { key: 'monday', label: '月曜日' },
  { key: 'tuesday', label: '火曜日' },
  { key: 'wednesday', label: '水曜日' },
  { key: 'thursday', label: '木曜日' },
  { key: 'friday', label: '金曜日' },
  { key: 'saturday', label: '土曜日' },
  { key: 'sunday', label: '日曜日' }
] as const;

export const GENDERS = [
  { key: 'male', label: '男性' },
  { key: 'female', label: '女性' },
  { key: 'other', label: 'その他' }
] as const;

export const OCCUPATIONS = [
  { key: 'student', label: '学生' },
  { key: 'employed', label: '会社員' },
  { key: 'unemployed', label: '無職' },
  { key: 'other', label: 'その他' }
] as const; 