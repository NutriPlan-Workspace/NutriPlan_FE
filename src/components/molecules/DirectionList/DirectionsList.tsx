import { FC, useState } from 'react';
import { List } from 'antd';

interface DirectionsProps {
  directions: string[];
}

const DirectionsList: FC<DirectionsProps> = ({ directions }) => {
  const [completedItems, setCompletedItems] = useState<number[]>([]);

  const toggleCompleted = (index: number): void => {
    setCompletedItems((prev: number[]) =>
      prev.includes(index)
        ? prev.filter((i: number) => i !== index)
        : [...prev, index],
    );
  };

  return (
    <List
      header={
        <h3 className='gradient-list pb-0 text-xl font-semibold'>Directions</h3>
      }
      size='small'
      dataSource={directions}
      renderItem={(item, index) => (
        <List.Item
          className={`pt-0 pl-0 ${completedItems.includes(index) ? 'completed' : ''}`}
          onClick={() => toggleCompleted(index)}
          style={{ cursor: 'pointer' }}
        >
          <span>{item}</span>
        </List.Item>
      )}
      split={false}
      className='direction-list mt-6 text-justify'
    />
  );
};

export default DirectionsList;
