import { FC } from 'react';
import ModalContainer, { ModalProps } from './ModalContainer';
import { ImSpinner3 } from 'react-icons/im'
import classNames from 'classnames';

interface Props extends ModalProps {
  title: string;
  subtitle: string;
  busy?: boolean;
  onCancel?(): void;
  onConfirm?(): void;
}

const commonBtnClass = 'px-3 py-1 text-white rounded'

const ConfirmModal: FC<Props> = ({ title, subtitle, busy = false, onCancel, onConfirm, visible, onClose }): JSX.Element => {
  return <ModalContainer visible={visible} onClose={onClose}>
    <div className='p-3 rounded bg-primary-dark dark:bg-primary max-w-[380px]'>
      {/* Title */}
      <p className='text-lg font-semibold dark:text-primary-dark text-primary'>
        {title}
      </p>
      {/* Subtitle */}
      <p className='dark:text-primary-dark text-primary'>
        {subtitle}
      </p>
      {/* Button */}
      {busy ? (
        <p className='flex items-center pt-2 space-x-2 dark:text-primary-dark text-primary'>
          <ImSpinner3 className='animate-spin' />
          <span>
            Please Wait...
          </span>
        </p>
      ) : (
        <div className="flex items-center pt-2 space-x-2">
          <button className={classNames(commonBtnClass, 'bg-red-500')} onClick={onConfirm}>Confirm</button>
          <button className={classNames(commonBtnClass, 'bg-blue-500')} onClick={onCancel}>Cancel</button>
        </div>
      )}

    </div>
  </ModalContainer>;
};

export default ConfirmModal;