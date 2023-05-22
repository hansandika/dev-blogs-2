import classNames from 'classnames';
import { FC, ChangeEventHandler, useState, useEffect } from 'react';
import NextImage from 'next/image';

interface Props {
  initialValue?: string
  onChange(file: File): void
}

const commonThumbnailStyle = 'border border-dashed border-secondary-dark flex items-center justify-center rounded cursor-pointer aspect-video text-secondary-dark dark:text-secondary-light'

const ThumbnailSelector: FC<Props> = ({ initialValue, onChange }): JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { files } = target;
    if (!files) return;

    const file = files[0]

    setSelectedThumbnail(URL.createObjectURL(file))
    onChange(file)
  }

  useEffect(() => {
    if (typeof (initialValue) === 'string') setSelectedThumbnail(initialValue)

  }, [initialValue])

  return <div className='w-32'>
    <input type="file" accept='image/jpg, image/png, image/jpeg' id='thumbnail' onChange={handleChange} hidden />
    <label htmlFor="thumbnail">
      {selectedThumbnail ?
        (<NextImage src={selectedThumbnail} alt='selected-thumbnail' className={classNames(commonThumbnailStyle, 'object-cover')} width={'400'} height={'400'} />) :
        (<PosterUI label='Thumbnail' />)
      }
    </label>
  </div>;
};

const PosterUI: FC<{ label: string, className?: string }> = ({ label, className }) => {
  return <div className={classNames(commonThumbnailStyle, className)}>
    <span>{label}</span>
  </div>
}

export default ThumbnailSelector;