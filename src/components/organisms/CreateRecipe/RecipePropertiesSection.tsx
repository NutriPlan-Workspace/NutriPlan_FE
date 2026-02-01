import React from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import {
  Button,
  Checkbox,
  ConfigProvider,
  InputNumber,
  Typography,
} from 'antd';

import { TimeField } from '@/constants/recipeForm';
import { cn } from '@/helpers/helpers';
import { FormRow } from '@/molecules/FormRow';
import { FoodFormSchema } from '@/schemas/recipeSchema';

const { Title, Paragraph } = Typography;

type Props = {
  control: Control<FoodFormSchema>;
  timeFields: TimeField[];
  setValue: UseFormSetValue<FoodFormSchema>;
  selectedMainDish: boolean;
  selectedMeals: string[];
  handleMealChange: (checkedValues: string[]) => void;
};

const RecipePropertiesSection: React.FC<Props> = ({
  control,
  timeFields,
  setValue,
  selectedMainDish,
  selectedMeals,
  handleMealChange,
}) => (
  <>
    <Title level={3} className='mt-4 font-thin'>
      Meal Properties
    </Title>

    <FormRow label='Main dish?'>
      <div className='flex gap-[8px] rounded-md border border-gray-200 p-0.5'>
        <Button
          className={cn(
            'rounded-md hover:border-transparent',
            selectedMainDish && 'bg-secondary-400 text-white',
          )}
          onClick={() => {
            setValue('property.mainDish', true);
            setValue('property.sideDish', false);
          }}
        >
          Main Dish
        </Button>
        <Button
          className={cn(
            'rounded-md hover:border-gray-200',
            !selectedMainDish && 'bg-secondary-400 text-white',
          )}
          onClick={() => {
            setValue('property.mainDish', false);
            setValue('property.sideDish', true);
          }}
        >
          Side Dish
        </Button>
      </div>
    </FormRow>

    <FormRow label='Works well for' isEnd={true}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#649dad',
          },
        }}
      >
        <Checkbox.Group
          options={['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']}
          value={selectedMeals}
          onChange={(checkedValues) =>
            handleMealChange(checkedValues as string[])
          }
          className='grid grid-cols-3 gap-2'
        />
      </ConfigProvider>
    </FormRow>

    <Title level={3} className='mt-4 font-thin'>
      Recipe Properties
    </Title>

    {timeFields.map((field, index) => (
      <FormRow
        key={index}
        label={field.label}
        isEnd={index === timeFields.length - 1}
        contentClassName='flex items-center justify-end gap-2'
      >
        {field.key ? (
          <Controller
            name={`property.${field.key}` as const}
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                defaultValue={1}
                className='max-w-[50px]'
                min={0}
              />
            )}
          />
        ) : (
          <InputNumber defaultValue={1} className='max-w-[50px]' />
        )}
        <Paragraph className='m-0'>{field.unit}</Paragraph>
      </FormRow>
    ))}
  </>
);

export default RecipePropertiesSection;
