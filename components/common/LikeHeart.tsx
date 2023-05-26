import { FC } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

interface Props {
  label?: string;
  liked?: boolean;
  onClick?(): void;
}

const LikeHeart: FC<Props> = ({ label, liked = false, onClick }): JSX.Element => {
  return <button type='button' className='flex items-center space-x-2 outline-none text-primary-dark dark:text-primary' onClick={onClick}>
    {liked ? <BsHeartFill color='#4790FD' /> : <BsHeart />}
    <span>{label}</span>
  </button>;
};

export default LikeHeart;