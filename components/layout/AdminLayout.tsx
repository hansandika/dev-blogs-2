import { FC, ReactNode } from 'react';
import AdminNav from '../common/nav/AdminNav';
import { AiOutlineContacts, AiOutlineContainer, AiOutlineDashboard, AiOutlineFileAdd, AiOutlineMail, AiOutlineTeam } from 'react-icons/ai';
import Link from 'next/link';
import AppHead from '../common/AppHead';
import AdminSecondaryNav from '../common/nav/AdminSecondaryNav';

interface Props {
  children: ReactNode;
  title?: string;
  meta?: string;
}

const navItems = [
  { href: "/admin", icon: AiOutlineDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: AiOutlineContainer, label: "Posts" },
  { href: "/admin/users", icon: AiOutlineTeam, label: "Users" },
  { href: "/admin/comments", icon: AiOutlineMail, label: "Comments" },
]

const AdminLayout: FC<Props> = ({ title, meta, children }): JSX.Element => {
  return <>
    <AppHead title={title} meta={meta} />
    <div className="flex">
      <AdminNav navItems={navItems} />
      <div className="flex-1 p-4 dark:bg-primary-dark bg-primary">
        <AdminSecondaryNav />
        {children}
      </div>
      {/* Create Button */}
      <Link href="/admin/posts/create" className='fixed z-10 p-3 transition rounded-full shadow-sm bg-secondary-dark dark:bg-secondary-light text-primary dark:text-primary-dark right-10 bottom-10 hover:scale-90'>
        <AiOutlineFileAdd size={24} />
      </Link>
    </div>
  </>;
};

export default AdminLayout;