import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaTrashAlt } from 'react-icons/fa';
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoSearch } from 'react-icons/io5';
import { LoadingOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanGoBack, useParams, useRouter } from '@tanstack/react-router';
import { Modal, Spin } from 'antd';

import { Button } from '@/atoms/Button';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES } from '@/constants/message';
import {
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
  useGetFoodsQuery,
  useRemoveCustomFoodMutation,
  useUpdateCustomFoodMutation,
} from '@/redux/query/apis/food/foodApis';
import { FoodFormSchema, FoodSchema } from '@/schemas/recipeSchema';
import type { DetailedFoodResponse, Food } from '@/types/food';
import type { IngredientDisplay, IngredientInput } from '@/types/ingredient';
import { calculateTotalNutrition } from '@/utils/calculateNutrition';

interface EditRecipeFormProps {
  data: DetailedFoodResponse;
}
const EditRecipeForm: React.FC<EditRecipeFormProps> = ({ data }) => {
  const [updateCustomRecipe, { isLoading }] = useUpdateCustomFoodMutation();

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FoodFormSchema>({
    resolver: zodResolver(FoodSchema),
  });

  const canGoBack = useCanGoBack();
  const { showToastError, showToastSuccess } = useToast();
  const [upload, setUpload] = useState(false);
  const [img, setImg] = useState<string | undefined>(undefined);
  const [isIngredientModalOpen, setIngredientModalOpen] = useState(false);
  const [ingredient, setIngredient] = useState<Food[]>([]);
  const [ingredientDisplay, setIngredientDisplay] = useState<
    IngredientDisplay[]
  >([]);
  const [removeCustomFood] = useRemoveCustomFoodMutation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { id } = useParams({ strict: false });

  const router = useRouter();
  const { refetch } = useGetFoodsQuery({
    page: 1,
    limit: 20,
    filters: ['customFood', 'customRecipe'],
  });

  useEffect(() => {
    if (data?.data) {
      const mainFood = data.data.mainFood;

      const transformedDirections =
        mainFood.directions?.map((d) => ({ step: d })) ?? [];

      reset({
        ...mainFood,
        directions: transformedDirections,
        ingredients: mainFood.ingredients.map((ingredient) => ({
          ...ingredient,
          ingredientFoodId:
            typeof ingredient.ingredientFoodId === 'object'
              ? ingredient.ingredientFoodId._id
              : ingredient.ingredientFoodId,
        })),
      });

      setImg(mainFood.imgUrls?.[0]);
      setIngredient(data.data.ingredientList);

      setIngredientDisplay(
        mainFood.ingredients.map((i) => ({
          ...i,
          food: data.data.ingredientList?.find(
            (f) => f._id === i.ingredientFoodId,
          ),
        })),
      );
    }
  }, [data, reset]);

  const onSubmit = async (formData: FoodFormSchema) => {
    if (!id) return;

    const directionsRaw = getValues('directions') ?? [];
    const directions = directionsRaw
      .map((d) => d.step?.trim())
      .filter((step): step is string => !!step);

    const payload = {
      type: 'customRecipe',
      _id: id,
      ...formData,
      directions,
    };

    try {
      const response = await updateCustomRecipe(payload).unwrap();
      if (response.code === HTTP_STATUS.OK) {
        await refetch();
        showToastSuccess('Recipe updated successfully!');
        router.history.back();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      showToastError('Failed to update recipe!');
    }
  };

  const selectedMainDish = useWatch({ control, name: 'property.mainDish' });
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

  const handleCancelClick = () => {
    if (canGoBack) {
      router.history.back();
    }
  };

  const handleConfirmDelete = () => {
    handleRemove();
    setIsConfirmModalOpen(false);
  };

  const handleRemove = async () => {
    try {
      await removeCustomFood(id!).unwrap();
      await refetch();
      handleCancelClick();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
    }
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
    <>
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
                if (canGoBack) {
                  router.history.back();
                }
              }}
              className='px-4 py-5 text-[16px]'
            >
              Cancel
            </Button>
            <Button
              className={cn(
                `flex w-[160px] items-center gap-2 border-none px-4 py-5 text-[16px] text-white ${
                  isLoading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-primary-400 hover:bg-primary-500'
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
                  <GrDocumentUpdate className='text-[18px]' />
                  Save
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className='mb-10 ml-[40px]'>
        <p className='text-[25px]'>Danger Zone</p>
        <p>Deleting this food will permanently remove it.</p>
        <Button
          className='bg-secondary-400 hover:bg-secondary-500 mt-5 px-4 py-5 text-[16px] text-white'
          onClick={() => setIsConfirmModalOpen(!isConfirmModalOpen)}
        >
          <FaTrashAlt />
          {`Delete ${getValues('name')}`}
        </Button>
        <Modal
          open={isConfirmModalOpen}
          onOk={handleConfirmDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
          okText='Yes'
          cancelText='Cancel'
          okButtonProps={{ danger: true }}
          cancelButtonProps={{
            className:
              'bg-gray-400 text-white hover:bg-gray-500 border-none focus:outline-none',
          }}
        >
          <p>{`Are you sure you want to delete ${getValues('name')} ?`}</p>
        </Modal>
      </div>
    </>
  );
};

export default EditRecipeForm;
