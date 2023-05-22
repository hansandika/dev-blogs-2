import { FC, ReactNode } from 'react';
import AppHead from '../common/AppHead';
import UserNav from '../common/nav/UserNav';

interface Props {
  title?: string;
  meta?: string;
  children: ReactNode
}

const DefaultLayout: FC<Props> = ({ children, title, meta }): JSX.Element => {
  return <>
    <AppHead title={title} meta={meta} />
    <div className="min-h-screen transition bg-primary dark:bg-primary-dark">
      <UserNav />

      <div className='max-w-4xl mx-auto'>
        {children}
      </div>
    </div>
  </>;
};

export default DefaultLayout;