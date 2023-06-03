import { FC } from 'react';
import NextImage from 'next/image';

export interface AuthorProfile {
  id: string;
  name: string;
  avatar: string;
  message: string;
}

interface Props {
  profile: AuthorProfile;
}

const AuthorInfo: FC<Props> = ({ profile }): JSX.Element => {
  const { id, name, message, avatar } = profile
  return <div className='flex p-2 border-2 rounded border-secondary-dark'>
    {/* Profile Icon */}
    <div className="w-12">
      <div className="relative aspect-square">
        <NextImage src={avatar} fill alt='profile-image' className='rounded' />
      </div>
    </div>
    {/* Profile Name, Message */}
    <div className='flex-1 ml-2'>
      <h4 className='font-semibold text-primary-dark dark:text-primary'>{name}</h4>
      <p className='text-primary-dark dark:text-primary opacity-90'>{message}</p>
    </div>
  </div>;
};

export default AuthorInfo;