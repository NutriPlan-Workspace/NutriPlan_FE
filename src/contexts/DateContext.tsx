import React, { createContext, useContext, useEffect, useState } from 'react';

import { VIEW_MODE_KEY } from '@/constants/localStorage';
import { DateRange } from '@/types/date';
import { getWeekRange } from '@/utils/dateUtils';

interface DateContextType {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  rangeDate: DateRange;
  setRangeDate: React.Dispatch<React.SetStateAction<DateRange>>;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    try {
      return localStorage.getItem(VIEW_MODE_KEY) || '2';
    } catch {
      return '2';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_KEY, selectedPlan);
    } catch {
      // ignore
    }
  }, [selectedPlan]);
  const [rangeDate, setRangeDate] = useState<DateRange>(
    getWeekRange(selectedDate),
  );

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedPlan,
        setSelectedPlan,
        rangeDate,
        setRangeDate,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = (): DateContextType => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};
