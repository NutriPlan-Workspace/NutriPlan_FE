import React from 'react';

import { MenuOption } from '@/atoms/MenuOption';
import { getWeekOptions } from '@/constants/plans';
import { PLAN_TYPES } from '@/constants/plans';
import { useDate } from '@/contexts/DateContext';
import { getWeekRange } from '@/utils/dateUtils';

interface WeekSelectorProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  setShowRangePicker: (show: boolean) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  selectedOption,
  setSelectedOption,
  setShowRangePicker,
}) => {
  const { selectedDate, setRangeDate } = useDate();
  const newDate = new Date();

  const { from: startLastWeek, to: endLastWeek } = getWeekRange(newDate, -1);
  const { from: startCurrentWeek, to: endCurrentWeek } = getWeekRange(
    newDate,
    0,
  );
  const { from: startNextWeek, to: endNextWeek } = getWeekRange(newDate, 1);

  const weekOptions = getWeekOptions(
    startLastWeek!,
    endLastWeek!,
    startCurrentWeek!,
    endCurrentWeek!,
    startNextWeek!,
    endNextWeek!,
  );

  const handleSelectOption = (selectedKey: string) => {
    setSelectedOption(selectedKey);

    if (selectedKey === PLAN_TYPES.WEEKLY_VIEW) {
      setShowRangePicker(true);
      return;
    }

    const { from, to } = getWeekRange(selectedDate, parseInt(selectedKey) - 1);
    setRangeDate({ from, to });
  };

  return (
    <MenuOption
      items={weekOptions}
      onSelect={handleSelectOption}
      selectedOption={selectedOption}
    />
  );
};

export default WeekSelector;
