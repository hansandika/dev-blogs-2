import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import DefaultLayout from '../components/layout/DefaultLayout';
import { dbConnect } from '../lib/dbConnect';
import Post from '../models/Post';
import parse from 'html-react-parser';
import NextImage from 'next/image';
import dateFormat from 'dateformat';
import useAuth from '../hooks/useAuth';
import CommentForm from '../components/common/CommentForm';
import { GithubAuthButton } from '../components/button';


type Props = InferGetStaticPropsType<typeof getStaticProps>

const SinglePost: NextPage<Props> = ({ post }) => {
  const { title, content, thumbnail, tags, meta, slug, createdAt } = post;
  const user = useAuth();

  return <DefaultLayout title={title} meta={meta}>
    <div>
      {thumbnail &&
        <div className="relative aspect-video">
          <NextImage src={thumbnail} alt='post-image' fill={true} className='object-cover' />
        </div>
      }

      <h1 className='py-2 text-6xl font-semibold text-primary-dark dark:text-primary'>{title}</h1>

      <div className="flex items-center justify-between py-2 text-secondary-dark dark:text-secondary-light">
        <div className="flex items-center justify-between gap-x-2">
          {tags.map((tag, index) => {
            return <span key={`${tag}-${index}`}>
              #{tag}
            </span>
          })}
        </div>
        <span>{dateFormat(createdAt, 'd-mmm-yyyy')}</span>
      </div>

      <div className='max-w-full mx-auto prose prose-lg dark:prose-invert'>
        {parse(content)}
      </div>

      {/* Comment Form */}
      <div className="py-20">
        {user ? <CommentForm title='Add Comment' /> : <div className='flex flex-col items-end space-y-2'>
          <h3 className='text-xl font-semibold text-secondary-dark'>Log in to add comment</h3>
          <GithubAuthButton />
        </div>}
      </div>
    </div>
  </DefaultLayout>;
};

export default SinglePost;

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    await dbConnect();
    const posts = await Post.find().select('slug')
    const paths = posts.map(({ slug }) => ({ params: { slug } }))

    return {
      paths,
      fallback: 'blocking'
    }
  } catch (error) {
    return {
      paths: [{
        params: { slug: '/' }
      }],
      fallback: false
    }
  }
}

interface StaticPropsResponse {
  post: {
    id: string;
    title: string;
    content: string;
    meta: string;
    tags: string[];
    slug: string;
    thumbnail: string;
    createdAt: string;
  }
}

export const getStaticProps: GetStaticProps<StaticPropsResponse, { slug: string }> = async ({ params }) => {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug: params?.slug })
    if (!post) return {
      notFound: true
    }

    const { _id, title, content, meta, slug, tags, thumbnail, createdAt } = post;

    return {
      props: {
        post: {
          id: _id.toString(),
          title, content, meta, slug, tags, thumbnail: thumbnail?.url || '', createdAt: createdAt.toString()
        }
      },
      revalidate: 60
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}