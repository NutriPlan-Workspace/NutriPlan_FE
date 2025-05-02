import React from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { FaRegPlusSquare, FaRegWindowClose } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Button, Input, Typography } from 'antd';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/helpers/helpers';
import { FoodFormSchema } from '@/schemas/recipeSchema';

const { Title, Paragraph } = Typography;

interface DirectionsInputListProps {
  control: Control<FoodFormSchema>;
}

const DirectionsInputList: React.FC<DirectionsInputListProps> = ({
  control,
}) => {
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'directions',
  });

  return (
    <div>
      <Title level={3} className='mt-4 font-thin'>
        Directions
      </Title>

      <AnimatePresence>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            className='mb-4 flex items-center gap-2'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex h-full flex-col justify-between'>
              <Button
                htmlType='button'
                className={cn(
                  'border-none bg-gray-100 text-black/10 hover:bg-gray-200',
                  index === 0 &&
                    'bg-transparent text-gray-400 hover:bg-transparent',
                )}
                onClick={() => index > 0 && swap(index, index - 1)}
                disabled={index === 0}
              >
                <IoIosArrowUp className='h-8 w-8' />
              </Button>
              <Button
                className={cn(
                  'border-none bg-gray-100 text-black hover:bg-gray-200',
                  index === fields.length - 1 &&
                    'bg-transparent text-gray-400 hover:bg-transparent',
                )}
                htmlType='button'
                onClick={() =>
                  index < fields.length - 1 && swap(index, index + 1)
                }
                disabled={index === fields.length - 1}
              >
                <IoIosArrowDown className='h-8 w-8 text-gray-400' />
              </Button>
            </div>

            <Controller
              name={`directions.${index}.step`}
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  autoSize={{ minRows: 3 }}
                  className='max-w-[700px]'
                />
              )}
            />

            <Button
              className='border-none hover:text-black'
              onClick={() => remove(index)}
            >
              <FaRegWindowClose className='h-5 w-5' />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        className='flex items-center gap-2 rounded-full p-4'
        onClick={() => append({ step: '' })}
      >
        <FaRegPlusSquare className='h-5 w-5 font-thin' />
        <Paragraph className='m-0 font-thin'>Add a step</Paragraph>
      </Button>
    </div>
  );
};

export default DirectionsInputList;
