export interface JobData {
  id: string;
  title: string;
  jobType: JobType;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  japaneseLevel: JapaneseLevel;
  commuteTime: {
    home: number; // minutes
    school: number; // minutes
  };
  workDays: WorkDay[];
  appealPoints: string[];
  company: {
    name: string;
    location: string;
    phone?: string;
  };
  postedDate: Date;
  description: string;
  requirements: string[];
  benefits: string[];
}

export type JobType = 
  | 'cooking' 
  | 'service' 
  | 'cleaning' 
  | 'factory' 
  | 'delivery' 
  | 'hotel' 
  | 'warehouse'
  | 'office'
  | 'retail'
  | 'other';

export type JapaneseLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

export const JAPANESE_LEVELS: JapaneseLevel[] = ['N1', 'N2', 'N3', 'N4', 'N5'];

export type WorkDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface JobFilter {
  jobTypes: JobType[];
  japaneseLevel: JapaneseLevel[];
  salaryRange: {
    min: number;
    max: number;
  };
  commuteConvenience: string[];
  workImportance: string[];
}

export interface JobSort {
  type: 'salary' | 'commuteHome' | 'commuteSchool' | 'postedDate';
  direction: 'asc' | 'desc';
}

export interface JobListState {
  chooseList: JobData[];
  refusalList: JobData[];
  currentJobs: JobData[];
  filter: JobFilter;
  sort: JobSort;
  selectedJobs: string[]; // job IDs for bulk application
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  cooking: '調理',
  service: '接客',
  cleaning: '清掃',
  factory: '工場',
  delivery: '宅配',
  hotel: 'ホテル',
  warehouse: '倉庫',
  office: '事務',
  retail: '販売',
  other: 'その他',
};

export const JOB_TYPE_ICONS: Record<JobType, string> = {
  cooking: '🍳',
  service: '👥',
  cleaning: '🧹',
  factory: '🏭',
  delivery: '🚚',
  hotel: '🏨',
  warehouse: '📦',
  office: '💼',
  retail: '🛍️',
  other: '💼',
};

export const WORK_DAY_LABELS: Record<WorkDay, string> = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
};

export const COMMUTE_CONVENIENCE_OPTIONS = [
  '駅から徒歩5分以内',
  '駅から徒歩10分以内',
  'バス停から徒歩3分以内',
  '自転車で通勤可能',
  '車で通勤可能',
  '夜間でも安全',
  '24時間営業',
];

export const WORK_IMPORTANCE_OPTIONS = [
  '給与が高い',
  'シフト調整可能',
  'まかないあり',
  '交通費支給',
  '社会保険完備',
  '研修制度あり',
  '昇給制度あり',
  '長期勤務歓迎',
  '短期勤務歓迎',
  '未経験歓迎',
  '日本語練習可能',
  '国際的な環境',
]; 