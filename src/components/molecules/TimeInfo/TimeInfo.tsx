import React from 'react';
import { MdAccessTime } from 'react-icons/md';
import { PiCookingPot, PiKnifeFill } from 'react-icons/pi';

interface TimeInfoProps {
  prepTime: number;
  cookTime: number;
}

interface TimeItem {
  label: string;
  value: number;
  icon: React.ReactElement;
}

const SHORT_TIME_THRESHOLD = 10;
const MEDIUM_TIME_THRESHOLD = 20;

const getTimeColorClass = (time: number) => {
  if (time <= SHORT_TIME_THRESHOLD) return 'bg-shortTime';
  if (time <= MEDIUM_TIME_THRESHOLD) return 'bg-mediumTime';
  return 'bg-longTime';
};

const TimeInfo: React.FC<TimeInfoProps> = ({ prepTime, cookTime }) => {
  const totalTime = prepTime + cookTime;

  const shownItems: TimeItem[] = [];

  if (prepTime > 0) {
    shownItems.push({
      label: 'Prep Time',
      value: prepTime,
      icon: <PiKnifeFill className='text-lg' />,
    });
  }

  if (cookTime > 0) {
    shownItems.push({
      label: 'Cook Time',
      value: cookTime,
      icon: <PiCookingPot className='text-lg' />,
    });
  }

  const finalItems: (TimeItem | 'divider')[] = [...shownItems];

  if (totalTime > 0 && shownItems.length > 0) {
    finalItems.push('divider');
    finalItems.push({
      label: 'Total Time',
      value: totalTime,
      icon: <MdAccessTime className='text-lg' />,
    });
  }

  if (finalItems.length === 0) return null;

  return (
    <div className='flex items-stretch gap-4'>
      {finalItems.map((item, index) =>
        item === 'divider' ? (
          <div
            key={`divider-${index}`}
            className='mx-1 border-l border-gray-300'
          />
        ) : (
          <div
            key={item.label}
            className='w-23 overflow-hidden rounded-lg border-1 border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md'
          >
            <div className={`${getTimeColorClass(item.value)} px-1 py-1`}>
              <h4 className='text-center text-xs font-semibold text-gray-700'>
                {item.label}
              </h4>
            </div>
            <div className='flex items-center justify-center gap-1 px-1 py-1 text-sm font-medium text-gray-700'>
              <span>{item.value} mins</span>
              {item.icon}
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default TimeInfo;
