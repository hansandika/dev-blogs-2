import { FC } from 'react';
import NextImage from 'next/image'
import CheckMark from '../../common/CheckMark';

interface Props {
  src: string;
  alt: string
  selected?: boolean;
  onClick?(): void;
}

const Image: FC<Props> = ({ src, selected, alt, onClick }): JSX.Element => {
  return <div onClick={onClick} className='relative overflow-hidden rounded cursor-pointer'>
    <NextImage src={src} width={200} height={200} alt={alt} className='object-cover transition bg-secondary-light hover:scale-110 h-[200px] w-[200px]' />
    <div className="absolute top-2 left-2">
      <CheckMark visible={selected || false} />
    </div>
  </div>;
};

export default Image;