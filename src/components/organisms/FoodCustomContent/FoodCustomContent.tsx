import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa';
import { FiPlusSquare } from 'react-icons/fi';
import { GrDocumentUpdate } from 'react-icons/gr';
import { IoIosArrowForward } from 'react-icons/io';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import {
  Divider,
  Image,
  Input,
  InputNumber,
  Radio,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { ERROR_MESSAGES } from '@/constants/message';
import {
  nutritionalValue,
  nutritionFieldGroup,
} from '@/constants/nutritionFormat';
import { cn } from '@/helpers/helpers';
import { PopupUpload } from '@/molecules/PopupUpload';
import {
  useCreateCustomFoodMutation,
  useGetFoodsQuery,
} from '@/redux/query/apis/food/foodApis';
import { foodSelector } from '@/redux/slices/food';
import { foodSchema } from '@/schemas/foodSchema';
import HubPageShell from '@/templates/HubPageShell';
import { showToastError } from '@/utils/toastUtils';

const { TextArea } = Input;
const { Paragraph } = Typography;

const FoodCustomContent: React.FC = () => {
  const currentCustomFood = useSelector(foodSelector).currentCustomFood;
  const [upload, setUpload] = useState(false);
  const [img, setImg] = useState<string | undefined>(
    'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/whuexhkydv7ubiqh5rxe.jpg',
  );

  const [showOptional, setShowOptional] = useState(false);

  const [createCustomFood, { isLoading }] = useCreateCustomFoodMutation();
  const { refetch } = useGetFoodsQuery({
    page: 1,
    limit: 20,
    filters: ['customFood', 'customRecipe'],
  });
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      imgUrls: [],
      units: [{ amount: 1, description: 'serving' }],
      defaultUnit: 0,
    },
    resolver: zodResolver(foodSchema),
  });

  useEffect(() => {
    if (currentCustomFood) {
      reset(currentCustomFood);
    }
  }, [currentCustomFood, reset]);

  useEffect(() => {
    if (currentCustomFood?.imgUrls?.[0]) {
      setImg(currentCustomFood?.imgUrls[0]);
    }
  }, [currentCustomFood, setImg]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'units',
  });

  const selectedIndex = useWatch({ control, name: 'defaultUnit' });

  const handleUploaded = async (url: string) => {
    setValue('imgUrls', [url]);
    setImg(url);
  };

  const onSubmit = async (formData) => {
    const payload = {
      type: 'customFood',
      ...formData,
      // imgUrls: [img],
      defaultUnit: watch('defaultUnit'),
    };

    try {
      await createCustomFood(payload).unwrap();
      handleCancelClick();
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError(ERROR_MESSAGES.CREATE_CUSTOMFOOD_FAILED);
    }
  };

  const handleAdd = () => {
    append({ amount: null, description: '' });
  };

  const handleChangeDefaultUnit = (e) => {
    const value = e.target.value;
    setValue('defaultUnit', value);
  };

  const handleCancelClick = () => {
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
            {currentCustomFood ? 'Edit Custom Food' : 'Create Custom Food'}
          </span>
        </span>
      }
      description='Add serving sizes and nutrition values for your custom food.'
    >
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          <div className='lg:col-span-5'>
            <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <div className='flex flex-col gap-5'>
                <div className='grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center'>
                  <div className='text-sm font-medium text-gray-700 sm:col-span-4'>
                    Name
                  </div>
                  <div className='sm:col-span-8'>
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <Tooltip
                          title={errors.name?.message}
                          open={!!errors.name}
                          color='orange'
                        >
                          <Input
                            {...field}
                            className='h-11 w-full rounded-2xl border border-gray-200 bg-white/80 shadow-sm'
                          />
                        </Tooltip>
                      )}
                    />
                  </div>
                </div>

                <Divider className='my-0' />

                <div className='grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-start'>
                  <div className='pt-2 text-sm font-medium text-gray-700 sm:col-span-4'>
                    Description
                  </div>
                  <div className='sm:col-span-8'>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <TextArea
                          {...field}
                          rows={4}
                          className='w-full resize-none rounded-2xl border border-gray-200 bg-white/80 shadow-sm'
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-6 rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='m-0 text-base font-semibold text-gray-900'>
                    Image
                  </p>
                  <Paragraph className='m-0 mt-1 text-sm text-gray-600'>
                    Optional cover image for this food.
                  </Paragraph>
                </div>
              </div>

              <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center'>
                <Image
                  src={img}
                  className='aspect-square w-full rounded-2xl object-cover'
                  preview={false}
                />
                <div className='flex flex-col gap-2'>
                  <Button
                    onClick={() => setUpload(!upload)}
                    className='flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/80 font-semibold text-gray-800 hover:bg-white'
                  >
                    <IoCloudUploadOutline />
                    Upload Image
                  </Button>
                  <PopupUpload
                    isModalOpen={upload}
                    setModalOpen={setUpload}
                    onUploaded={handleUploaded}
                  />
                </div>
              </div>
            </div>

            <div className='mt-6 rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <p className='m-0 text-base font-semibold text-gray-900'>
                Serving Size
              </p>
              <Paragraph className='m-0 mt-1 text-sm text-gray-600'>
                For conversions to work, make sure the serving sizes represent
                equivalent amounts.
              </Paragraph>

              <div className='mt-4'>
                <Radio.Group
                  value={selectedIndex}
                  onChange={handleChangeDefaultUnit}
                >
                  <div className='flex flex-col gap-2'>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className='flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white/70 p-3 sm:flex-row sm:items-center'
                      >
                        <div className='flex items-center gap-2'>
                          <Radio value={index} />
                          <span className='text-sm font-medium text-gray-700'>
                            Default
                          </span>
                        </div>

                        <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center'>
                          <Controller
                            name={`units.${index}.amount`}
                            control={control}
                            render={({ field }) => (
                              <Tooltip
                                title={errors?.units?.[index]?.amount?.message}
                                open={!!errors?.units?.[index]?.amount}
                                color='orange'
                                placement='bottom'
                              >
                                <InputNumber
                                  {...field}
                                  className='h-11 w-full rounded-2xl border border-gray-200 bg-white/80 shadow-sm sm:w-28'
                                  controls={false}
                                />
                              </Tooltip>
                            )}
                          />

                          <Controller
                            name={`units.${index}.description`}
                            control={control}
                            render={({ field }) => (
                              <Tooltip
                                title={
                                  errors?.units?.[index]?.description?.message
                                }
                                open={!!errors?.units?.[index]?.description}
                                color='orange'
                                placement='bottom'
                              >
                                <Input
                                  {...field}
                                  className='h-11 w-full rounded-2xl border border-gray-200 bg-white/80 shadow-sm'
                                  placeholder='e.g. serving, cup, 100g'
                                />
                              </Tooltip>
                            )}
                          />
                        </div>

                        {index !== 0 && (
                          <div className='flex justify-end sm:justify-start'>
                            <Button danger onClick={() => remove(index)}>
                              <FaTrashAlt />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Radio.Group>

                <Button
                  onClick={handleAdd}
                  className='mt-3 flex items-center gap-2'
                >
                  <FiPlusSquare />
                  Add Serving Size
                </Button>
              </div>
            </div>
          </div>

          <div className='lg:col-span-7'>
            <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <p className='m-0 text-base font-semibold text-gray-900'>
                Nutritional Value
              </p>
              <Paragraph className='m-0 mt-1 text-sm text-gray-600'>
                Enter nutrition for the default serving size.
              </Paragraph>

              <div className='mt-4 flex flex-col gap-3'>
                {nutritionalValue.map((item, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <div className='flex w-4 justify-center'>
                      {index !== 0 ? (
                        <div
                          className='h-2 w-2 rounded-full'
                          style={{ backgroundColor: `${item.color}` }}
                        />
                      ) : null}
                    </div>

                    <div className='grid w-full grid-cols-12 items-center gap-2'>
                      <div className='col-span-6 text-sm text-gray-800 sm:col-span-7'>
                        <Typography className='m-0'>{item.label}:</Typography>
                      </div>
                      <div className='col-span-4 sm:col-span-3'>
                        <Controller
                          name={`nutrition.${item.key}`}
                          control={control}
                          render={({ field }) => (
                            <Tooltip
                              title={errors.nutrition?.[item.key]?.message}
                              trigger={['focus']}
                              color='orange'
                              placement='bottom'
                            >
                              <InputNumber
                                {...field}
                                type='number'
                                controls={false}
                                className='h-11 w-full rounded-2xl border border-gray-200 bg-white/80 text-gray-700 shadow-sm'
                              />
                            </Tooltip>
                          )}
                        />
                      </div>
                      <div className='col-span-2 text-right text-xs text-gray-500 sm:col-span-2'>
                        <Typography className='m-0'>{item.unit}</Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-6 rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
              <button
                type='button'
                className='flex w-full items-center justify-between gap-3 text-left'
                onClick={() => setShowOptional(!showOptional)}
              >
                <div>
                  <p className='m-0 text-base font-semibold text-gray-900'>
                    Optional Nutrition
                  </p>
                  <Paragraph className='m-0 mt-1 text-sm text-gray-600'>
                    Add more details if you have them.
                  </Paragraph>
                </div>
                <IoIosArrowForward
                  className={`shrink-0 transition-transform duration-300 ${
                    showOptional ? 'rotate-90' : 'rotate-0'
                  }`}
                  size={22}
                />
              </button>

              <AnimatePresence>
                {showOptional && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className='mt-4'
                  >
                    {nutritionFieldGroup.map((item, index) => (
                      <div key={index} className='mt-6 first:mt-0'>
                        {index !== 0 && (
                          <Typography className='mb-3 text-base font-semibold'>
                            {item.label1}
                          </Typography>
                        )}

                        <div className='flex flex-col gap-3'>
                          {item.field.map((value, indexVal) => {
                            if (
                              index !== 0 ||
                              ![0, 1, 2, 3].includes(indexVal)
                            ) {
                              return (
                                <div
                                  key={indexVal}
                                  className='grid grid-cols-12 items-center gap-2'
                                >
                                  <div className='col-span-6 text-sm text-gray-800 sm:col-span-7'>
                                    <Typography className='m-0'>
                                      {value.title}:
                                    </Typography>
                                  </div>
                                  <div className='col-span-4 sm:col-span-3'>
                                    <Controller
                                      name={`nutrition.${value.key}`}
                                      control={control}
                                      render={({ field }) => (
                                        <Tooltip
                                          title={
                                            errors.nutrition?.[value.key]
                                              ?.message
                                          }
                                          open={!!errors.nutrition?.[value.key]}
                                          color='orange'
                                          placement='bottom'
                                        >
                                          <InputNumber
                                            {...field}
                                            type='number'
                                            controls={false}
                                            className='h-11 w-full rounded-2xl border border-gray-200 bg-white/80 text-gray-700 shadow-sm'
                                          />
                                        </Tooltip>
                                      )}
                                    />
                                  </div>
                                  <div className='col-span-2 text-right text-xs text-gray-500 sm:col-span-2'>
                                    <Typography className='m-0'>
                                      {value.unit}
                                    </Typography>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className='sticky bottom-0 z-10 -mx-5 border-t border-gray-200/70 bg-white/80 px-5 py-4 backdrop-blur sm:-mx-7 sm:px-7'>
          <div className='flex flex-wrap justify-end gap-3'>
            <Button
              className='px-4 py-5 text-[16px]'
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                `flex w-[160px] items-center justify-center gap-2 border-none px-4 py-5 text-[16px] text-white ${
                  isLoading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-primary-400 hover:bg-primary-500'
                }`,
              )}
              onClick={handleSubmit(onSubmit)}
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
                  {currentCustomFood ? 'Save' : 'Create'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </HubPageShell>
  );
};

export default FoodCustomContent;
