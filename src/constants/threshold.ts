export const THRESHOLD = {
  // If a value is within EPSILON of an integer, snap to the integer
  EPSILON: 1e-6,
  // Number of decimals to keep when rounding otherwise
  DECIMALS: 3,
};

export function roundWithThreshold(value: number): number {
  if (!isFinite(value)) return value;
  const nearest = Math.round(value);
  if (Math.abs(value - nearest) < THRESHOLD.EPSILON) return nearest;
  // otherwise keep DECIMALS decimal places
  return parseFloat(value.toFixed(THRESHOLD.DECIMALS));
}

export default THRESHOLD;
