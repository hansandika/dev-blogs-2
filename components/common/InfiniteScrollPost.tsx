import { FC, ReactNode, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostDetail } from '../../utils/types';
import PostCard from './PostCard';
import ConfirmModal from './ConfirmModal';
import axios from 'axios';

interface Props {
  posts: PostDetail[];
  showControls?: boolean;
  hasMore: boolean;
  next(): void;
  dataLength: number;
  loader?: ReactNode;
  onPostRemoved(post: PostDetail): void
}

const InfiniteScrollPost: FC<Props> = ({ posts, showControls, hasMore, next, dataLength, loader, onPostRemoved }): JSX.Element => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToRemove, setPostsToRemove] = useState<PostDetail | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleOnDeleteClick = (post: PostDetail) => {
    setPostsToRemove(post);
    setShowConfirmModal(true);
  }

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  }

  const handleOnDeleteConfirm = async () => {
    try {
      if (!postToRemove) return hideConfirmModal();
      const { id } = postToRemove
      setShowConfirmModal(false);
      setRemoving(true);
      const { data } = await axios.delete(`/api/posts/${id}`)
      onPostRemoved(postToRemove)
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.message);
      }
    }
    setRemoving(false);
    setPostsToRemove(null);
  }

  const defaultLoader = <p
    className='p-3 text-xl font-semibold text-center opacity-50 text-secondary-dark animate-pulse'>
    Loading...
  </p>

  return <>
    <InfiniteScroll hasMore={hasMore} next={next} dataLength={dataLength} loader={loader || defaultLoader}>
      <div className="max-w-4xl p-3 mx-auto">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard post={post} key={post.slug} controls={showControls} busy={post.id === postToRemove?.id && removing} onDeleteClick={() => {
              handleOnDeleteClick(post);
            }} />
          ))}
        </div>
      </div>
    </InfiniteScroll>
    <ConfirmModal title='Are you sure?' subtitle='This action will remove this post permanently!' visible={showConfirmModal} onClose={hideConfirmModal} onCancel={hideConfirmModal} onConfirm={handleOnDeleteConfirm} />
  </>;
};

export default InfiniteScrollPost;
