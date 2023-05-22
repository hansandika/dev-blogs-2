import { NextPage } from 'next';
import { GithubAuthButton } from '../../components/button';

interface Props { }

const Signin: NextPage<Props> = () => {
  return <div className='flex items-center justify-center h-screen bg-primary dark:bg-primary-dark'>
    <GithubAuthButton />
  </div>;
};

export default Signin;