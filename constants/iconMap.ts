// Centralized icon map for all image assets
export const iconMap = {
  // Basic icons (SVG)
  calendar: require('../assets/images/icons/SVG/calendar.svg'),
  clock: require('../assets/images/icons/SVG/clock.svg'),
  close: require('../assets/images/icons/SVG/close.svg'),
  done: require('../assets/images/icons/SVG/done.svg'),
  filter: require('../assets/images/icons/SVG/filter.svg'),
  heart: require('../assets/images/icons/SVG/heart_1.svg'),
  heartFilled: require('../assets/images/icons/SVG/heart_2.svg'),
  star: require('../assets/images/icons/SVG/star.svg'),
  trash: require('../assets/images/icons/SVG/trash_1.svg'),
  trashFilled: require('../assets/images/icons/SVG/trash_2.svg'),

  // Job related icons (SVG)
  company: require('../assets/images/icons/SVG/company.svg'),
  coin: require('../assets/images/icons/SVG/coin.svg'),
  train: require('../assets/images/icons/SVG/train.svg'),
  trainCoin: require('../assets/images/icons/SVG/train_coin.svg'),
  todo: require('../assets/images/icons/SVG/todo.svg'),

  // Navigation and UI icons (SVG)
  sort: require('../assets/images/icons/SVG/sort.svg'),
  sortCheck: require('../assets/images/icons/SVG/sort_check.svg'),
  sortCheckUp: require('../assets/images/icons/SVG/sort_check_up.svg'),
  sortCheckDown: require('../assets/images/icons/SVG/sort_check_down.svg'),
  step: require('../assets/images/icons/SVG/step.svg'),
  steps: require('../assets/images/icons/SVG/steps.svg'),

  // Aliases to keep backward compatibility with snake_case keys used in components
  sort_check: require('../assets/images/icons/SVG/sort_check.svg'),
  sort_check_up: require('../assets/images/icons/SVG/sort_check_up.svg'),
  sort_check_down: require('../assets/images/icons/SVG/sort_check_down.svg'),
  train_coin: require('../assets/images/icons/SVG/train_coin.svg'),
  school_steps: require('../assets/images/icons/SVG/school_steps.svg'),

  // Feature specific icons (SVG)
  chine: require('../assets/images/icons/SVG/chine.svg'),
  choose: require('../assets/images/icons/SVG/choose.svg'),
  deadline: require('../assets/images/icons/SVG/deadline.svg'),
  language: require('../assets/images/icons/SVG/language.svg'),
  policeman: require('../assets/images/icons/SVG/policeman.svg'),
  refusal: require('../assets/images/icons/SVG/refusal.svg'),
  schoolSteps: require('../assets/images/icons/SVG/school_steps.svg'),

  // Profile related icons (kept compatible)
  person: require('../assets/images/icons/SVG/human.svg'), // Using step icon as person
  id_card: require('../assets/images/icons/SVG/id_card.svg'), // Using star icon as flag
  map: require('../assets/images/icons/SVG/map.svg'), // Using company icon as location
  email: require('../assets/images/icons/SVG/mail.svg'), // Using todo icon as email
  phone: require('../assets/images/icons/SVG/phone.svg'), // Using clock icon as phone
  cake: require('../assets/images/icons/SVG/cake.svg'), // Using company icon as work
  globus: require('../assets/images/icons/SVG/globus.svg'), // Using company icon as work
  gender: require('../assets/images/icons/SVG/gender.svg'), // Using company icon as work
  women: require('../assets/images/icons/SVG/women.svg'), // Using company icon as work
  men: require('../assets/images/icons/SVG/men.svg'), // Using company icon as work
  home_train: require('../assets/images/icons/SVG/home_train.svg'), // Using company icon as work
  school_train: require('../assets/images/icons/SVG/school_train.svg'), // Using company icon as work
  pochta_index: require('../assets/images/icons/SVG/pochta_index.svg'), // Using company icon as work
  home: require('../assets/images/icons/SVG/home.svg'), // Using company icon as work
  


  // Legacy explicit SVG keys (kept for gradual migration)
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