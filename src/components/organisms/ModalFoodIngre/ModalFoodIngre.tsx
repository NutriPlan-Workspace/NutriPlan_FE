import React from 'react';

import { DetailedFoodResponse, Food } from '@/types/food';

import { DetailedFood } from '../DetailedFood';
import { DetailedIngredient } from '../DetailedIngredient';

type ModalDetailedProps = {
  detailedFood: DetailedFoodResponse;
  setTitleModal: (titleModal: string) => void;
  detailedIngredient: Food | null;
  setDetailedIngredient: (detailedIngredient: Food | null) => void;
};

const ModalFoodIngre: React.FC<ModalDetailedProps> = ({
  detailedFood,
  setTitleModal,
  detailedIngredient,
  setDetailedIngredient,
}) => (
  <>
    {setTitleModal(
      detailedIngredient
        ? detailedIngredient.name
        : detailedFood.data.mainFood.name,
    )}
    {detailedIngredient ? (
      <>
        <DetailedIngredient
          detailedIngredient={detailedIngredient}
          setDetailedIngredient={setDetailedIngredient}
        />
      </>
    ) : (
      <DetailedFood
        detailedFood={detailedFood}
        setDetailedIngredient={setDetailedIngredient}
      />
    )}
  </>
);

export default ModalFoodIngre;
