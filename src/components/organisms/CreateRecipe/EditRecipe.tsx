import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useCanGoBack, useParams, useRouter } from '@tanstack/react-router';
import { Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { useGetFoodByIdQuery } from '@/redux/query/apis/food/foodApis';
import { removeCurrentCustomFood } from '@/redux/slices/food';

import EditRecipeForm from './EditRecipeForm';

const { Paragraph } = Typography;

const EditRecipe: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const { id } = useParams({ strict: false });
  const { data } = useGetFoodByIdQuery(id!);

  return (
    <div className='flex flex-col gap-4'>
      <div className='fixed top-0 z-10 w-full bg-white pt-2 pb-10 pl-[40px]'>
        <Button
          className='ml-[-15px] flex w-[100px] items-center gap-2 rounded-full border-none hover:bg-gray-100'
          onClick={() => {
            dispatch(removeCurrentCustomFood());
            if (canGoBack) {
              router.history.back();
            }
          }}
        >
          <FaArrowLeft />
          <Paragraph className='m-0'>Cancel</Paragraph>
        </Button>

        <p className='mt-[10px] text-[27px]'>
          Edit &quot;{data?.data.mainFood.name}&quot;
        </p>
      </div>

      <div className='pt-[120px]'>{data && <EditRecipeForm data={data} />}</div>
    </div>
  );
};

export default EditRecipe;
