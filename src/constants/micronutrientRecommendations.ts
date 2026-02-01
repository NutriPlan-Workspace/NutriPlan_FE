/**
 * Micronutrient Recommendations based on Dietary Reference Intakes (DRI)
 * Sources: USDA, WHO, FDA Daily Values
 */

export interface MicronutrientRecommendation {
  name: string;
  unit: string;
  recommended: number;
  min: number;
  max: number;
  description: string;
  warningThreshold?: { low?: number; high?: number };
}

// Daily recommended values for adults
export const MICRONUTRIENT_RECOMMENDATIONS = {
  fiber: {
    name: 'Fiber',
    unit: 'g',
    recommended: 28, // FDA Daily Value
    min: 0,
    max: 50, // Excessive fiber can cause digestive issues
    description: 'Recommended: 25-38g/day (25g for women, 38g for men)',
    warningThreshold: { low: 15, high: 50 },
  },
  sodium: {
    name: 'Sodium',
    unit: 'mg',
    recommended: 2300, // FDA upper limit
    min: 500, // Minimum for normal body function
    max: 4000, // Very high but some may need it
    description: 'Recommended: ≤2300mg/day (ideal: 1500-2000mg)',
    warningThreshold: { low: 1000, high: 3500 },
  },
  cholesterol: {
    name: 'Cholesterol',
    unit: 'mg',
    recommended: 300, // General guideline
    min: 100,
    max: 500,
    description: 'Recommended: ≤300mg/day (heart conditions: ≤200mg)',
    warningThreshold: { low: 100, high: 400 },
  },
  // Additional micronutrients for future expansion
  calcium: {
    name: 'Calcium',
    unit: 'mg',
    recommended: 1000,
    min: 500,
    max: 2500,
    description: 'Recommended: 1000-1300mg/day',
    warningThreshold: { low: 500, high: 2000 },
  },
  iron: {
    name: 'Iron',
    unit: 'mg',
    recommended: 18, // FDA Daily Value
    min: 5,
    max: 45,
    description: 'Recommended: 8-18mg/day (higher for women)',
    warningThreshold: { low: 8, high: 40 },
  },
  potassium: {
    name: 'Potassium',
    unit: 'mg',
    recommended: 4700,
    min: 1000,
    max: 6000,
    description: 'Recommended: 2600-3400mg/day',
    warningThreshold: { low: 2000, high: 5000 },
  },
  vitaminC: {
    name: 'Vitamin C',
    unit: 'mg',
    recommended: 90,
    min: 30,
    max: 2000,
    description: 'Recommended: 75-90mg/day',
    warningThreshold: { low: 60, high: 1000 },
  },
  vitaminD: {
    name: 'Vitamin D',
    unit: 'mcg',
    recommended: 20,
    min: 5,
    max: 100,
    description: 'Recommended: 15-20mcg/day',
    warningThreshold: { low: 10, high: 50 },
  },
} as const;

// Helper to get recommendation for a specific micronutrient
export const getMicronutrientRecommendation = (
  key: keyof typeof MICRONUTRIENT_RECOMMENDATIONS,
): MicronutrientRecommendation => MICRONUTRIENT_RECOMMENDATIONS[key];

// Preset values for quick-fill
export const MICRONUTRIENT_PRESETS = {
  standard: {
    label: 'Standard (Balanced)',
    fiber: 28,
    sodium: 2300,
    cholesterol: 300,
  },
  heartHealthy: {
    label: 'Heart Healthy',
    fiber: 35,
    sodium: 1500,
    cholesterol: 200,
  },
  lowSodium: {
    label: 'Low Sodium',
    fiber: 28,
    sodium: 1500,
    cholesterol: 300,
  },
  highFiber: {
    label: 'High Fiber',
    fiber: 38,
    sodium: 2300,
    cholesterol: 300,
  },
} as const;

export type MicronutrientPresetKey = keyof typeof MICRONUTRIENT_PRESETS;
