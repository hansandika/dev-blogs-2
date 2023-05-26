import classNames from 'classnames';
import { FC, useCallback } from 'react';
import NextImage from 'next/image';

interface Props {
  avatar?: string;
  nameInitial?: string;
  lightOnly?: boolean;
}

const commonClasses = 'relative flex items-center justify-center rounded-full overflow-hidden w-8 h-8 select-none';

const ProfileIcon: FC<Props> = ({ avatar, nameInitial, lightOnly }): JSX.Element => {
  const getStyle = useCallback(() => {
    if (lightOnly) return 'text-primary-dark bg-primary'
    return 'bg-primary-dark dark:bg-primary dark:text-primary-dark text-primary'
  }, [lightOnly])

  return <div className={classNames(commonClasses, getStyle())}>
    {avatar ? <NextImage src={avatar} fill alt='avatar' sizes='(max-width: 768px) 100vw,
    (max-width: 1200px) 50vw,
    33vw' /> :
      <>
        {nameInitial}
      </>
    }
  </div>;
};

export default ProfileIcon;