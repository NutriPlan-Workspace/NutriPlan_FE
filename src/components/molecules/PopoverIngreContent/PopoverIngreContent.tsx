import React from 'react';

type PopoverIngreContentProps = {
  calories: number;
  carbs: number;
  fats: number;
  proteins: number;
  fiber: number;
  sodium: number;
  cholesterol?: number;
};

const PopoverIngreContent: React.FC<PopoverIngreContentProps> = ({
  calories,
  carbs,
  fats,
  proteins,
  fiber,
  sodium,
  cholesterol,
}) => (
  <>
    <div className='flex flex-col space-y-1'>
      <div className='flex justify-between'>
        <span>Calories</span>
        <span>{calories}</span>
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
          <span className='h-3 w-3 rounded-full bg-yellow-500'></span>
          <span>Carbs</span>
        </div>
        <span>{carbs}g</span>
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
          <span className='h-3 w-3 rounded-full bg-blue-500'></span>
          <span>Fats</span>
        </div>
        <span>{fats}g</span>
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
          <span className='h-3 w-3 rounded-full bg-purple-500'></span>
          <span>Protein</span>
        </div>
        <span>{proteins}g</span>
      </div>
      <div className='mt-2 flex justify-between'>
        <span>Fiber</span>
        <span>{fiber}g</span>
      </div>
      <div className='flex justify-between'>
        <span>Sodium</span>
        <span>{sodium}mg</span>
      </div>
      <div className='flex justify-between'>
        <span>Cholesterol</span>
        <span>{cholesterol}mg</span>
      </div>
    </div>
  </>
);

export default PopoverIngreContent;
