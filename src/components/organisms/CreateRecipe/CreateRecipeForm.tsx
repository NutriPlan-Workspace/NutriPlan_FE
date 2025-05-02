import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { IoSearch } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { motion } from 'motion/react';

import { Button } from '@/atoms/Button';
import { HTTP_STATUS } from '@/constants/httpStatus';
import {
  FOOD_TYPE_MAP,
  mealOptions,
  propertyKeysMap,
  timeFields,
} from '@/constants/recipeForm';
import { useToast } from '@/contexts/ToastContext';
import { NutritionSummary } from '@/molecules/NutritionSummary';
import { AddIngredientModal } from '@/organisms/CreateRecipe';
import { DirectionsInputList } from '@/organisms/CreateRecipe';
import { IngredientItem } from '@/organisms/CreateRecipe';
import { RecipeBasicInfoSection } from '@/organisms/CreateRecipe';
import { RecipePropertiesSection } from '@/organisms/CreateRecipe';
import { useCreateCustomRecipeMutation } from '@/redux/query/apis/food/foodApis';
import { FoodFormSchema, FoodSchema } from '@/schemas/recipeSchema';
import type { Food } from '@/types/food';
import type { IngredientDisplay, IngredientInput } from '@/types/ingredient';
import { calculateTotalNutrition } from '@/utils/calculateNutrition';

const CreateRecipeForm: React.FC = () => {
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FoodFormSchema>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      type: FOOD_TYPE_MAP.customRecipe,
      directions: [{ step: '' }],
      ingredients: [],
      description: '',
      name: '',
      units: [{ amount: 1, description: 'serving' }],
      property: {
        mainDish: true,
        sideDish: false,
        isBreakfast: true,
        isLunch: true,
        isDinner: true,
        isSnack: true,
        isDessert: true,
      },
    },
  });

  const { showToastError, showToastSuccess } = useToast();

  const [createCustomRecipe, { isLoading }] = useCreateCustomRecipeMutation();
  const [upload, setUpload] = useState(false);
  const [img, setImg] = useState<string | undefined>(undefined);
  const [isIngredientModalOpen, setIngredientModalOpen] = useState(false);
  const [ingredient, setIngredient] = useState<Food[]>([]);
  const [ingredientDisplay, setIngredientDisplay] = useState<
    IngredientDisplay[]
  >([]);

  const router = useRouter();
  const canGoBack = useCanGoBack();

  const onSubmit = async (data: FoodFormSchema) => {
    try {
      const response = await createCustomRecipe(data).unwrap();
      if (response.code == HTTP_STATUS.OK) {
        setImg(undefined);
        setIngredient([]);
        setIngredientDisplay([]);
        reset();
        if (canGoBack) {
          router.history.back();
        }
        showToastSuccess('Create Custom recipe success!');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      showToastError('Create Custom recipe failure!');
    }
  };

  const handleUploaded = async (url: string) => {
    setValue('imgUrls', [url]);
    setImg(url);
  };

  const selectedMainDish = useWatch({
    control,
    name: 'property.mainDish',
  });

  const property = useWatch({ control, name: 'property' });

  const selectedMeals = useMemo(
    () => mealOptions.filter((meal) => property?.[propertyKeysMap[meal]]),
    [property],
  );

  const handleMealChange = (checkedValues: string[]) => {
    mealOptions.forEach((meal) => {
      const key = propertyKeysMap[meal];
      setValue(`property.${key}`, checkedValues.includes(meal));
    });
  };

  const handleAddIngredient = (ingredient: IngredientInput) => {
    const newIngredient = {
      ingredientFoodId: ingredient.ingredientFoodId,
      amount: ingredient.amount,
      unit: ingredient.unit,
    };
    setValue('ingredients', [...getValues('ingredients'), newIngredient]);
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    const updatedIngredients = getValues('ingredients').filter(
      (ingredient) => ingredient.ingredientFoodId !== ingredientId,
    );
    setValue('ingredients', updatedIngredients);
    setIngredientDisplay((prev) =>
      prev.filter((ingredient) => ingredient.ingredientFoodId !== ingredientId),
    );
  };

  useEffect(() => {
    const ingredientsInput = getValues('ingredients');

    const mergedMap = new Map<string, IngredientDisplay>();

    for (const input of ingredientsInput) {
      const matchedFood = ingredient.find(
        (food) => food._id === input.ingredientFoodId,
      );

      if (!matchedFood) continue;

      if (mergedMap.has(input.ingredientFoodId)) {
        const existing = mergedMap.get(input.ingredientFoodId)!;
        mergedMap.set(input.ingredientFoodId, {
          ...existing,
          amount: existing.amount + input.amount,
          unit: input.unit,
        });
      } else {
        mergedMap.set(input.ingredientFoodId, {
          ...input,
          food: matchedFood,
        });
      }
    }
    setIngredientDisplay(Array.from(mergedMap.values()));
  }, [ingredient, getValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-[60vw]'>
      <RecipeBasicInfoSection
        control={control}
        errors={errors}
        img={img}
        upload={upload}
        setUpload={setUpload}
        handleUploaded={handleUploaded}
      />
      <RecipePropertiesSection
        control={control}
        timeFields={timeFields}
        setValue={setValue}
        selectedMainDish={selectedMainDish}
        selectedMeals={selectedMeals}
        handleMealChange={handleMealChange}
      />

      {!!ingredientDisplay.length && (
        <div className='mt-4 flex gap-4'>
          <div className='flex flex-1 flex-col gap-2'>
            {ingredientDisplay.map((ingredient) => (
              <IngredientItem
                key={ingredient.ingredientFoodId}
                ingredient={ingredient}
                onRemove={handleRemoveIngredient}
              />
            ))}
            <Button
              className='hover:border-primary hover:text-primary flex max-w-[150px] items-center gap-2 p-4'
              onClick={() => setIngredientModalOpen(true)}
            >
              <IoSearch />
              <p>Add Ingredient</p>
            </Button>
          </div>

          <div className='flex-1 pl-10'>
            <NutritionSummary
              nutrition={calculateTotalNutrition(ingredientDisplay)}
              type='food'
            />
          </div>
        </div>
      )}

      {ingredientDisplay.length === 0 && (
        <div className='flex flex-col gap-2'>
          {errors.ingredients && (
            <motion.p
              className='text-sm text-red-500'
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {errors.ingredients.message}
            </motion.p>
          )}

          <Button
            className='hover:border-primary hover:text-primary flex max-w-[150px] items-center gap-2 p-4'
            onClick={() => setIngredientModalOpen(true)}
          >
            <IoSearch />
            <p>Add Ingredient</p>
          </Button>
        </div>
      )}
      <AddIngredientModal
        open={isIngredientModalOpen}
        onClose={() => setIngredientModalOpen(false)}
        onAdd={handleAddIngredient}
        setIngredient={setIngredient}
      />

      <DirectionsInputList control={control} />

      <div className='mt-2 flex items-center gap-4'>
        <Button className='rounded-full border-none px-20 py-4 text-blue-500 transition-all hover:border-none hover:bg-blue-50'>
          Cancel
        </Button>
        <Button
          htmlType='submit'
          loading={isLoading}
          className='bg-primary hover:bg-primary-300 rounded-full border-transparent px-20 py-4 text-white transition-all hover:border-transparent hover:text-white'
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default CreateRecipeForm;
