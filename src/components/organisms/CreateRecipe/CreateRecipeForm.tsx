import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa';
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
import { cn } from '@/helpers/helpers';
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
import HubPageShell from '@/templates/HubPageShell';
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
  const currentCustomIngredients =
    useSelector(foodSelector).currentCustomIngredients;
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
        videoUrl: undefined,
        description: isNaN(Number(currentCustomFood.description))
          ? ''
          : currentCustomFood.description,
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
        type: FOOD_TYPE_MAP.customRecipe,
      });

      setImg(currentCustomFood.imgUrls?.[0]);

      if (currentCustomFood && currentCustomIngredients) {
        const transformedIngredients: IngredientDisplay[] =
          currentCustomFood.ingredients.map((ingredient) => {
            const food = currentCustomIngredients.find(
              (foodItem) => foodItem._id === ingredient.ingredientFoodId._id,
            );

            return {
              ingredientFoodId: ingredient.ingredientFoodId._id,
              amount: ingredient.amount,
              unit: ingredient.unit,
              food: food ?? ({} as Food),
            };
          });

        setIngredientDisplay(transformedIngredients);
      }

      setIngredient(currentCustomIngredients ?? []);
    }
  }, [currentCustomFood, currentCustomIngredients, reset]);

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

  const handleCancelClick = () => {
    dispatch(removeCurrentCustomFood());
    reset();
    if (canGoBack) {
      router.history.back();
    }
  };

  return (
    <HubPageShell
      maxWidthClassName='max-w-7xl'
      title={
        <span className='flex items-center gap-3'>
          <button
            type='button'
            onClick={handleCancelClick}
            className='flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/70 text-gray-700 transition hover:bg-white'
            aria-label='Back'
          >
            <FaArrowLeft className='h-4 w-4' />
          </button>
          <span>
            {currentCustomFood ? 'Edit Custom Recipe' : 'Create Custom Recipe'}
          </span>
        </span>
      }
      description='Create your own recipe by combining existing foods.'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          {/* LEFT COLUMN */}
          <div className='flex flex-col gap-6 lg:col-span-5'>
            {/* Basic Info & Image Card */}
            <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <RecipeBasicInfoSection
                control={control}
                errors={errors}
                img={img}
                upload={upload}
                setUpload={setUpload}
                handleUploaded={handleUploaded}
              />
            </div>

            {/* Properties Card */}
            <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <RecipePropertiesSection
                control={control}
                timeFields={timeFields}
                setValue={setValue}
                selectedMainDish={selectedMainDish}
                selectedMeals={selectedMeals}
                handleMealChange={handleMealChange}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className='flex flex-col gap-6 lg:col-span-7'>
            {/* Ingredients & Nutrition Card */}
            <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <h3 className='mb-4 text-base font-semibold text-gray-900'>
                Ingredients
              </h3>

              {ingredientDisplay.length ? (
                <div className='flex flex-col gap-6 xl:flex-row'>
                  <div className='flex flex-1 flex-col gap-2'>
                    {ingredientDisplay.map((ingredient) => (
                      <IngredientItem
                        key={ingredient.ingredientFoodId}
                        ingredient={ingredient}
                        onRemove={handleRemoveIngredient}
                      />
                    ))}
                    <Button
                      className='border-secondary-200 bg-secondary-50 text-secondary-600 hover:bg-secondary-100 mt-2 flex w-fit items-center gap-2 rounded-xl border px-4 py-2'
                      onClick={() => setIngredientModalOpen(true)}
                    >
                      <IoSearch />
                      <p className='m-0'>Add Ingredient</p>
                    </Button>
                  </div>
                  <div className='w-full xl:w-[280px]'>
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
                  <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-10'>
                    <p className='mb-3 text-gray-500'>
                      No ingredients added yet
                    </p>
                    <Button
                      className='bg-secondary-500 hover:bg-secondary-600 flex items-center gap-2 rounded-xl text-white'
                      onClick={() => setIngredientModalOpen(true)}
                    >
                      <IoSearch />
                      <p className='m-0'>Add Ingredient</p>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Directions Card */}
            <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <h3 className='mb-4 text-base font-semibold text-gray-900'>
                Directions
              </h3>
              <DirectionsInputList control={control} />
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className='sticky bottom-0 z-10 -mx-5 border-t border-gray-200/70 bg-white/80 px-5 py-4 backdrop-blur sm:-mx-7 sm:px-7'>
          <div className='flex flex-wrap justify-end gap-3'>
            <Button
              className='px-6 py-5 text-[15px] font-medium'
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                `shadow-secondary-500/20 hover:shadow-secondary-500/30 flex min-w-[140px] items-center justify-center gap-2 border-none px-6 py-5 text-[15px] font-medium text-white shadow-lg transition-all hover:scale-[1.02] ${
                  isLoading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-secondary-400 hover:bg-secondary-500'
                }`,
              )}
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
                  <GrDocumentUpdate className='text-[16px]' />
                  {currentCustomFood ? 'Save Changes' : 'Create Recipe'}
                </span>
              )}
            </Button>
          </div>
        </div>

        <AddIngredientModal
          open={isIngredientModalOpen}
          onClose={() => setIngredientModalOpen(false)}
          onAdd={handleAddIngredient}
          setIngredient={setIngredient}
        />
      </form>
    </HubPageShell>
  );
};

export default CreateRecipeForm;
