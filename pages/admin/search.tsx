import { NextPage } from 'next';
import AdminLayout from '../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PostDetail } from '../../utils/types';
import InfiniteScrollPost from '../../components/common/InfiniteScrollPost';
import { filterPost } from '../../utils/helper';

interface Props { }

const Search: NextPage<Props> = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [notFound, setNotFound] = useState<boolean>(false)
  const [results, setResults] = useState<PostDetail[]>([]);
  const { query } = useRouter();
  const { title } = query as { title: string };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/posts/search?title=${title}`)
        const { results } = data
        setResults(results)
        if (!results.length) setNotFound(true)
        else setNotFound(false)
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    }
    if (title && !loading) fetchPosts();
  }, [title])

  return <AdminLayout>
    {notFound && <h3 className='text-3xl font-semibold text-center opacity-40 text-primary-dark dark:text-primary'>Not Found</h3>}
    {loading && <h3 className='text-3xl font-semibold text-center opacity-40 text-primary-dark dark:text-primary'>Searching...</h3>}
    <InfiniteScrollPost hasMore={false} next={() => { }} dataLength={results.length} posts={results} showControls onPostRemoved={(postToBeRemoved) => {
      setResults(filterPost(results, postToBeRemoved))
    }} />
  </AdminLayout>;
};

export default Search;