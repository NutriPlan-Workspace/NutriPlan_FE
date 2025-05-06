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
    <div className='relative flex min-h-screen flex-col'>
      {/* Header */}
      <div className='sticky top-0 z-10 bg-white pt-2 pb-4 pl-[40px]'>
        <Button
          className='ml-[-15px] flex w-[100px] items-center gap-2 rounded-full border-none hover:bg-gray-100'
          onClick={() => {
            if (canGoBack) {
              router.history.back();
            }
          }}
        >
          <FaArrowLeft />
          <Paragraph className='m-0'>Cancel</Paragraph>
        </Button>
        <p className='mt-[10px] text-[27px]'>Create Custom Food</p>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto px-[40px] pb-[50px]'>
        <div className='mt-[20px] flex w-[800px] flex-col'>
          {/* Name */}
          <div className='mb-[12px] flex items-center'>
            <p className='m-0'>Name</p>
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
                    className='ml-auto w-[200px] rounded-sm border shadow-sm'
                  />
                </Tooltip>
              )}
            />
          </div>
          <Divider className='my-[12px]' />

          {/* Description */}
          <div className='mb-[12px] flex items-start'>
            <p className='m-0'>Description</p>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={3}
                  className='ml-auto w-[200px] resize-none rounded-sm border shadow-sm'
                />
              )}
            />
          </div>
          <Divider className='my-[12px]' />

          {/* Image */}
          <div className='mb-[12px] flex items-center'>
            <p className='m-0'>Image</p>
            <div className='ml-auto flex w-[200px] flex-col items-center gap-2'>
              <Image width={120} src={img} className='rounded-md' />
              <Button
                onClick={() => setUpload(!upload)}
                className='flex items-center gap-2'
              >
                <IoCloudUploadOutline />
                <Paragraph className='m-0'>Upload Image</Paragraph>
              </Button>
              <PopupUpload
                isModalOpen={upload}
                setModalOpen={setUpload}
                onUploaded={handleUploaded}
              />
            </div>
          </div>

          {/* Serving Size */}
          <div className='mt-10'>
            <p className='text-[25px]'>Serving Size</p>
            <Paragraph>
              For conversions to work, make sure the serving sizes represent
              equivalent amounts.
            </Paragraph>
            <div className='mt-4 ml-2'>
              <Radio.Group
                value={selectedIndex}
                onChange={handleChangeDefaultUnit}
              >
                {fields.map((field, index) => (
                  <div key={field.id} className='mb-2 flex items-center gap-2'>
                    <Radio value={index} />
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
                            className='w-20 rounded-sm border shadow-sm'
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
                          title={errors?.units?.[index]?.description?.message}
                          open={!!errors?.units?.[index]?.description}
                          color='orange'
                          placement='bottom'
                        >
                          <Input
                            {...field}
                            className='w-50 rounded-sm border shadow-sm'
                          />
                        </Tooltip>
                      )}
                    />

                    {index !== 0 && (
                      <Button danger onClick={() => remove(index)}>
                        <FaTrashAlt />
                      </Button>
                    )}
                  </div>
                ))}
              </Radio.Group>
              <Button
                onClick={handleAdd}
                className='mt-2 flex items-center gap-2'
              >
                <FiPlusSquare />
                Add Serving Size
              </Button>
            </div>
          </div>

          {/* Nutrition Value */}
          <div className='mt-10'>
            <p className='text-[25px]'>Nutritional Value</p>
            <div className='w-[400px]'>
              {nutritionalValue.map((item, index) => (
                <div key={index} className='mt-2'>
                  <div className='flex items-center'>
                    {index !== 0 ? (
                      <div
                        className='mr-1 h-2 w-2 rounded-full'
                        style={{ backgroundColor: `${item.color}` }}
                      ></div>
                    ) : (
                      <div className='mr-1 w-2'></div>
                    )}

                    <div className='flex w-full items-center'>
                      <div className='w-1/2'>
                        <Typography>{item.label}:</Typography>
                      </div>
                      <div className='w-1/4'>
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
                                className='w-full rounded-sm border border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              />
                            </Tooltip>
                          )}
                        />
                      </div>
                      <div className='w-1/6 pl-1'>
                        <Typography>{item.unit}</Typography>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Nutrition */}
          <div className='mt-10 w-[400px]'>
            <button
              className='flex cursor-pointer items-center gap-2 text-[25px] transition-all duration-300 hover:underline'
              onClick={() => setShowOptional(!showOptional)}
            >
              <span>Optional Nutrition Value</span>
              <IoIosArrowForward
                className={`transition-transform duration-300 ${
                  showOptional ? 'rotate-90' : 'rotate-0'
                }`}
                size={24}
              />
            </button>
            <AnimatePresence>
              {showOptional && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {nutritionFieldGroup.map((item, index) => (
                    <div key={index} className='mt-2'>
                      {index !== 0 && (
                        <Typography className='mb-2 text-[20px]'>
                          {item.label1}:
                        </Typography>
                      )}
                      {item.field.map((value, indexVal) => {
                        if (index !== 0 || ![0, 1, 2, 3].includes(indexVal)) {
                          return (
                            <div
                              key={indexVal}
                              className='mt-2 flex items-center'
                            >
                              <div className='w-1/2'>
                                <Typography>{value.title}:</Typography>
                              </div>
                              <div className='w-1/4'>
                                <Controller
                                  name={`nutrition.${value.key}`}
                                  control={control}
                                  render={({ field }) => (
                                    <Tooltip
                                      title={
                                        errors.nutrition?.[value.key]?.message
                                      }
                                      open={!!errors.nutrition?.[value.key]}
                                      color='orange'
                                      placement='bottom'
                                    >
                                      <InputNumber
                                        {...field}
                                        type='number'
                                        controls={false}
                                        className='w-full rounded-sm border border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                      />
                                    </Tooltip>
                                  )}
                                />
                              </div>
                              <div className='w-1/6 pl-1'>
                                <Typography>{value.unit}</Typography>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className='sticky bottom-0 z-10 bg-white py-4 shadow-inner'>
        <div className='flex w-[840px] justify-end gap-4'>
          <Button className='px-4 py-5 text-[16px]' onClick={handleCancelClick}>
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
                Create
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCustomContent;
