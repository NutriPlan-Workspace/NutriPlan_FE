import React, { createContext, useContext, useState } from 'react';

type ScaleContextType = {
  amount: number;
  unit: string;
  conversionFactor: number;
  setAmount: (amount: number) => void;
  setUnit: (unit: string) => void;
  setConversionFactor: (factor: number) => void;
};

const ScaleContext = createContext<ScaleContextType | undefined>(undefined);

export const ScaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<string>('serving');
  const [conversionFactor, setConversionFactor] = useState<number>(100);

  return (
    <ScaleContext.Provider
      value={{
        amount,
        unit,
        conversionFactor,
        setAmount,
        setUnit,
        setConversionFactor,
      }}
    >
      {children}
    </ScaleContext.Provider>
  );
};

export const useScale = () => {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error('useScale must be used within a ScaleProvider');
  }
  return context;
};
