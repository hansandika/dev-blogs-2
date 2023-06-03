import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import DefaultLayout from '../components/layout/DefaultLayout';
import { dbConnect } from '../lib/dbConnect';
import Post from '../models/Post';
import parse from 'html-react-parser';
import NextImage from 'next/image';
import dateFormat from 'dateformat';
import Comments from '../components/common/Comments';
import LikeHeart from '../components/common/LikeHeart';
import { useCallback, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import User from '../models/User';
import AuthorInfo from '../components/common/AuthorInfo';
import { getFirstName } from '../utils/helper';
import Share from '../components/common/Share';
import Link from 'next/link';


type Props = InferGetStaticPropsType<typeof getStaticProps>

const host = process.env.NEXT_PUBLIC_HOST;

const SinglePost: NextPage<Props> = ({ post, relatedPosts }) => {
  const { id, title, content, thumbnail, tags, meta, slug, createdAt, author } = post;
  const [likes, setLikes] = useState({ likedByOwner: false, count: 0 })
  const [busyLike, setBusyLike] = useState<boolean>(false)

  const user = useAuth();

  const getLikeLabel = useCallback((): string => {
    const { likedByOwner, count } = likes;
    if (likedByOwner && count == 1) return "You liked this post";
    if (likedByOwner) return `You and ${count - 1} others liked this post`;
    if (count == 0) return "Be the first to like this post";

    return `${count} people liked this post`;
  }, [likes])

  const handleOnLikeClick = async () => {
    setBusyLike(true)
    try {
      if (!user) return await signIn('github')
      const { data } = await axios.post(`/api/posts/update-like?postId=${id}`)
      const { likesCount } = data
      setLikes({ likedByOwner: !likes.likedByOwner, count: likesCount })
    } catch (error) {
      console.log(error);
    }
    setBusyLike(false)
  }

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data } = await axios.get(`/api/posts/like-status?postId=${id}`)
        const { likedByOwner, likesCount } = data
        setLikes({ likedByOwner, count: likesCount })
      } catch (error) {
        console.log(error);
      }
    }
    fetchLikes()
  }, [])

  return <DefaultLayout title={title} meta={meta}>
    <div className='px-3 lg:px-0'>
      {thumbnail &&
        <div className="relative aspect-video">
          <NextImage src={thumbnail} alt='post-image' fill={true} className='object-cover' />
        </div>
      }

      <h1 className='py-2 text-6xl font-semibold text-primary-dark dark:text-primary'>{title}</h1>

      <div className="flex items-center justify-between py-2 text-secondary-dark dark:text-secondary-light">
        <div className="flex items-center justify-between gap-x-2">
          {tags.map((tag, index) => {
            return <span key={`${tag} - ${index}`}>
              #{tag}
            </span>
          })}
        </div>
        <span>{dateFormat(createdAt, 'd-mmm-yyyy')}</span>
      </div>

      <div className="sticky top-0 z-50 py-5 transition bg-primary dark:bg-primary-dark">
        <Share url={`${host}/${slug}`} />
      </div>

      <div className='max-w-full mx-auto prose prose-lg dark:prose-invert'>
        {parse(content)}
      </div>

      <div className="py-10">
        <LikeHeart liked={likes.likedByOwner} label={getLikeLabel()} onClick={!busyLike ? handleOnLikeClick : undefined} busy={busyLike} />
      </div>

      <div className="pt-10">
        <AuthorInfo profile={JSON.parse(author)} />
      </div>

      <div className="pt-5">
        <h3 className='p-2 mb-4 text-xl font-semibold bg-secondary-dark text-primary'>Related Posts:</h3>
        <div className='flex flex-col space-y-4'>
          {relatedPosts.map(({ id, title, slug }) => {
            return <Link href={slug} key={id} className='font-semibold transition text-primary-dark dark:text-primary hover:underline'>
              {title}
            </Link>
          })}
        </div>
      </div>

      {/* Comments */}
      <Comments belongsTo={id} />
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
    author: string;
  };
  relatedPosts: {
    id: string;
    title: string;
    slug: string;
  }[]
}

export const getStaticProps: GetStaticProps<StaticPropsResponse, { slug: string }> = async ({ params }) => {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug: params?.slug }).populate('author')
    if (!post) return {
      notFound: true
    }

    const { _id, title, content, meta, slug, author, tags, thumbnail, createdAt } = post;

    // fetching related posts according to tags
    const relatedPosts = await Post.find({ tags: { $in: tags }, _id: { $ne: _id } }).sort({ createdAt: 'desc' }).select('slug title').limit(5)

    const relatedPostFormatted = relatedPosts.map(relatedPost => {
      return {
        id: relatedPost._id.toString(),
        title: relatedPost.title,
        slug: relatedPost.slug
      }
    })

    const admin = await User.findOne({ role: 'admin' })
    const authorInfo = (author || admin) as any;

    const postAuthor = {
      id: authorInfo._id,
      name: authorInfo.name,
      avatar: authorInfo.avatar,
      message: `This post is written by ${authorInfo.name}. ${getFirstName(authorInfo.name)} is an Javascript Fullstack Developer`
    }

    return {
      props: {
        post: {
          id: _id.toString(),
          title, content, meta, slug, tags, thumbnail: thumbnail?.url || '', createdAt: createdAt.toString(), author: JSON.stringify(postAuthor)
        },
        relatedPosts: relatedPostFormatted
      },
      revalidate: 60
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}