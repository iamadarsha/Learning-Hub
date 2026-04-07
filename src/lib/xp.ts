export const XP_VALUES = {
  VIEW_RESOURCE: 5,
  COMPLETE_RESOURCE: 10,
  SUBMIT_RESOURCE: 25,
  FIRST_SUBMIT_BONUS: 50,
  DAILY_STREAK: 15,
} as const;

export const LEVELS = [
  { level: 1, minXP: 0, label: "Learner", color: "#009BFF" },
  { level: 2, minXP: 100, label: "Explorer", color: "#4CC3AE" },
  { level: 3, minXP: 300, label: "Builder", color: "#770BFF" },
  { level: 4, minXP: 600, label: "Expert", color: "#FFA500" },
  { level: 5, minXP: 1000, label: "PAIoneer", color: "#FFD700" },
] as const;

export function getLevelFromXP(xp: number) {
  return [...LEVELS].reverse().find((l) => xp >= l.minXP) ?? LEVELS[0];
}
