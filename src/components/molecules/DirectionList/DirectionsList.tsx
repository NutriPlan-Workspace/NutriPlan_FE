import { FC } from 'react';
import { List } from 'antd';

interface DirectionsProps {
  directions: string[];
}

const DirectionsList: FC<DirectionsProps> = ({ directions }) => (
  <List
    header={<h3 className='text-xl font-semibold'>Directions</h3>}
    size='small'
    dataSource={directions}
    renderItem={(item, index) => (
      <List.Item className='pt-0 pl-0'>
        {index + 1}. {item}
      </List.Item>
    )}
    split={false}
    className='pt-3 text-justify'
  />
);

export default DirectionsList;
