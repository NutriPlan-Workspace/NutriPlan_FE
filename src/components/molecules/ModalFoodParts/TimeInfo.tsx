import React from 'react';

interface TimeInfoProps {
  prepTime: number;
  cookTime: number;
}

const TimeInfo: React.FC<TimeInfoProps> = ({ prepTime, cookTime }) => (
  <div>
    <span className='font-medium'>Prep Time: </span>
    <span>{prepTime} minutes</span>
    <br></br>
    <span className='font-medium'>Cook Time: </span>
    <span>{cookTime} minutes</span>
  </div>
);

export default TimeInfo;
