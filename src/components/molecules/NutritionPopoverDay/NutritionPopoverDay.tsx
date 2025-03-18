import React from 'react';
import {
  HiOutlineAdjustments,
  HiOutlineChevronDown,
  HiOutlineClipboardList,
  HiOutlineX,
} from 'react-icons/hi';
import { Button, Col, Divider, Row, Tooltip, Typography } from 'antd';

import { nutritionFormat } from '@/constants/nutritionFormat';
import { PieChart } from '@/molecules/PieChart';
import type { NutritionFields } from '@/types/food';
import { roundNumber } from '@/utils/roundNumber';

const { Title } = Typography;

interface NutritionPopoverDayProps {
  title: string;
  nutritionData: NutritionFields;
  onClick?: () => void;
}

const NutritionPopoverDay: React.FC<NutritionPopoverDayProps> = ({
  title,
  nutritionData,
  onClick,
}) => (
  <div className='relative flex w-[400px] flex-col items-center'>
    <div className='w-full items-center bg-[url("https://res.cloudinary.com/dtwrwvffl/image/upload/v1742271174/qr8amnrc7vkbcy04ftty.jpg")] bg-cover'>
      <div className='relative flex w-full flex-col items-center gap-2 bg-white/85 pt-1 pb-2'>
        <HiOutlineX
          className='absolute top-[-5px] right-[-5px] text-xl text-black'
          onClick={onClick}
        />
        <div className='bg-white shadow-[0_0_10px_10px_white]'>
          <Title
            className='title m-0 text-center text-base leading-none text-black'
            level={5}
          >
            {title}
          </Title>
        </div>
        <PieChart
          className='rounded-[75px] bg-white shadow-[0_0_8px_8px_white]'
          nutritionData={nutritionData}
          size={150}
          label={true}
        />
      </div>
    </div>
    <Divider className='mx-0 my-1.5 border-[#fff]' />
    <Row className='w-full'>
      {/* CURRENT TOTAL */}
      <Col span={14} className='w-full'>
        <div className='align-center flex justify-center'>
          <Title
            className='mb-0 text-center text-[14px] leading-[24px] text-black'
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
            className='mb-0 flex items-center gap-1 text-[14px] text-black'
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
      <>
        {index === 4 && <br />}
        <Row key={item.key} className='w-full'>
          <Col span={14} className='px-2'>
            <div className='flex justify-between'>
              <Typography className={item.color}>{item.label}:</Typography>
              <Typography className={item.color}>
                {roundNumber(nutritionData[item.key], 2)}
                {item.unit}
              </Typography>
            </div>
          </Col>
          <Col span={10}>
            <div className='flex justify-center'>
              <Typography className='text-black'>
                {roundNumber(nutritionData[item.key], 2)}
                {item.unit}
              </Typography>
            </div>
          </Col>
        </Row>
      </>
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
);

export default NutritionPopoverDay;
