import { FC } from 'react';
import { BsCheckLg } from 'react-icons/bs';

interface Props {
  visible: boolean
}

const CheckMark: FC<Props> = ({ visible }): JSX.Element | null => {
  if (!visible) return null

  return <div className='p-2 bg-opacity-75 rounded-full bg-action text-primary backdrop-blur-sm'>
    <BsCheckLg />
  </div>;
};

export default CheckMark;