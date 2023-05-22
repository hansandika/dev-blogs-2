import { FC, useCallback } from 'react';
import NextImage from 'next/image';
import classNames from 'classnames';
import { AiFillCaretDown } from 'react-icons/ai';

interface Props {
  lightOnly?: boolean;
  avatar?: string;
  nameInitial?: string;
}

const commonClasses = 'relative flex items-center justify-center rounded-full overflow-hidden w-8 h-8 select-none';

const ProfileHead: FC<Props> = ({ lightOnly, avatar, nameInitial }): JSX.Element => {
  const getStyle = useCallback(() => {
    if (lightOnly) return 'text-primary-dark bg-primary'
    return 'bg-primary-dark dark:bg-primary dark:text-primary-dark text-primary'
  }, [lightOnly])

  return <div className='flex items-center'>
    {/* image / name initial */}
    <div className={classNames(commonClasses, getStyle())}>
      {avatar ? <NextImage src={avatar} fill alt='avatar' sizes='(max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        33vw' /> :
        <>
          {nameInitial}
        </>
      }
    </div>
    {/* down icon */}
    <AiFillCaretDown className={lightOnly ? 'text-primary' : 'text-primary-dark dark:text-primary'} />
  </div>;
};

export default ProfileHead;