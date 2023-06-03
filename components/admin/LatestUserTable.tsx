import { FC } from 'react';
import { LatestUserProfile } from '../../utils/types';
import ProfileIcon from '../common/ProfileIcon';
import { getFirstLetter } from '../../utils/helper';

interface Props {
  users?: LatestUserProfile[];
}

const LatestUserTable: FC<Props> = ({ users }): JSX.Element => {
  return <div>
    <table className='w-full text-left text-primary-dark dark:text-primary'>
      <tbody>
        <tr className='text-left bg-secondary-dark text-primary'>
          <th className='p-2'>Profile</th>
          <th className='p-2'>Email</th>
          <th className='p-2'>Provider</th>
        </tr>
        {users?.map((user) => {
          return <tr key={user.id} className='border-b'>
            <td className='py-2'>
              <div className='flex items-center space-x-2'>
                <ProfileIcon nameInitial={getFirstLetter(user.name)} avatar={user.avatar} />
                <p>{user.name}</p>
              </div>
            </td>
            <td className='p-2'>{user.email}</td>
            <td className='p-2'>{user.provider}</td>
          </tr>
        })}
      </tbody>
    </table>
  </div>;
};

export default LatestUserTable;