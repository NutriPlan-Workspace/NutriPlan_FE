import React, { useState } from 'react';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import { RiErrorWarningLine } from 'react-icons/ri';
import { Button, Col, Row, Tooltip, Typography } from 'antd';

import { nutritionFormat, targetKeyMap } from '@/constants/nutritionFormat';
import { cn } from '@/helpers/helpers';
import { PieChart } from '@/molecules/PieChart';
import ModalNutritionDetail from '@/organisms/ModalNutritionDetail/ModalNutritionDetail';
import type { NutritionFields } from '@/types/food';
import type { NutritionGoal } from '@/types/user';
import { getInvalidNutritionKeys } from '@/utils/calculateNutrition';
import { roundNumber } from '@/utils/roundNumber';

const { Title } = Typography;

interface NutritionPopoverDayProps {
  title: string;
  nutritionData: NutritionFields | undefined;
  targetNutrition?: NutritionGoal;
  onClick?: () => void;
  isSingleDay?: boolean;
}

const NutritionPopoverDay: React.FC<NutritionPopoverDayProps> = ({
  title,
  nutritionData,
  targetNutrition,
  onClick,
  isSingleDay = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const invalidKeys = getInvalidNutritionKeys(nutritionData, targetNutrition);

  return (
    <div
      className={cn('flex flex-col items-center', {
        'w-[400px]': !isSingleDay,
      })}
    >
      <div
        className={cn(
          'relative w-full',
          isSingleDay
            ? 'bg-transparent'
            : 'bg-[url("https://res.cloudinary.com/dtwrwvffl/image/upload/v1742271174/qr8amnrc7vkbcy04ftty.jpg")] bg-cover bg-center',
        )}
      >
        <div className='flex w-full flex-col items-center gap-2 bg-white/85 pt-3.5 pb-2'>
          {!isSingleDay && (
            <HiOutlineX
              className='absolute top-[8px] right-[8px] cursor-pointer text-xl text-black'
              onClick={onClick}
            />
          )}
          <div className='bg-white shadow-[0_0_10px_10px_white]'>
            <Title
              className={cn(
                'm-0 text-center text-base leading-none text-black',
                {
                  'text-[12px] font-thin': isSingleDay,
                },
              )}
              level={5}
            >
              {title}
            </Title>
          </div>
          {nutritionData && (
            <PieChart
              className='rounded-[75px] bg-white shadow-[0_0_8px_8px_white]'
              nutritionData={nutritionData}
              size={isSingleDay ? 200 : 150}
              label={true}
            />
          )}
        </div>
      </div>
      {invalidKeys.length !== 0 && (
        <div className='flex items-center'>
          <p className='my-2 text-center text-[#8C5A09]'>
            Some targets are not being met
          </p>
          <RiErrorWarningLine className='ml-2 text-[20px] text-yellow-500' />
        </div>
      )}
      <div className='w-full p-3.5'>
        <Row className='w-full'>
          {/* CURRENT TOTAL */}
          <Col span={14} className='w-full'>
            <div className='align-center flex justify-center'>
              <Title
                className={cn(
                  'mb-0 text-center text-[14px] leading-[24px] text-black',
                  { 'text-[12px] font-thin': isSingleDay },
                )}
                level={5}
              >
                CURRENT TOTALS
              </Title>
            </div>
          </Col>
          {/* TARGET */}
          <Col span={10}>
            <div className='align-center flex justify-center gap-1'>
              <Title
                className={cn(
                  'mb-0 flex items-center gap-1 text-[14px] text-black',
                  { 'text-[12px] font-thin': isSingleDay },
                )}
                level={5}
              >
                TARGETS
              </Title>
              <Tooltip title='Adjust Targets'>
                <Button
                  size='small'
                  icon={
                    <HiOutlineAdjustments className='text-[1rem] transition-all duration-75' />
                  }
                  variant='text'
                  color='primary'
                  shape='circle'
                  className='text-primary hover:bg-primary-100 active:bg-primary-200 transition-text duration-200 hover:text-black'
                />
              </Tooltip>
            </div>
          </Col>
        </Row>
        {nutritionFormat.map((item, index) => (
          <div key={index}>
            {index === 4 && <br key={-1} />}
            <Row className='w-full'>
              <Col span={14} className='px-2'>
                <div className='flex justify-between'>
                  {['Carbs', 'Fats', 'Proteins'].includes(item.label) ? (
                    <div className='flex items-center gap-2'>
                      {item.label === 'Carbs' && (
                        <span className='h-3 w-3 rounded-full bg-yellow-500' />
                      )}
                      {item.label === 'Fats' && (
                        <span className='h-3 w-3 rounded-full bg-blue-500' />
                      )}
                      {item.label === 'Proteins' && (
                        <span className='h-3 w-3 rounded-full bg-purple-500' />
                      )}
                      <Typography
                        className={cn(
                          { 'text-[16px]': isSingleDay },
                          invalidKeys.includes(item.key) && 'text-[#8C5A09]',
                        )}
                      >
                        {item.label}
                      </Typography>
                    </div>
                  ) : (
                    <Typography
                      className={cn(
                        { 'text-[16px]': isSingleDay },
                        invalidKeys.includes(item.key)
                          ? 'text-[#8C5A09]'
                          : item.color,
                      )}
                    >
                      {item.label}
                    </Typography>
                  )}

                  <Typography
                    className={cn(
                      invalidKeys.includes(item.key)
                        ? 'text-[#8C5A09]'
                        : item.color,
                    )}
                  >
                    {nutritionData && roundNumber(nutritionData[item.key], 2)}
                    {item.unit}
                  </Typography>
                </div>
              </Col>

              <Col span={10}>
                <div className='flex justify-center'>
                  <Typography
                    className={cn(
                      invalidKeys.includes(item.key)
                        ? 'text-[#8C5A09]'
                        : item.color,
                    )}
                  >
                    {item.key === 'calories'
                      ? roundNumber(
                          isNaN(targetNutrition?.[targetKeyMap[item.key]])
                            ? 0
                            : targetNutrition?.[targetKeyMap[item.key]],
                          2,
                        )
                      : `${isNaN(targetNutrition?.[targetKeyMap[item.key]]?.from) ? '' : roundNumber(targetNutrition?.[targetKeyMap[item.key]]?.from, 2)} -
       ${isNaN(targetNutrition?.[targetKeyMap[item.key]]?.to) ? '' : roundNumber(targetNutrition?.[targetKeyMap[item.key]]?.to, 2)}`}
                    {isNaN(targetNutrition?.[targetKeyMap[item.key]]?.to)
                      ? ''
                      : item.unit}
                  </Typography>
                </div>
              </Col>
            </Row>
          </div>
        ))}
        <Button
          className='mt-3 w-full rounded-2xl border border-black/10 bg-white/60 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-white'
          onClick={() => setIsModalOpen(true)}
        >
          Detailed Nutrition Information
        </Button>
        <ModalNutritionDetail
          nutrition={nutritionData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type='day'
        />
      </div>
    </div>
  );
};

export default NutritionPopoverDay;
