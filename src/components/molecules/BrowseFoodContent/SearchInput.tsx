import React from 'react';
import { GiMeal } from 'react-icons/gi';
import { IoSearch } from 'react-icons/io5';
import { Input as AntdInput } from 'antd';

import { Button } from '@/atoms/Button';

const SearchInput: React.FC = () => (
  <div className='flex w-full justify-center'>
    <div className='flex items-center gap-4'>
      <Button className='flex h-[45px] items-center gap-2 border border-black text-gray-600'>
        <GiMeal className='h-6 w-6 text-gray-500' />
        Filters
      </Button>

      <AntdInput
        placeholder='Search Foods...'
        suffix={<IoSearch className='h-5 w-5 text-gray-500' />}
        className='h-[45px] w-[350px] rounded-full border border-black px-4 py-1 italic'
      />
    </div>
  </div>
);

export default SearchInput;
