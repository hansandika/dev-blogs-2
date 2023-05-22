import { FC, useState } from 'react';
import { BsYoutube } from 'react-icons/bs';
import Button from '../Toolbar/Button';

interface Props {
  onSubmit(link: string): void;
}
const EmbededYoutube: FC<Props> = ({ onSubmit }): JSX.Element => {
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (!url.trim()) hideForm();

    onSubmit(url);
    setUrl('');
    hideForm();
  }


  const hideForm = () => {
    setVisible(false);
  }

  const showForm = () => {
    setVisible(true);
  }

  return (
    <div onKeyDown={({ key }) => {
      if (key === 'Escape') hideForm();
    }} className="relative">
      <Button onClick={() => { visible ? hideForm() : showForm() }}>
        <BsYoutube />
      </Button>
      {visible && <div className="absolute right-0 z-50 mt-4 top-full">
        <div className="flex space-x-2">
          <input type="text" className='p-2 transition bg-transparent border-2 rounded border-secondary-dark focus:border-primary-dark dark:focus:border-primary text-primary-dark dark:text-primary' placeholder='https://youtube.com' autoFocus
            value={url} onChange={({ target }) => { setUrl(target.value) }} />
          <button onClick={handleSubmit} className='p-2 text-sm rounded bg-action text-primary'>Embed</button>
        </div>
      </div>}
    </div>
  );
};

export default EmbededYoutube;