import Link from 'next/link';
import { FC } from 'react';
import { trimText } from '../../utils/helper';

interface Props {
  title: string;
  meta: string;
  slug: string;
  onDeleteClick?(): void;
}

const LatestPostListCard: FC<Props> = ({ title, meta, slug, onDeleteClick }): JSX.Element => {
  return <div>
    <h1 className='text-lg font-semibold transition text-primary-dark dark:text-primary'>{trimText(title, 50)}</h1>
    <p className='text-sm text-secondary-dark'>{trimText(meta, 100)}</p>

    <div className="flex items-center justify-end space-x-3">
      <Link href={`/admin/posts/update/${slug}`} className='transition text-primary-dark dark:text-primary hover:underline'>Edit</Link>

      <button onClick={onDeleteClick} className='transition text-primary-dark dark:text-primary hover:underline'>Delete</button>
    </div>
    <hr className='mt-2' />
  </div>;
};

export default LatestPostListCard;