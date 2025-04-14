export const GOAL_TYPES = [
  { key: 'lose fat', label: 'Lose fat' },
  { key: 'maintain weight', label: 'Maintain weight' },
  { key: 'build muscle', label: 'Build muscle' },
] as const;

export type GoalType = (typeof GOAL_TYPES)[number]['key'];
