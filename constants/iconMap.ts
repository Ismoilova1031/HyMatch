// Centralized icon map for all image assets
export const iconMap = {
  // Basic icons
  calendar: require('../assets/images/icons/calendar.png'),
  clock: require('../assets/images/icons/clock.png'),
  close: require('../assets/images/icons/close.png'),
  done: require('../assets/images/icons/done.png'),
  filter: require('../assets/images/icons/filter.png'),
  heart: require('../assets/images/icons/heart_1.png'),
  heartFilled: require('../assets/images/icons/heart_2.png'),
  star: require('../assets/images/icons/star.png'),
  trash: require('../assets/images/icons/trash_1.png'),
  trashFilled: require('../assets/images/icons/trash_2.png'),
  
  // Job related icons
  company: require('../assets/images/icons/company.png'),
  coin: require('../assets/images/icons/coin.png'),
  train: require('../assets/images/icons/train.png'),
  trainCoin: require('../assets/images/icons/train_coin.png'),
  todo: require('../assets/images/icons/todo.png'),
  
  // Navigation and UI icons
  sort: require('../assets/images/icons/sort.png'),
  sortCheck: require('../assets/images/icons/sort_check.png'),
  sortCheckUp: require('../assets/images/icons/sort_check_up.png'),
  sortCheckDown: require('../assets/images/icons/sort_check_down.png'),
  step: require('../assets/images/icons/step.png'),
  steps: require('../assets/images/icons/steps.png'),
  
  // Feature specific icons
  chine: require('../assets/images/icons/chine.png'),
  choose: require('../assets/images/icons/choose.png'),
  deadline: require('../assets/images/icons/deadline.png'),
  language: require('../assets/images/icons/language.png'),
  policeman: require('../assets/images/icons/policeman.png'),
  refusal: require('../assets/images/icons/refusal.png'),
  schoolSteps: require('../assets/images/icons/school_steps.png'),
  
  // Profile related icons
  person: require('../assets/images/icons/step.png'), // Using step icon as person
  flag: require('../assets/images/icons/star.png'), // Using star icon as flag
  location: require('../assets/images/icons/company.png'), // Using company icon as location
  email: require('../assets/images/icons/todo.png'), // Using todo icon as email
  phone: require('../assets/images/icons/clock.png'), // Using clock icon as phone
  visa: require('../assets/images/icons/policeman.png'), // Using policeman icon as visa
  work: require('../assets/images/icons/company.png'), // Using company icon as work
  
  // SVG icons
  calendarSvg: require('../assets/images/icons/SVG/calendar.svg'),
  chineSvg: require('../assets/images/icons/SVG/chine.svg'),
  clockSvg: require('../assets/images/icons/SVG/clock.svg'),
  coinSvg: require('../assets/images/icons/SVG/coin.svg'),
  companySvg: require('../assets/images/icons/SVG/company.svg'),
  deadlineSvg: require('../assets/images/icons/SVG/deadline.svg'),
  heartSvg: require('../assets/images/icons/SVG/heart.svg'),
  languageSvg: require('../assets/images/icons/SVG/language.svg'),
  policemanSvg: require('../assets/images/icons/SVG/policeman.svg'),
  schoolStepsSvg: require('../assets/images/icons/SVG/school_steps.svg'),
  sortCheckSvg: require('../assets/images/icons/SVG/sort_check.svg'),
  sortSvg: require('../assets/images/icons/SVG/sort.svg'),
  starSvg: require('../assets/images/icons/SVG/star.svg'),
  stepsSvg: require('../assets/images/icons/SVG/steps.svg'),
  todoSvg: require('../assets/images/icons/SVG/todo.svg'),
  trainCoinSvg: require('../assets/images/icons/SVG/train_coin.svg'),
  trainSvg: require('../assets/images/icons/SVG/train.svg'),
  trashSvg: require('../assets/images/icons/SVG/trash.svg'),
} as const;

export type IconKey = keyof typeof iconMap; 