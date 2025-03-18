interface NutritionItem {
  label: string;
  amount: string;
  className: string;
}

export const nutritionData: Record<string, NutritionItem[]> = {
  Anything: [
    { label: 'Carbs', amount: '90g', className: 'bg-yellow-300' },
    { label: 'Protein', amount: '50g', className: 'bg-blue-400' },
    { label: 'Fat', amount: '70g', className: 'bg-purple-400' },
  ],
  Keto: [
    { label: 'Carbs', amount: '30g', className: 'bg-yellow-300' },
    { label: 'Protein', amount: '70g', className: 'bg-blue-400' },
    { label: 'Fat', amount: '100g', className: 'bg-purple-400' },
  ],
  Mediterranean: [
    { label: 'Carbs', amount: '80g', className: 'bg-yellow-300' },
    { label: 'Protein', amount: '60g', className: 'bg-blue-400' },
    { label: 'Fat', amount: '50g', className: 'bg-purple-400' },
  ],
  Paleo: [
    { label: 'Carbs', amount: '50g', className: 'bg-yellow-300' },
    { label: 'Protein', amount: '80g', className: 'bg-blue-400' },
    { label: 'Fat', amount: '60g', className: 'bg-purple-400' },
  ],
  Vegan: [
    { label: 'Carbs', amount: '100g', className: 'bg-yellow-300' },
    { label: 'Protein', amount: '40g', className: 'bg-blue-400' },
    { label: 'Fat', amount: '30g', className: 'bg-purple-400' },
  ],
  Vegetarian: [
    { label: 'Carbs', amount: '90g', className: 'bg-yellow-300' },
    { label: 'Protein', amount: '50g', className: 'bg-blue-400' },
    { label: 'Fat', amount: '40g', className: 'bg-purple-400' },
  ],
};
