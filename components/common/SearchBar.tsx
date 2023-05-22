import { FC } from 'react';

interface Props { }

const SearchBar: FC<Props> = (props): JSX.Element => {
  return <input type='text' className='p-2 transition bg-transparent border-2 rounded outline-none border-secondary-dark text-primary-dark dark:text-primary focus:border-primary-dark dark:focus:border-primary' placeholder='search...' />
};

export default SearchBar;