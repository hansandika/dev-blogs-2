import { FC } from 'react';
import { BsCardImage } from 'react-icons/bs';
import CustomImage from './Image';

interface Props {
  images: {
    src: string
  }[];
  onSelect(src: string): void;
  uploading?: boolean,
  selectedImage?: string
}


const Gallery: FC<Props> = ({ images, uploading = false, selectedImage = '', onSelect }): JSX.Element => {
  return <div className='flex flex-wrap'>
    {uploading && <div className="flex flex-col items-center justify-center p-2 rounded basis-1/4 aspect-square bg-secondary-light text-primary-dark animate-pulse">
      <BsCardImage size={60} />
      <p>Uploading</p>
    </div>}
    {images.map(({ src }, idx) => {
      return <div key={`${src}-${idx}`} className="p-2 basis-1/4">
        <CustomImage src={src} selected={selectedImage === src} onClick={() => { onSelect(src) }} alt='gallery-image' />
      </div>
    })}
  </div>;
};

export default Gallery;