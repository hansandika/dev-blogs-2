import { signIn, signOut, useSession } from 'next-auth/react';
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

  const handleLoginWithGithub = async () => {
    await signIn('github')
  }

  return <div className='flex items-center justify-between p-3 bg-primary-dark'>
    {/* Logo */}
    <Link href='/' className='flex space-x-2 text-highlight-dark'>
      <Logo className='fill-highlight-dark' />
      <span className='text-xl font-semibold'>{APP_NAME}</span>
    </Link>

    <div className="flex items-center space-x-5 ">
      <button onClick={toggleTheme} className='text-secondary-light dark:text-secondary-dark'>
        <HiLightBulb size={34} />
      </button>

      {isAuth ? <DropdownOptions options={dropdownOptions} head={<ProfileHead nameInitial='h' lightOnly />} /> : <GithubAuthButton onClick={handleLoginWithGithub} lightOnly />}
    </div>
  </div>;
};

export default UserNav;