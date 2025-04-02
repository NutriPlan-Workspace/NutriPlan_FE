import { FC } from 'react';

import type { NutritionFields } from '@/types/food';

import NutritionRow from './nutritionRow';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
}

const NutritionDetailedTable: FC<NutritionDetailedTableProps> = ({
  nutrition,
}) => {
  const aminoAcidNutrition = [
    { title: 'Alanine', amount: nutrition.alanine, unit: 'g' },
    { title: 'Arginine', amount: nutrition.arginine, unit: 'g' },
    { title: 'Aspartic acid', amount: nutrition.asparticAcid, unit: 'g' },
    { title: 'Cystine', amount: nutrition.cystine, unit: 'g' },
    { title: 'Glutamic acid', amount: nutrition.glutamicAcid, unit: 'g' },
    { title: 'Glycine', amount: nutrition.glycine, unit: 'g' },
    { title: 'Histidine', amount: nutrition.histidine, unit: 'g' },
    { title: 'Hydroxyproline', amount: nutrition.hydroxyproline, unit: 'mg' },
    { title: 'Isoleucine', amount: nutrition.isoleucine, unit: 'g' },
    { title: 'Leucine', amount: nutrition.leucine, unit: 'g' },
    { title: 'Lysine', amount: nutrition.lysine, unit: 'g' },
    { title: 'Methionine', amount: nutrition.methionine, unit: 'g' },
    { title: 'Phenylalanine', amount: nutrition.phenylalanine, unit: 'g' },
    { title: 'Proline', amount: nutrition.proline, unit: 'g' },
    { title: 'Serine', amount: nutrition.serine, unit: 'g' },
    { title: 'Threonine', amount: nutrition.threonine, unit: 'g' },
    { title: 'Tryptophan', amount: nutrition.tryptophan, unit: 'g' },
    { title: 'Tyrosine', amount: nutrition.tyrosine, unit: 'g' },
    { title: 'Valine', amount: nutrition.valine, unit: 'g' },
  ];

  const fatsNutrition = [
    { title: 'Saturated fats', amount: nutrition.saturatedFats, unit: 'g' },
    {
      title: 'Monounsaturated fats',
      amount: nutrition.monounsaturatedFats,
      unit: 'g',
    },
    {
      title: 'Polyunsaturated fats',
      amount: nutrition.polyunsaturatedFats,
      unit: 'g',
    },
    { title: 'Trans fats', amount: nutrition.transFats, unit: 'g' },
  ];

  const fattyAcidsNutrition = [
    { title: 'Total omega 3', amount: nutrition.totalOmega3, unit: 'g' },
    { title: 'Total omega 6', amount: nutrition.totalOmega6, unit: 'g' },
    {
      title: 'Alpha Linolenic Acid (ALA)',
      amount: nutrition.alaFattyAcid,
      unit: 'g',
    },
    {
      title: 'Docosahexaenoic Acid (DHA)',
      amount: nutrition.dhaFattyAcid,
      unit: 'g',
    },
    {
      title: 'Eicosapentaenoic Acid (EPA)',
      amount: nutrition.epaFattyAcid,
      unit: 'g',
    },
    {
      title: 'Docosapentaenoic Acid (DPA)',
      amount: nutrition.dpaFattyAcid,
      unit: 'g',
    },
  ];

  const generalNutrition = [
    { title: 'Calories', amount: nutrition.calories, unit: '' },
    { title: 'Carbs', amount: nutrition.carbs, unit: 'g' },
    { title: 'Fat', amount: nutrition.fats, unit: 'g' },
    { title: 'Protein', amount: nutrition.proteins, unit: 'g' },
    { title: 'Net Carbs', amount: nutrition.netCarbs, unit: 'g' },
    { title: 'Fiber', amount: nutrition.fiber, unit: 'g' },
    { title: 'Sodium', amount: nutrition.sodium, unit: 'mg' },
    { title: 'Cholesterol', amount: nutrition.cholesterol, unit: 'mg' },
    { title: 'Calcium', amount: nutrition.calcium, unit: 'mg' },
    { title: 'Iron', amount: nutrition.iron, unit: 'mg' },
    { title: 'Potassium', amount: nutrition.potassium, unit: 'mg' },
    { title: 'Vitamin D', amount: nutrition.vitD, unit: 'μg' },
  ];

  const sugarsNutrition = [
    { title: 'Sugar', amount: nutrition.sugar, unit: 'g' },
    { title: 'Sucrose', amount: nutrition.sucrose, unit: 'g' },
    { title: 'Glucose', amount: nutrition.glucose, unit: 'g' },
    { title: 'Fructose', amount: nutrition.fructose, unit: 'g' },
    { title: 'Lactose', amount: nutrition.lactose, unit: 'g' },
    { title: 'Maltose', amount: nutrition.maltose, unit: 'g' },
    { title: 'Galactose', amount: nutrition.galactose, unit: 'g' },
    { title: 'Starch', amount: nutrition.starch, unit: 'g' },
  ];

  const vitaminNutrition = [
    { title: 'Alpha carotene', amount: nutrition.alphaCarotene, unit: 'μg' },
    { title: 'Beta carotene', amount: nutrition.betaCarotene, unit: 'μg' },
    { title: 'Caffeine', amount: nutrition.caffeine, unit: 'mg' },
    { title: 'Choline', amount: nutrition.choline, unit: 'mg' },
    { title: 'Copper', amount: nutrition.copper, unit: 'mg' },
    { title: 'Fluoride', amount: nutrition.fluoride, unit: 'μg' },
    { title: 'Folate (B9)', amount: nutrition.folate, unit: 'μg' },
    { title: 'Lycopene', amount: nutrition.lycopene, unit: 'μg' },
    { title: 'Magnesium', amount: nutrition.magnesium, unit: 'mg' },
    { title: 'Manganese', amount: nutrition.manganese, unit: 'mg' },
    { title: 'Niacin', amount: nutrition.niacin, unit: 'mg' },
    {
      title: 'Pantothenic acid',
      amount: nutrition.pantothenicAcid,
      unit: 'mg',
    },
    { title: 'Phosphorus', amount: nutrition.phosphorus, unit: 'mg' },
    { title: 'Retinol', amount: nutrition.retinol, unit: 'μg' },
    { title: 'Riboflavin (B2)', amount: nutrition.riboflavin, unit: 'mg' },
    { title: 'Selenium', amount: nutrition.selenium, unit: 'μg' },
    { title: 'Theobromine', amount: nutrition.theobromine, unit: 'mg' },
    { title: 'Thiamine', amount: nutrition.thiamine, unit: 'mg' },
    { title: 'Vitamin A IU', amount: nutrition.vitAIu, unit: 'IU' },
    { title: 'Vitamin A', amount: nutrition.vitA, unit: 'μg' },
    { title: 'Vitamin B12', amount: nutrition.vitB12, unit: 'μg' },
    { title: 'Vitamin B6', amount: nutrition.vitB6, unit: 'mg' },
    { title: 'Vitamin C', amount: nutrition.vitC, unit: 'mg' },
    { title: 'Vitamin D IU', amount: nutrition.vitDIu, unit: 'IU' },
    { title: 'Vitamin D2', amount: nutrition.vitD2, unit: 'μg' },
    { title: 'Vitamin D3', amount: nutrition.vitD3, unit: 'μg' },
    { title: 'Vitamin E', amount: nutrition.vitE, unit: 'mg' },
    { title: 'Vitamin K', amount: nutrition.vitK, unit: 'μg' },
    { title: 'Zinc', amount: nutrition.zinc, unit: 'mg' },
  ];

  return (
    <>
      <thead>
        <tr>
          <th className='py-2 text-left'>Nutrient</th>
          <th className='py-2 text-right'>Amount</th>
          <th className='py-2 text-right'>Target</th>
        </tr>
      </thead>
      <NutritionRow detailedNutrition={generalNutrition} />
      <thead>
        <tr>
          <th className='py-2 text-left'>Vitamins and Minerals</th>
          <th className='py-2 text-right'></th>
          <th className='py-2 text-right'>Daily Value</th>
        </tr>
      </thead>
      <NutritionRow detailedNutrition={vitaminNutrition} />
      <thead>
        <tr>
          <th className='py-2 text-left'>Sugars</th>
          <th className='py-2 text-right'></th>
          <th className='py-2 text-right'></th>
        </tr>
      </thead>
      <NutritionRow detailedNutrition={sugarsNutrition} />
      <thead>
        <tr>
          <th className='py-2 text-left'>Fats</th>
          <th className='py-2 text-right'></th>
          <th className='py-2 text-right'></th>
        </tr>
      </thead>
      <NutritionRow detailedNutrition={fatsNutrition} />
      <thead>
        <tr>
          <th className='py-2 text-left'>Fatty Acids</th>
          <th className='py-2 text-right'></th>
          <th className='py-2 text-right'></th>
        </tr>
      </thead>
      <NutritionRow detailedNutrition={fattyAcidsNutrition} />
      <thead>
        <tr>
          <th className='py-2 text-left'>Amino Acids</th>
          <th className='py-2 text-right'></th>
          <th className='py-2 text-right'></th>
        </tr>
      </thead>
      <NutritionRow detailedNutrition={aminoAcidNutrition} />
    </>
  );
};

export default NutritionDetailedTable;
