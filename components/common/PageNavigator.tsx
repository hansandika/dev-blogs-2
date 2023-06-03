import { FC, MouseEventHandler } from 'react';

interface Props {
  onPrevClick?(): void;
  onNextClick?(): void;
}

const PageNavigator: FC<Props> = ({ onPrevClick, onNextClick }): JSX.Element => {
  return <div className='flex items-center space-x-3'>
    <Button title='Prev' onClick={onPrevClick} />
    <Button title='Next' onClick={onNextClick} />
  </div>;
};

const Button: FC<{ title: string; onClick?: MouseEventHandler }> = ({ title, onClick }) => {
  return <button onClick={onClick} className='transition text-primary-dark dark:text-primary hover:underline'>
    {title}
  </button>
}

export default PageNavigator;