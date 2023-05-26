import { FC, useState } from 'react';
import ProfileIcon from './ProfileIcon';
import dateFormat from 'dateformat';
import parse from 'html-react-parser';
import { BsFillReplyAllFill, BsFillTrashFill, BsPencilSquare } from 'react-icons/bs';
import CommentForm from './CommentForm';
import { CommentResponse } from '../../utils/types';
import LikeHeart from './LikeHeart';


interface Props {
  comment: CommentResponse;
  showControls?: boolean;
  onUpdateSubmit?(content: string): void;
  onReplySubmit?(content: string): void;
  onDeleteClick?(): void;
  onLikeClick?(): void;
}

const CommentCard: FC<Props> = ({ comment, showControls = false, onUpdateSubmit, onReplySubmit, onDeleteClick, onLikeClick }): JSX.Element => {
  const { owner, content, createdAt, likedByOwner, likes } = comment
  const [showForm, setShowForm] = useState(false)
  const { name, avatar } = owner
  const [initialState, setInitialState] = useState('')

  const handleCommentSubmit = (comment: string) => {
    if (initialState) {
      onUpdateSubmit?.(comment)
    }
    else {
      onReplySubmit?.(comment)
    }
    hideReplyForm()
  }

  const displayReplyForm = () => {
    setShowForm(true)
  }

  const handleOnReplyClick = () => {
    setInitialState('')
    displayReplyForm()
  }

  const hideReplyForm = () => {
    setShowForm(false)
  }

  const handleOnEditClick = () => {
    displayReplyForm()
    setInitialState(content)
  }

  return <div className='flex space-x-3'>
    <ProfileIcon nameInitial={name[0].toUpperCase()} avatar={avatar} />

    <div className="flex-1">
      <h1 className='text-lg font-semibold text-primary-dark dark:text-primary'>{name}</h1>
      <span className='text-sm text-secondary-dark'>
        {dateFormat(createdAt, 'd-mmm-yyyy')}
      </span>
      <div className='text-primary-dark dark:text-primary'>
        {parse(content)}
      </div>

      <div className="flex space-x-4">
        <LikeHeart liked={likedByOwner} label={`${likes} likes`} onClick={onLikeClick} />
        <Button onClick={handleOnReplyClick}>
          <BsFillReplyAllFill />
          <span>Reply</span>
        </Button>
        {showControls && <>
          <Button onClick={handleOnEditClick}>
            <BsPencilSquare />
            <span>Edit</span>
          </Button>
          <Button onClick={onDeleteClick}>
            <BsFillTrashFill />
            <span>Delete</span>
          </Button>
        </>}
      </div>

      {showForm && <div className='mt-3'>
        <CommentForm onSubmit={handleCommentSubmit} onClose={hideReplyForm} initialState={initialState} />
      </div>}
    </div>
  </div>;
};

export default CommentCard;

interface ButtonProps {
  children: React.ReactNode;
  onClick?(): void
}

const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return <button onClick={onClick} className='flex items-center space-x-2 ttext-primary-dark dark:text-primary'>
    {children}
  </button>
}