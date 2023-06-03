import { NextPage } from 'next';
import Comments from '../../../components/common/Comments';
import AdminLayout from '../../../components/layout/AdminLayout';

interface Props { }

const AdminComments: NextPage<Props> = () => {
  return <AdminLayout>
    <div className="max-w-4xl mx-auto">
      <h3 className='py-2 text-2xl font-semibold transition text-primary-dark dark:text-primary'>Comments</h3>
      <Comments fetchAll />
    </div>
  </AdminLayout>;
};

export default AdminComments;