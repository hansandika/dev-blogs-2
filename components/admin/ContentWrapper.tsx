import Link from 'next/link';
import { FC, ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  seeAllRoute: string;
}

const ContentWrapper: FC<Props> = ({ title, children, seeAllRoute }): JSX.Element => {
  return <div className='flex flex-col min-w-[300px]'>
    <h3 className='py-2 text-2xl font-semibold transition text-primary-dark dark:text-primary'>{title}</h3>
    <div className='flex flex-col justify-between flex-1 p-3 border-2 rounded border-secondary-dark '>
      <div className='space-y-5'>
        {children}
      </div>
      <div className="self-end mt-2 text-right">
        <Link href={seeAllRoute} className='transition text-primary-dark dark:text-primary hover:underline'>See All</Link>
      </div>
    </div>
  </div>;
};

export default ContentWrapper;