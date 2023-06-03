import { NextPage } from 'next';
import AdminLayout from '../../components/layout/AdminLayout';
import ContentWrapper from '../../components/admin/ContentWrapper';
import LatestPostListCard from '../../components/admin/LatestPostListCard';
import LatestCommentListCard from '../../components/admin/LatestCommentListCard';
import { LatestComment, LatestUserProfile, PostDetail, pageLimit } from '../../utils/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LatestUserTable from '../../components/admin/LatestUserTable';

interface Props { }

const limit = pageLimit;

const Admin: NextPage<Props> = () => {
  const [latestPosts, setLatestPosts] = useState<PostDetail[]>();
  const [latestComments, setLatestComments] = useState<LatestComment[]>();
  const [latestUsers, setLatestUsers] = useState<LatestUserProfile[]>();

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts', { params: { limit, skip: 0 } })
        const { posts } = data;
        setLatestPosts(posts);
      } catch (error) {
        console.log(error);
      }
    }

    const fetchLatestComments = async () => {
      try {
        const { data } = await axios.get('/api/comment/latest')
        const { comments } = data;
        setLatestComments(comments);
      } catch (error) {
        console.log(error);
      }
    }

    const fetchLatestUsers = async () => {
      try {
        const { data } = await axios.get('/api/user')
        const { users } = data;
        setLatestUsers(users);
      } catch (error) {
        console.log(error);
      }
    }

    fetchLatestPosts();
    fetchLatestComments();
    fetchLatestUsers();
  }, [])

  return <AdminLayout>
    <div className="flex space-x-10">
      <ContentWrapper seeAllRoute='/admin/posts' title='Latest Post'>
        {latestPosts?.map(({ id, title, meta, slug }) => <LatestPostListCard key={id} title={title} meta={meta} slug={slug} />)}
      </ContentWrapper>
      <ContentWrapper seeAllRoute='/admin/comments' title='Latest Comment'>
        {latestComments?.map(comment => <LatestCommentListCard key={comment.id} comment={comment} />)}
      </ContentWrapper>
    </div>
    <div className="max-w-[500px]">
      <ContentWrapper title='Latest Users' seeAllRoute='/admin/users'>
        <LatestUserTable users={latestUsers} />
      </ContentWrapper>
    </div>
  </AdminLayout>;
};

export default Admin;