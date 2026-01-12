import React, { useRef, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { InputNumber, Popover, Slider } from 'antd';

import { NUTRITION_TARGET_MIN_GAP_COOLDOWN_MS } from '@/constants/nutritionTargets';

interface RangeSliderProps {
  color: string;
  title: string;
  value: { from: number; to: number };
  maxValue: number;
  onChange: (value: { from: number; to: number }) => void;
  isFilterCollection?: boolean;
  minGap?: number;
  minGapMessage?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  color,
  title,
  value,
  maxValue,
  onChange,
  isFilterCollection = false,
  minGap = 0,
  minGapMessage,
}) => {
  const lastWarnedAtRef = useRef<number>(0);
  const hideTimerRef = useRef<number | null>(null);
  const [minGapPopoverOpen, setMinGapPopoverOpen] = useState(false);

  const clamp = (num: number, min: number, max: number) =>
    Math.min(max, Math.max(min, num));

  const gapMessage = minGapMessage ?? `Range must be at least ${minGap}`;

  const warnIfNeeded = () => {
    const now = Date.now();
    if (now - lastWarnedAtRef.current < NUTRITION_TARGET_MIN_GAP_COOLDOWN_MS) {
      return;
    }
    lastWarnedAtRef.current = now;

    setMinGapPopoverOpen(true);
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setMinGapPopoverOpen(false);
      hideTimerRef.current = null;
    }, 1200);
  };

  const normalizeRange = (nextFrom: number, nextTo: number) => {
    const prevFrom = value?.from ?? 0;
    const prevTo = value?.to ?? 0;

    let from = clamp(nextFrom, 0, maxValue);
    let to = clamp(nextTo, 0, maxValue);

    if (to < from) {
      const tmp = from;
      from = to;
      to = tmp;
    }

    if (minGap > 0 && to - from < minGap) {
      const fromDelta = Math.abs(from - prevFrom);
      const toDelta = Math.abs(to - prevTo);

      if (fromDelta > toDelta) {
        from = clamp(to - minGap, 0, maxValue);
      } else {
        to = clamp(from + minGap, 0, maxValue);
      }

      warnIfNeeded();
    }

    return { from, to };
  };

  const handleSliderChange = (newValue: number[]) => {
    const next = normalizeRange(newValue[0], newValue[1]);
    onChange(next);
  };

  const handleFromChange = (val: number | null) => {
    const nextFrom = val ?? 0;
    const next = normalizeRange(nextFrom, value?.to ?? 0);
    onChange(next);
  };

  const handleToChange = (val: number | null) => {
    const nextTo = val ?? maxValue;
    const next = normalizeRange(value?.from ?? 0, nextTo);
    onChange(next);
  };

  return isFilterCollection ? (
    <div className='flex w-full flex-col'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <label className='text-sm font-semibold text-gray-900'>{title}</label>
        <div className='flex items-center gap-2'>
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.from}
            onChange={handleFromChange}
            controls={false}
            className='w-24'
          />
          <span className='text-xs font-semibold text-gray-400'>–</span>
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.to}
            onChange={handleToChange}
            controls={false}
            className='w-24'
          />
        </div>
      </div>

      <div className='mt-2'>
        <Popover
          open={minGapPopoverOpen}
          content={
            <div className='flex items-center gap-2'>
              <ExclamationCircleOutlined />
              <span>{gapMessage}</span>
            </div>
          }
          placement='bottom'
        >
          <div>
            <Slider
              range={{ draggableTrack: true }}
              min={0}
              max={maxValue}
              value={[value?.from, value?.to]}
              onChange={handleSliderChange}
              trackStyle={[{ backgroundColor: color }]}
              handleStyle={[{ borderColor: color }, { borderColor: color }]}
            />
          </div>
        </Popover>
      </div>
    </div>
  ) : (
    <div className='flex w-full flex-col gap-3 rounded-2xl border border-gray-100 bg-white/60 p-3 sm:flex-row sm:items-center sm:gap-4'>
      <label className='w-[92px] shrink-0 text-sm font-semibold text-gray-900'>
        {title}
      </label>

      <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
        <div className='min-w-0 flex-1'>
          <Popover
            open={minGapPopoverOpen}
            content={
              <div className='flex items-center gap-2'>
                <ExclamationCircleOutlined />
                <span>{gapMessage}</span>
              </div>
            }
            placement='bottom'
          >
            <div>
              <Slider
                range={{ draggableTrack: true }}
                min={0}
                max={maxValue}
                value={[value?.from, value?.to]}
                onChange={handleSliderChange}
                trackStyle={[{ backgroundColor: color }]}
                handleStyle={[{ borderColor: color }, { borderColor: color }]}
              />
            </div>
          </Popover>
        </div>

        <div className='flex items-center gap-2'>
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.from}
            onChange={handleFromChange}
            controls={false}
            className='w-24'
          />
          <span className='text-xs font-semibold text-gray-400'>–</span>
          <InputNumber
            min={0}
            max={maxValue}
            value={value?.to}
            onChange={handleToChange}
            controls={false}
            className='w-24'
          />
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
