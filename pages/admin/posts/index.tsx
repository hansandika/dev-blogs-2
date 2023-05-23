import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useState } from 'react';
import { PostDetail, pageLimit, pageNoInitial } from '../../../utils/types';
import { formatPosts, readPostsFromDb } from '../../../lib/utils';
import InfiniteScrollPost from '../../../components/common/InfiniteScrollPost';
import axios from 'axios';
import { filterPost } from '../../../utils/helper';

let pageNo = pageNoInitial;
const limit = pageLimit;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Admin: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPostsToRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit);

  const fetchMorePosts = async () => {
    try {
      const { data } = await axios.get('/api/posts', { params: { pageNo: pageNo++, limit, skip: postsToRender.length } })
      const { posts } = data;
      if (posts.length < limit) {
        setHasMorePosts(false)
      }

      setPostsToRender([...postsToRender, ...posts]);
    } catch (err: any) {
      setHasMorePosts(false);
      console.log(err);
    }
  }

  return <>
    <AdminLayout>
      <InfiniteScrollPost hasMore={hasMorePosts} next={fetchMorePosts} dataLength={postsToRender.length} posts={postsToRender} showControls onPostRemoved={(postToBeRemoved) => {
        setPostsToRender(filterPost(postsToRender, postToBeRemoved))
      }} />
    </AdminLayout>
  </>;
};

interface ServerSideResponse {
  posts: PostDetail[]
}

export const getServerSideProps: GetServerSideProps<ServerSideResponse> = async () => {
  try {
    // read posts
    const posts = await readPostsFromDb(limit, pageNo);
    // format posts
    const formattedPosts = formatPosts(posts)
    return {
      props: {
        posts: formattedPosts
      },
    };
  } catch (error) {
    return { notFound: true }
  }
}

export default Admin;