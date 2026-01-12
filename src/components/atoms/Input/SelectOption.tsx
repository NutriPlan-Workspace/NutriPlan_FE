import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

import { ACTIVITY_LEVEL } from '@/constants/user';
import { cn } from '@/helpers/helpers';

interface ActivityLevelSelectProps {
  defaultSelectedKey?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const ActivityLevelSelect: React.FC<ActivityLevelSelectProps> = ({
  defaultSelectedKey,
  onChange,
  className,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(
    ACTIVITY_LEVEL[0]?.key || '',
  );

  useEffect(() => {
    if (defaultSelectedKey) {
      const matchedLevel = ACTIVITY_LEVEL.find(
        (level) => level.key === defaultSelectedKey,
      );
      if (matchedLevel) {
        setSelectedLevel(matchedLevel.key);
      }
    }
  }, [defaultSelectedKey]);

  const handleChange = (value: string) => {
    setSelectedLevel(value);
    onChange?.(value);
  };

  return (
    <Select
      className={cn(
        'h-[40px] w-[340px] rounded-lg border border-gray-300 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
        className,
      )}
      value={selectedLevel}
      onChange={handleChange}
      placeholder='Select activity level'
      dropdownStyle={{ borderRadius: '0.5rem', padding: '0.5rem' }}
    >
      {ACTIVITY_LEVEL.map((level) => (
        <Select.Option key={level.key} value={level.key}>
          <div className='flex items-center justify-between'>
            <span>{level.label}</span>
            <span className='text-lg'>{level.icon}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default ActivityLevelSelect;
