import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import AdminLayout from '../../../components/layout/AdminLayout';
import LatestUserTable from '../../../components/admin/LatestUserTable';
import { LatestUserProfile, pageLimit, pageNoInitial } from '../../../utils/types';
import PageNavigator from '../../../components/common/PageNavigator';
import axios from 'axios';

interface Props { }

const limit = pageLimit
let pageNo = pageNoInitial

const UsersPage: NextPage<Props> = () => {
  const [users, setUsers] = useState<LatestUserProfile[]>()
  const [reachedToEnd, setReachToEnd] = useState(false)

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get('/api/user', { params: { pageNo, limit } })
      const { users } = data;
      if (!users.length) {
        pageNo--
        return setReachToEnd(true)
      }
      setUsers(users)
    } catch (error) {
      console.log(error);
    }
  }

  const handleOnNextClick = async () => {
    if (reachedToEnd) return;
    pageNo++
    fetchAllUsers()
  }

  const handleOnPrevClick = async () => {
    if (pageNo <= 1) return;
    if (reachedToEnd) setReachToEnd(false)
    pageNo--
    fetchAllUsers()
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  return <AdminLayout>
    <h3 className='py-2 text-2xl font-semibold transition text-primary-dark dark:text-primary'>Users</h3>
    <LatestUserTable users={users} />
    <div className="flex justify-end py-10">
      <PageNavigator onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick} />
    </div>
  </AdminLayout>;
};

export default UsersPage;