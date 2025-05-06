import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { Spin } from 'antd';

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
import {
  AddIngredientModal,
  DirectionsInputList,
  IngredientItem,
  RecipeBasicInfoSection,
  RecipePropertiesSection,
} from '@/organisms/CreateRecipe';
import {
  useCreateCustomRecipeMutation,
  useGetFoodsQuery,
} from '@/redux/query/apis/food/foodApis';
import { foodSelector, removeCurrentCustomFood } from '@/redux/slices/food';
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
  const dispatch = useDispatch();
  const currentCustomFood = useSelector(foodSelector).currentCustomFood;
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

  const { refetch } = useGetFoodsQuery({
    page: 1,
    limit: 20,
    filters: ['customFood', 'customRecipe'],
  });

  useEffect(() => {
    if (currentCustomFood) {
      const transformedDirections =
        currentCustomFood.directions?.map((d) => ({ step: d })) ?? [];

      const transformedIngredients =
        currentCustomFood.ingredients?.map((ingredient) => ({
          ...ingredient,
          ingredientFoodId:
            typeof ingredient.ingredientFoodId === 'object'
              ? ingredient.ingredientFoodId._id
              : ingredient.ingredientFoodId,
        })) ?? [];

      reset({
        ...currentCustomFood,
        directions: transformedDirections,
        ingredients: transformedIngredients,
        property: {
          ...currentCustomFood.property,
          mainDish: currentCustomFood.property?.mainDish ?? true,
          isBreakfast: currentCustomFood.property?.isBreakfast ?? true,
          isLunch: currentCustomFood.property?.isLunch ?? true,
          isDinner: currentCustomFood.property?.isDinner ?? true,
          isSnack: currentCustomFood.property?.isSnack ?? true,
          isDessert: currentCustomFood.property?.isDessert ?? true,
        },
      });

      setImg(currentCustomFood.imgUrls?.[0]);
      setIngredient(currentCustomFood.ingredientList ?? []);

      setIngredientDisplay(
        transformedIngredients.map((ingredient) => ({
          ...ingredient,
          food: currentCustomFood.ingredientList?.find(
            (f) => f._id === ingredient.ingredientFoodId,
          ),
        })),
      );
    }
  }, [currentCustomFood, reset]);

  const onSubmit = async (data: FoodFormSchema) => {
    try {
      const response = await createCustomRecipe(data).unwrap();
      if (response.code === HTTP_STATUS.OK) {
        await refetch();
        showToastSuccess('Recipe created successfully!');
        dispatch(removeCurrentCustomFood());
        reset();
        router.history.back();
      }
    } catch {
      showToastError('Failed to create recipe!');
    }
  };

  const property = useWatch({ control, name: 'property' });
  const selectedMainDish = useWatch({ control, name: 'property.mainDish' });

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

  const handleUploaded = async (url: string) => {
    setValue('imgUrls', [url]);
    setImg(url);
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
    const ingredientsInput = getValues('ingredients') ?? [];

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='w-[900px] px-[40px]'>
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

        {ingredientDisplay.length ? (
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
        ) : (
          <div className='flex flex-col gap-2'>
            {errors.ingredients && (
              <p className='text-sm text-red-500'>
                {errors.ingredients.message}
              </p>
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
      </div>

      <div className='sticky bottom-0 z-10 bg-white py-4 shadow-inner'>
        <div className='flex w-[860px] justify-end gap-4'>
          <Button
            onClick={() => {
              dispatch(removeCurrentCustomFood());
              reset();
              if (canGoBack) {
                router.history.back();
              }
            }}
            className='px-4 py-5 text-[16px]'
          >
            Cancel
          </Button>
          <Button
            className={`flex w-[160px] items-center gap-2 border-none px-4 py-5 text-[16px] text-white ${
              isLoading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-primary-400 hover:bg-primary-500'
            }`}
            htmlType='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <Spin
                indicator={<LoadingOutlined spin />}
                size='small'
                className='text-white'
              />
            ) : (
              <span className='flex items-center gap-2'>
                {' '}
                <GrDocumentUpdate className='text-[18px]' />
                Create
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateRecipeForm;
