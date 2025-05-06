import { DIET_LABELS } from '@/constants/dietLabels';
import { PrimaryDiet } from '@/constants/primaryDiet';

export const convertDietLabelToPrimaryDiet = (
  dietLabel: string,
): PrimaryDiet => {
  switch (dietLabel) {
    case DIET_LABELS.ANYTHING:
      return PrimaryDiet.ANYTHING;
    case DIET_LABELS.KETO:
      return PrimaryDiet.KETO;
    case DIET_LABELS.MEDITERRANEAN:
      return PrimaryDiet.MEDITERRANEAN;
    case DIET_LABELS.PALEO:
      return PrimaryDiet.PALEO;
    case DIET_LABELS.VEGAN:
      return PrimaryDiet.VEGAN;
    case DIET_LABELS.VEGETARIAN:
      return PrimaryDiet.VEGETARIAN;
    default:
      return PrimaryDiet.ANYTHING;
  }
};
