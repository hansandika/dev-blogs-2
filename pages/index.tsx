import { useState } from 'react'
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import DefaultLayout from '../components/layout/DefaultLayout'
import { formatPosts, readPostsFromDb } from '../lib/utils'
import { PostDetail, pageLimit, pageNoInitial } from '../utils/types'
import InfiniteScrollPost from '../components/common/InfiniteScrollPost';
import axios from 'axios';
import { filterPost } from '../utils/helper'
import useAuth from '../hooks/useAuth'

let pageNo = pageNoInitial;
const limit = pageLimit;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Home: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPostsToRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit);

  const profile = useAuth();

  const isAdmin = profile?.role === 'admin';

  const fetchMorePosts = async () => {
    try {
      const { data } = await axios.get('/api/posts', { params: { pageNo: pageNo++, limit, skip: postsToRender.length } })
      console.log('post render length : ' + postsToRender.length);
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

  return (
    <DefaultLayout>
      <div className="pb-20">
        <InfiniteScrollPost hasMore={hasMorePosts} next={fetchMorePosts} dataLength={postsToRender.length} posts={postsToRender} showControls={isAdmin} onPostRemoved={(postToBeRemoved) => {
          setPostsToRender(filterPost(postsToRender, postToBeRemoved))
        }} />
      </div>
    </DefaultLayout>
  )
}

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


export default Home
