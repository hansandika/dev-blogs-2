import { FC } from 'react';
import { BiLoader } from 'react-icons/bi';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

interface Props {
  busy?: boolean;
  label?: string;
  liked?: boolean;
  onClick?(): void;
}

const LikeHeart: FC<Props> = ({ label, busy = false, liked = false, onClick }): JSX.Element => {
  const likeIcon = liked ? <BsHeartFill color='#4790FD' /> : <BsHeart />

  return <button type='button' className='flex items-center space-x-2 outline-none text-primary-dark dark:text-primary' onClick={onClick}>
    {busy ? <BiLoader className="animate-spin" /> : likeIcon}
    <span className='hover:underline'>{label}</span>
  </button>;
};

export default LikeHeart;