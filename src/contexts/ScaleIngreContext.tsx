import React, { createContext, useContext, useState } from 'react';

type ScaleContextType = {
  amountIngre: number;
  unitIngre: string;
  conversionFactorIngre: number;
  setAmountIngre: (amount: number) => void;
  setUnitIngre: (unit: string) => void;
  setConversionFactorIngre: (factor: number) => void;
};

const ScaleContext = createContext<ScaleContextType | undefined>(undefined);

export const ScaleProviderIngre: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [amountIngre, setAmountIngre] = useState<number>(1);
  const [unitIngre, setUnitIngre] = useState<string>('serving');
  const [conversionFactorIngre, setConversionFactorIngre] =
    useState<number>(100);

  return (
    <ScaleContext.Provider
      value={{
        amountIngre,
        unitIngre,
        conversionFactorIngre,
        setAmountIngre,
        setUnitIngre,
        setConversionFactorIngre,
      }}
    >
      {children}
    </ScaleContext.Provider>
  );
};

export const useScaleIngre = () => {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error('useScale must be used within a ScaleProvider');
  }
  return context;
};
