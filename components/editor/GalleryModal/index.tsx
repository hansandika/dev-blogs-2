import Image from 'next/image';
import { ChangeEventHandler, FC, useState, useCallback } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ActionButton from '../../common/ActionButton';
import ModalContainer, { ModalProps } from '../../common/ModalContainer';
import Gallery from './Gallery';

export interface ImageSelectionResult {
  src: string;
  altText: string;
}

interface Props extends ModalProps {
  images: { src: string }[];
  uploading?: boolean;
  onFileSelect(images: File): void;
  onSelect(result: ImageSelectionResult): void
}

const GalleryModal: FC<Props> = ({ visible, images, uploading, onFileSelect, onSelect, onClose }): JSX.Element => {

  const [selectedImage, setSelectedImage] = useState<string>('')
  const [altText, setAltText] = useState("");

  const handleClose = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const handleOnImageChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { files } = target;
    if (!files) return

    const file = files[0];
    if (!file.type.includes('image')) return handleClose()

    onFileSelect(file)
  }

  const handleSelection = () => {
    if (!selectedImage) return handleClose()
    onSelect({ src: selectedImage, altText })
    handleClose()
  }

  return <ModalContainer visible={visible} onClose={onClose}>
    <div className="max-w-4xl p-2 rounded bg-primary-dark dark:bg-primary">
      <div className="flex">
        {/* Gallery */}
        <div className="basis-[75%] max-h-[450px] overflow-y-auto custom-scroll-bar">
          <Gallery images={images} onSelect={(src) => {
            setSelectedImage(src)
          }} selectedImage={selectedImage} uploading={uploading} />
        </div>

        {/* Image Selection & Upload  */}
        <div className="px-2 basis-1/4">
          <div className="space-y-4">
            <div>
              <input onChange={handleOnImageChange} hidden type="file" id="image-input" />
              <label htmlFor="image-input">
                <div className='flex items-center justify-center w-full p-2 space-x-2 border-2 rounded cursor-pointer border-action text-action'>
                  <AiOutlineCloudUpload />
                  <span>Upload Image</span>
                </div>
              </label>
            </div>
            {selectedImage &&
              <>
                <textarea className='w-full h-32 p-1 bg-transparent border-2 rounded resize-none border-secondary-dark focus:ring-1 text-primary dark:text-primary-dark' placeholder='Alt Text' value={altText} onChange={({ target }) => {
                  setAltText(target.value)
                }}></textarea>

                <ActionButton title="Select" onClick={handleSelection} />

                <div className="relative aspect-video bg-png-pattern">
                  <Image src={selectedImage} fill alt="selected-image" className='object-contain' />
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  </ModalContainer>;
};

export default GalleryModal;