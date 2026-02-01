import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { Input, InputNumber } from 'antd';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { Button } from '@/atoms/Button';
import { nutritionFieldGroup } from '@/constants/nutritionFormat';
import { CategoryMultiSelect } from '@/molecules/CategoryMultiSelect';
import type { Category } from '@/types/category';
import type { Food } from '@/types/food';

export type AdminFoodFormValues = {
  name: string;
  type: 'create' | 'customFood' | 'customRecipe';
  description: string;
  imgUrl: string;
  units: { amount: number; description: string }[];
  defaultUnit: number;
  categories: number[];
  nutrition: Partial<Food['nutrition']>;
};

type AdminFoodFormProps = {
  title: string;
  submitLabel: string;
  categories: Category[];
  initialValues: AdminFoodFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: AdminFoodFormValues) => Promise<void> | void;
};

const buildNutritionDefaults = () => {
  const defaults: Record<string, number> = {};
  nutritionFieldGroup.forEach((group) => {
    group.field.forEach((item) => {
      defaults[item.key] = 0;
    });
  });
  return defaults;
};

const AdminFoodForm: React.FC<AdminFoodFormProps> = ({
  title,
  submitLabel,
  categories,
  initialValues,
  isSubmitting,
  onSubmit,
}) => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const baseNutrition = useMemo(() => buildNutritionDefaults(), []);
  const [formState, setFormState] = useState<AdminFoodFormValues>(() => ({
    ...initialValues,
    nutrition: {
      ...baseNutrition,
      ...initialValues.nutrition,
    },
  }));

  useEffect(() => {
    setFormState({
      ...initialValues,
      nutrition: {
        ...baseNutrition,
        ...initialValues.nutrition,
      },
    });
  }, [baseNutrition, initialValues]);

  const handleUnitChange = (
    index: number,
    key: 'amount' | 'description',
    value: number | string,
  ) => {
    setFormState((prev) => {
      const nextUnits = prev.units.map((unit, idx) =>
        idx === index ? { ...unit, [key]: value } : unit,
      );
      return { ...prev, units: nextUnits };
    });
  };

  const handleAddUnit = () => {
    setFormState((prev) => ({
      ...prev,
      units: [...prev.units, { amount: 1, description: '' }],
    }));
  };

  const handleRemoveUnit = (index: number) => {
    setFormState((prev) => {
      const nextUnits = prev.units.filter((_, idx) => idx !== index);
      const nextDefaultUnit = Math.min(prev.defaultUnit, nextUnits.length - 1);
      return {
        ...prev,
        units: nextUnits,
        defaultUnit: Math.max(0, nextDefaultUnit),
      };
    });
  };

  const handleNutritionChange = (
    key: keyof Food['nutrition'],
    value: number | null,
  ) => {
    setFormState((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [key]: value ?? 0,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formState);
  };

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-6 flex flex-col gap-2'>
        <button
          type='button'
          className='flex w-fit items-center gap-2 text-sm text-slate-500 hover:text-slate-700'
          onClick={() => {
            if (canGoBack) {
              router.history.back();
            }
          }}
        >
          <FaArrowLeft />
          Back
        </button>
        <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
          Admin
        </p>
        <AnimatedTitle className='text-3xl font-bold text-slate-900'>
          {title}
        </AnimatedTitle>
        <AnimatedSubtitle className='text-sm text-slate-600'>
          Full editor for nutrition, units, images, and categories.
        </AnimatedSubtitle>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid gap-6 rounded-2xl border border-slate-200 bg-white p-6'
      >
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className='text-sm font-semibold text-slate-700'>Name</label>
            <Input
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, name: event.target.value }))
              }
              className='mt-2 rounded-xl'
              placeholder='Food name'
            />
          </div>
          <div>
            <label className='text-sm font-semibold text-slate-700'>Type</label>
            <select
              className='mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm'
              value={formState.type}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  type: event.target.value as AdminFoodFormValues['type'],
                }))
              }
            >
              <option value='create'>Admin food</option>
              <option value='customFood'>Custom food</option>
              <option value='customRecipe'>Custom recipe</option>
            </select>
          </div>
        </div>

        <div>
          <label className='text-sm font-semibold text-slate-700'>
            Description
          </label>
          <Input.TextArea
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            rows={4}
            className='mt-2 rounded-xl'
            placeholder='Short description'
          />
        </div>

        <div>
          <label className='text-sm font-semibold text-slate-700'>
            Image URL
          </label>
          <Input
            value={formState.imgUrl}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, imgUrl: event.target.value }))
            }
            className='mt-2 rounded-xl'
            placeholder='https://...'
          />
          {formState.imgUrl && (
            <div className='mt-3'>
              <img
                src={formState.imgUrl}
                alt='Preview'
                className='h-32 w-32 rounded-xl object-cover'
              />
            </div>
          )}
        </div>

        <div>
          <label className='text-sm font-semibold text-slate-700'>
            Categories
          </label>
          <div className='mt-2'>
            <CategoryMultiSelect
              options={categories}
              value={formState.categories}
              onChange={(next) =>
                setFormState((prev) => ({ ...prev, categories: next }))
              }
            />
          </div>
        </div>

        <div>
          <label className='text-sm font-semibold text-slate-700'>Units</label>
          <div className='mt-3 grid gap-3'>
            {formState.units.map((unit, index) => (
              <div
                key={`${unit.description}-${index}`}
                className='grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[120px_1fr_120px_auto] md:items-center'
              >
                <InputNumber
                  min={0}
                  value={unit.amount}
                  onChange={(value) =>
                    handleUnitChange(index, 'amount', Number(value) || 0)
                  }
                  className='w-full'
                />
                <Input
                  value={unit.description}
                  onChange={(event) =>
                    handleUnitChange(index, 'description', event.target.value)
                  }
                  className='w-full'
                  placeholder='serving, cup, 100g'
                />
                <label className='flex items-center gap-2 text-sm text-slate-600'>
                  <input
                    type='radio'
                    name='defaultUnit'
                    checked={formState.defaultUnit === index}
                    onChange={() =>
                      setFormState((prev) => ({
                        ...prev,
                        defaultUnit: index,
                      }))
                    }
                  />
                  Default
                </label>
                {formState.units.length > 1 && (
                  <Button
                    htmlType='button'
                    danger
                    onClick={() => handleRemoveUnit(index)}
                  >
                    <FaTrashAlt />
                  </Button>
                )}
              </div>
            ))}
            <Button htmlType='button' onClick={handleAddUnit}>
              Add unit
            </Button>
          </div>
        </div>

        <div>
          <p className='text-sm font-semibold text-slate-700'>Nutrition</p>
          <div className='mt-3 grid gap-6'>
            {nutritionFieldGroup.map((group) => (
              <div
                key={group.nutriName}
                className='rounded-xl border border-slate-200 p-4'
              >
                <div className='mb-3 text-sm font-semibold text-slate-700'>
                  {group.label1}
                </div>
                <div className='grid gap-3 md:grid-cols-2'>
                  {group.field.map((item) => (
                    <div key={item.key} className='flex items-center gap-3'>
                      <div className='flex-1 text-sm text-slate-600'>
                        {item.title}
                      </div>
                      <InputNumber
                        min={0}
                        value={Number(
                          formState.nutrition[
                            item.key as keyof Food['nutrition']
                          ] ?? 0,
                        )}
                        onChange={(value) =>
                          handleNutritionChange(
                            item.key as keyof Food['nutrition'],
                            value,
                          )
                        }
                        className='w-32'
                      />
                      <span className='text-xs text-slate-400'>
                        {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button
            htmlType='submit'
            disabled={isSubmitting || !formState.name.trim()}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminFoodForm;
