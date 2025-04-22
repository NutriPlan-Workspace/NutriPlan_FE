import React from 'react';
import {
  HiOutlineAdjustments,
  HiOutlineChevronDown,
  HiOutlineClipboardList,
  HiOutlineX,
} from 'react-icons/hi';
import { Button, Col, Row, Tooltip, Typography } from 'antd';

import { nutritionFormat, targetKeyMap } from '@/constants/nutritionFormat';
import { cn } from '@/helpers/helpers';
import { PieChart } from '@/molecules/PieChart';
import type { NutritionSummaryFields } from '@/types/mealPlan';
import type { NutritionGoal } from '@/types/user';
import { roundNumber } from '@/utils/roundNumber';

const { Title } = Typography;

interface NutritionPopoverDayProps {
  title: string;
  nutritionData: NutritionSummaryFields | undefined;
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
}) => (
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
            className='absolute top-[8px] right-[8px] text-xl text-black'
            onClick={onClick}
          />
        )}
        <div className='bg-white shadow-[0_0_10px_10px_white]'>
          <Title
            className={cn('m-0 text-center text-base leading-none text-black', {
              'text-[12px] font-thin': isSingleDay,
            })}
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
                color='gold'
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
                <Typography
                  className={cn({ 'text-[16px]': isSingleDay }, item.color)}
                >
                  {item.label}:
                </Typography>
                <Typography className={item.color}>
                  {nutritionData && roundNumber(nutritionData[item.key], 2)}
                  {item.unit}
                </Typography>
              </div>
            </Col>

            <Col span={10}>
              <div className='flex justify-center'>
                <Typography className='text-black'>
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

      <br />
      <Button
        variant='filled'
        color='gold'
        className='w-full border-black bg-white text-black transition-all duration-300 hover:bg-gray-500 hover:text-white active:bg-gray-700'
      >
        <HiOutlineClipboardList />
        More detailed nutrition
        <HiOutlineChevronDown />
      </Button>
    </div>
  </div>
);

export default NutritionPopoverDay;
