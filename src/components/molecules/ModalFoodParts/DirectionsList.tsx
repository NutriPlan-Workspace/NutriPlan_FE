import { FC } from 'react';
import { List } from 'antd';

interface DirectionsProps {
  directions: string[];
}

const DirectionsList: FC<DirectionsProps> = ({ directions }) => (
  <List
    header={<h3 className='text-lg font-semibold'>Directions</h3>}
    dataSource={directions}
    renderItem={(item, index) => (
      <List.Item>
        {index + 1}. {item}
      </List.Item>
    )}
    split={false}
  />
);

export default DirectionsList;
