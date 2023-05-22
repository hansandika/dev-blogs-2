import { FC, useState, useEffect } from 'react';
import { validateUrl } from '../EditorUtils';

interface Props {
  visible: boolean;
  onSubmit(link: linkOption): void;
  initialState?: linkOption;
}

export type linkOption = {
  url: string;
  openInNewTab: boolean;
}

const defaultLink = {
  url: '',
  openInNewTab: false
}

const LinkForm: FC<Props> = ({ visible, onSubmit, initialState }): JSX.Element | null => {
  const [link, setLink] = useState<linkOption>(defaultLink);

  const handleSubmit = () => {
    onSubmit({ ...link, url: validateUrl(link.url) });
    resetForm();
  }

  const resetForm = () => {
    setLink({ ...defaultLink })
  }

  useEffect(() => {
    if (initialState) setLink({ ...initialState })
  }, [initialState]);

  if (!visible) return null

  return <div className='p-2 rounded shadow-sm bg-primary dark:bg-primary-dark shadow-secondary-dark'>
    <input type="text" className='p-2 transition bg-transparent border-2 rounded border-secondary-dark focus:border-primary-dark dark:focus:border-primary text-primary-dark dark:text-primary' placeholder='https://example.com' autoFocus
      value={link.url} onChange={({ target }) => { setLink({ ...link, url: target.value }) }} />
    <div className="flex items-center mt-2 space-x-2">
      <input type="checkbox" id="open-in-new-tab" checked={link.openInNewTab} onChange={({ target }) => { setLink({ ...link, openInNewTab: target.checked }) }} />
      <label htmlFor="open-in-new-tab" className='text-secondary-dark dark:text-secondary-light'>Open in new tab</label>
      <div className="flex-1 text-right">
        <button onClick={handleSubmit} className='px-2 py-1 text-sm rounded bg-action text-primary'>Apply</button>
      </div>
    </div>
  </div>;
};

export default LinkForm;