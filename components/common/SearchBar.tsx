import { FC, FormEventHandler, useState } from 'react';

interface Props {
  onSubmit(search: string): void;
}

const SearchBar: FC<Props> = ({ onSubmit }): JSX.Element => {
  const [search, setSearch] = useState<string>('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    onSubmit(search)
  }

  return <form onSubmit={handleSubmit}>
    <input type='text' className='p-2 transition bg-transparent border-2 rounded outline-none border-secondary-dark text-primary-dark dark:text-primary focus:border-primary-dark dark:focus:border-primary' placeholder='search...' value={search} onChange={({ target }) => {
      setSearch(target.value)
    }} />
  </form>
};

export default SearchBar;