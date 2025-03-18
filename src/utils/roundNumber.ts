export function roundNumber(num: number, decimalPlaces: number) {
  return (
    Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
  );
}
