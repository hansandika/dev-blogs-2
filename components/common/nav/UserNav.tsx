import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FC } from 'react';
import { HiLightBulb } from 'react-icons/hi';
import { GithubAuthButton } from '../../button';
import { APP_NAME } from '../AppHead';
import DropdownOptions, { dropdownOptions } from '../DropdownOptions';
import Logo from '../Logo';
import ProfileHead from '../ProfileHead';
import { UserProfile, adminRole } from '../../../utils/types';
import useDarkMode from '../../../hooks/useDarkMode';
import { getFirstLetter } from '../../../utils/helper';

interface Props { }

const defaultOptions: dropdownOptions = [
  {
    label: 'Logout', async onClick() {
      await signOut();
    }
  }
]

const UserNav: FC<Props> = (props): JSX.Element => {
  const router = useRouter();
  const { data: session } = useSession();
  const isAuth = (session != null || session != undefined)

  const profile = session?.user as UserProfile | undefined
  const isAdmin = profile && profile.role === adminRole

  const { toggleTheme } = useDarkMode();

  const dropdownOptions: dropdownOptions = isAdmin ? [
    {
      label: 'Dashboard', onClick() {
        router.push('/admin')
      }
    },
    ...defaultOptions,
  ] : defaultOptions;

  return <div className='flex items-center justify-between p-3 bg-primary-dark'>
    {/* Logo */}
    <Link href='/' className='flex items-center space-x-2 text-highlight-dark'>
      <Logo className='w-5 h-5 fill-highlight-dark md:w-8 md:h-8' />
      <span className='font-semibold md:text-xl'>{APP_NAME}</span>
    </Link>

    <div className="flex items-center space-x-5 ">
      <button onClick={toggleTheme} className='text-secondary-light dark:text-secondary-dark'>
        <HiLightBulb size={34} />
      </button>

      {isAuth ? <DropdownOptions options={dropdownOptions} head={<ProfileHead nameInitial={getFirstLetter(profile?.name)} avatar={profile?.avatar} lightOnly />} /> : <GithubAuthButton lightOnly />}
    </div>
  </div>;
};

export default UserNav;