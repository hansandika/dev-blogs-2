import { FC, useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import { GithubAuthButton } from '../button';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { CommentResponse } from '../../utils/types';
import CommentCard from './CommentCard';
import ConfirmModal from './ConfirmModal';

interface Props {
  belongsTo: string
}

const Comments: FC<Props> = ({ belongsTo }): JSX.Element => {
  const [comments, setComments] = useState<CommentResponse[]>()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<CommentResponse | null>(null)

  const user = useAuth();

  const handleNewCommentSubmit = async (content: string) => {
    try {
      const { data } = await axios.post('/api/comment', {
        content,
        belongsTo
      })
      const { comment: newComment } = data;
      setComments(prev => prev ? [...prev, newComment] : [newComment])
    } catch (error) {
      console.log(error)
    }
  }

  const insertNewReplyComment = (reply: CommentResponse) => {
    if (!comments) return;
    const updatedComments = [...comments]

    const chiefCommentIndex = updatedComments.findIndex(({ id }) => {
      return id === reply.repliedTo
    })

    const { replies } = updatedComments[chiefCommentIndex]
    if (replies) {
      updatedComments[chiefCommentIndex].replies = [...replies, reply]
    } else {
      updatedComments[chiefCommentIndex].replies = [reply]
    }
    setComments([...updatedComments]);
  }

  const handleReplySubmit = async (replyComment: { content: string, repliedTo: string }) => {
    try {
      const { data } = await axios.post('/api/comment/add-reply', replyComment)
      const { comment } = data
      insertNewReplyComment(comment)
    } catch (error) {
      console.log(error);
    }
  }

  const updateEditedComment = (updatedComment: CommentResponse) => {
    if (!comments) return;

    const updatedComments = [...comments]
    if (updatedComment.chiefComment) {
      const commentIndex = comments.findIndex(({ id }) => {
        return id === updatedComment.id
      })
      updatedComments[commentIndex].content = updatedComment.content
      setComments([...updatedComments])
      return;
    }

    const chiefCommentIndex = updatedComments.findIndex(({ id }) => {
      return id === updatedComment.repliedTo
    })

    const { replies } = updatedComments[chiefCommentIndex]
    if (replies) {
      const replyIndex = replies.findIndex(({ id }) => {
        return id === updatedComment.id
      })

      if (updatedComments[chiefCommentIndex].replies) {
        updatedComments[chiefCommentIndex].replies = [...replies.slice(0, replyIndex), updatedComment, ...replies.slice(replyIndex + 1)]
      }
    }
    setComments([...updatedComments]);
  }

  const handleUpdateSubmit = async (content: string, commentId: string) => {
    try {
      const { data } = await axios.patch(`/api/comment?commentId=${commentId}`, { content })
      const { comment } = data
      updateEditedComment(comment)
    } catch (error) {
      console.log(error);
    }
  }

  const handleOnDeleteClick = (comment: CommentResponse) => {
    setCommentToDelete(comment)
    setShowConfirmModal(true)
  }

  const handleOnDeleteCancel = () => {
    setCommentToDelete(null)
    setShowConfirmModal(false)
  }

  const updateDeletedComments = (deletedComment: CommentResponse) => {
    if (!comments) return;

    const updatedComments = [...comments]
    if (deletedComment.chiefComment) {
      const newComments = updatedComments.filter(({ id }) => {
        return id !== deletedComment.id
      })
      setComments([...newComments])
      return
    }

    const chiefCommentIndex = updatedComments.findIndex(({ id }) => {
      return id === deletedComment.repliedTo
    })

    const { replies } = updatedComments[chiefCommentIndex]
    if (replies) {
      const newReplies = replies.filter(({ id }) => {
        return id !== deletedComment.id
      })
      updatedComments[chiefCommentIndex].replies = [...newReplies]
    }
    setComments([...updatedComments]);
  }

  const handleOnDeleteConfirm = async () => {
    if (!commentToDelete) return;
    try {
      await axios.delete(`/api/comment?commentId=${commentToDelete.id}`)
      updateDeletedComments(commentToDelete)
      setShowConfirmModal(false)
      setCommentToDelete(null)
    } catch (error) {
      console.log(error);
    }
  }

  const updateLikedComments = (likedComments: CommentResponse) => {
    if (!comments) return;

    const updatedComments = [...comments]
    if (likedComments.chiefComment) {
      const newComments = updatedComments.map(comment => {
        if (comment.id === likedComments.id) {
          return likedComments
        }
        return comment
      })
      setComments([...newComments])
      return;
    }

    const chiefCommentIndex = updatedComments.findIndex(({ id }) => {
      return id === likedComments.repliedTo
    })

    const { replies } = updatedComments[chiefCommentIndex]
    if (replies) {
      const newReplies = replies.map(reply => {
        if (reply.id === likedComments.id) {
          return likedComments
        }
        return reply
      })
      updatedComments[chiefCommentIndex].replies = [...newReplies]
    }
    setComments([...updatedComments]);
  }

  const handleOnLikeClick = async (comment: CommentResponse) => {
    try {
      const { data } = await axios.post('/api/comment/update-like', { commentId: comment.id })
      const { comment: updatedComment } = data
      updateLikedComments(updatedComment)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get('/api/comment', { params: { belongsTo } })
        const { comments } = data;
        setComments(comments)
      } catch (error) {
        console.log(error);
      }
    }
    fetchComments()
  }, [belongsTo])

  return <div className="py-20 space-y-4">
    {user ? <CommentForm onSubmit={handleNewCommentSubmit} title='Add Comment' /> : <div className='flex flex-col items-end space-y-2'>
      <h3 className='text-xl font-semibold text-secondary-dark'>Log in to add comment</h3>
      <GithubAuthButton />
    </div>}

    {comments?.map((comment) => {
      const { id, replies } = comment;
      return (<div key={id}>
        <CommentCard showControls={user?.id === comment.owner.id} comment={comment} onReplySubmit={(content) => {
          handleReplySubmit({ content, repliedTo: id })
        }} onUpdateSubmit={(content) => {
          handleUpdateSubmit(content, comment.id)
        }} onDeleteClick={() => handleOnDeleteClick(comment)}
          onLikeClick={() => handleOnLikeClick(comment)}
        />

        {replies && replies?.length > 0 && (
          <div className='w-[93%] ml-auto space-y-3'>
            <h1 className='mb-3 text-seconday-dark'>Replies</h1>
            {replies.map((reply) => {
              return (
                <CommentCard key={reply.id} comment={reply} showControls={user?.id === reply.owner.id} onReplySubmit={(content) => {
                  handleReplySubmit({ content, repliedTo: id })
                }} onUpdateSubmit={(content) => {
                  handleUpdateSubmit(content, reply.id)
                }} onDeleteClick={() => handleOnDeleteClick(reply)}
                  onLikeClick={() => handleOnLikeClick(reply)}
                />
              )
            })}
          </div>
        )}
      </div>)
    })}

    <ConfirmModal visible={showConfirmModal} title='Are you sure?' subtitle='This action will remove this comment and replies if this is chief comment!' onCancel={handleOnDeleteCancel} onConfirm={handleOnDeleteConfirm} />
  </div>;
};

export default Comments;