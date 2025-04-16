export const GOAL_TYPES = [
  { key: 'lose fat', label: 'Lose fat' },
  { key: 'maintain weight', label: 'Maintain weight' },
  { key: 'build muscle', label: 'Build muscle' },
] as const;

export type GoalType = (typeof GOAL_TYPES)[number]['key'];
export const SEX = [
  { key: 'male', label: 'Male', icon: '👩' },
  { key: 'female', label: 'Female', icon: '👨' },
] as const;

export type Sex = (typeof SEX)[number]['key'];

export const BODY_FAT = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
] as const;

export type BodyFat = (typeof BODY_FAT)[number]['key'];

export const ACTIVITY_LEVEL = [
  { key: 'sedentary', label: 'Desk job, light exercise', icon: '🪑🏢' },
  {
    key: 'light',
    label: 'Lightly active, workout 3-4 times/week',
    icon: '🚶‍♂️🏋️',
  },
  { key: 'moderate', label: 'Active daily, frequent exercise', icon: '🏃‍♂️💪' },
  { key: 'active', label: 'Very Athletic', icon: '🏋️‍♂️🚴‍♂️' },
  { key: 'very_active', label: 'Extremely Athletic', icon: '🏆🔥' },
];

export type ActivityLevel = (typeof ACTIVITY_LEVEL)[number]['key'];
