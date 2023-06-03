import { FC } from 'react';
import DropdownOptions, { dropdownOptions } from '../DropdownOptions';
import ProfileHead from '../ProfileHead';
import { useRouter } from 'next/router';
import useDarkMode from '../../../hooks/useDarkMode';
import { signOut } from 'next-auth/react';
import SearchBar from '../SearchBar';

interface Props { }

const AdminSecondaryNav: FC<Props> = (props): JSX.Element => {

  const router = useRouter();
  const { toggleTheme } = useDarkMode();

  const navigateToCreateNewPost = () => {
    router.push('/admin/posts/create')
  }

  const handleLogOut = async () => {
    await signOut();
  }

  const options: dropdownOptions = [
    {
      label: 'Add New Post',
      onClick: navigateToCreateNewPost
    },
    {
      label: 'Change Theme',
      onClick: toggleTheme
    },
    {
      label: 'Logout',
      onClick: handleLogOut
    }
  ]

  const handleSearchSubmit = (search: string) => {
    if (!search.trim()) return;
    router.push(`/admin/search?title=${search}`)
  }

  return <div className='flex items-center justify-between'>
    {/* Search Bar */}
    <SearchBar onSubmit={handleSearchSubmit} />
    {/* Profile Head */}
    <DropdownOptions head={<ProfileHead nameInitial='H' />} options={options} />
  </div>;
};

export default AdminSecondaryNav;