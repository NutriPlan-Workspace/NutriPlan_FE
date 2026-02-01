import React, { useMemo, useState } from 'react';

import type { Category } from '@/types/category';

export type CategoryMultiSelectProps = {
  options: Category[];
  value: number[];
  onChange: (next: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Search categories...',
  disabled,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return options.filter((option) => {
      if (value.includes(option.value)) return false;
      if (!lower) return true;
      return option.label.toLowerCase().includes(lower);
    });
  }, [options, query, value]);

  const handleRemove = (id: number) => {
    onChange(value.filter((item) => item !== id));
  };

  const handleAdd = (id: number) => {
    onChange([...value, id]);
    setQuery('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && filteredOptions.length) {
      event.preventDefault();
      handleAdd(filteredOptions[0].value);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2'>
        {value.map((selected) => {
          const label = options.find(
            (option) => option.value === selected,
          )?.label;
          return (
            <span
              key={selected}
              className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'
            >
              {label ?? selected}
              <button
                type='button'
                className='text-emerald-500 hover:text-emerald-700'
                onClick={() => handleRemove(selected)}
                disabled={disabled}
                aria-label='Remove category'
              >
                ×
              </button>
            </span>
          );
        })}
        <input
          className='min-w-[120px] flex-1 border-none text-sm outline-none'
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className='mt-2 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm'>
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type='button'
              className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50'
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleAdd(option.value)}
              disabled={disabled}
            >
              <span>{option.label}</span>
              <span className='text-xs text-slate-400'>{option.group}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMultiSelect;
