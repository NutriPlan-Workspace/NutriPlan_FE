import { FC } from 'react';

import { Food } from '@/types/food';

const RecipeDetail: FC<Food> = ({ ingredients, directions }) => (
  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
    <div>
      <h2 className='text-lg font-semibold'>Ingredients</h2>
      <ul className='list-inside list-disc'>
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.amount} - {ingredient.ingredientFoodId}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h2 className='text-lg font-semibold'>Directions</h2>
      <ul className='list-inside list-disc'>
        {directions.map((direction, index) => (
          <li key={index}>{direction}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default RecipeDetail;
