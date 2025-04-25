import React from 'react';
import { Col, InputNumber, Row, Slider } from 'antd';

interface RangeSliderProps {
  color: string;
  title: string;
  value: { from: number; to: number };
  maxValue: number;
  onChange: (value: { from: number; to: number }) => void;
  isFilterCollection?: boolean;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  color,
  title,
  value,
  maxValue,
  onChange,
  isFilterCollection = false,
}) => {
  const handleSliderChange = (newValue: number[]) => {
    onChange({ from: newValue[0], to: newValue[1] });
  };

  return isFilterCollection ? (
    <div className='flex w-full flex-col'>
      <div className='flex items-center justify-between pr-3'>
        <label className='font-medium'>{title}</label>
        <div className='flex gap-1'>
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.from}
            onChange={(val) => onChange({ from: val ?? 0, to: value?.to })}
          />
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.to}
            onChange={(val) =>
              onChange({ from: value?.from, to: val ?? maxValue })
            }
          />
        </div>
      </div>
      <Row className='rounded-md'>
        <Col span={24}>
          <Slider
            range={{ draggableTrack: true }}
            min={0}
            max={maxValue}
            value={[value?.from, value?.to]}
            onChange={handleSliderChange}
            trackStyle={[{ backgroundColor: color }]}
            handleStyle={[{ borderColor: color }, { borderColor: color }]}
          />
        </Col>
      </Row>
    </div>
  ) : (
    <div className='flex w-full items-center justify-between'>
      <label className='w-[80px] font-medium'>{title}</label>
      <Row className='flex-1 rounded-md p-2'>
        <Col span={16} className='pr-4'>
          <Slider
            range={{ draggableTrack: true }}
            min={0}
            max={maxValue}
            value={[value?.from, value?.to]}
            onChange={handleSliderChange}
            trackStyle={[{ backgroundColor: color }]}
            handleStyle={[{ borderColor: color }, { borderColor: color }]}
          />
        </Col>
        <Col span={4} className='pl-2'>
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.from}
            onChange={(val) => onChange({ from: val ?? 0, to: value?.to })}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.to}
            onChange={(val) =>
              onChange({ from: value?.from, to: val ?? maxValue })
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default RangeSlider;
