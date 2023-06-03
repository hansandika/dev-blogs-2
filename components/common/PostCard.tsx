import { FC } from 'react';
import { PostDetail } from '../../utils/types';
import dateformat from 'dateformat';
import NextImage from 'next/image';
import Link from 'next/link';
import { trimText } from '../../utils/helper';

interface Props {
  post: PostDetail
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void
}

const PostCard: FC<Props> = ({ post, busy, controls = false, onDeleteClick }): JSX.Element => {
  const { title, meta, slug, thumbnail, tags, createdAt } = post;

  return <div className='flex flex-col h-full overflow-hidden transition rounded shadow-sm shadow-secondary-dark bg-primary dark:bg-primary-dark'>
    {/* Thumbnail */}
    <div className="relative aspect-video">
      {thumbnail ? (
        <NextImage src={thumbnail} alt='thumbnail' fill sizes='(max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        33vw' />
      ) : (<div className="flex items-center justify-center w-full h-full font-semibold opacity-50 text-secondary-dark">
        No Image
      </div>)}
    </div>

    {/* Post Info */}
    <div className="flex flex-col flex-1 p-2">
      <Link href={`/${slug}`}>
        <div className="flex items-center justify-between text-sm text-primary-dark dark:text-primary">
          <div className="flex items-center space-x-1">
            {tags.map((tag, index) => <span key={index + tag}>#{tag}</span>)}
          </div>
          <span>{dateformat(createdAt, 'mmm d, yyyy')}</span>
        </div>
        <p className='font-semibold text-primary-dark dark:text-primary'>{trimText(title, 50)}</p>
        <p className='text-secondary-dark'>{trimText(meta, 70)}</p>
      </Link>


      {controls && <div className="flex items-center justify-end h-8 mt-auto space-x-4 text-primary-dark dark:text-primary">
        {busy ? <span className='animate-pulse'>Removing</span> : <>
          <Link href={`/admin/posts/update/${slug}`} className='hover:underline'>Edit</Link>
          <button onClick={onDeleteClick} className='hover:underline'>Delete</button>
        </>}
      </div>}
    </div>
  </div>;
};

export default PostCard;