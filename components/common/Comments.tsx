import { FC, useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import { GithubAuthButton } from '../button';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { CommentResponse, pageLimit, pageNoInitial } from '../../utils/types';
import CommentCard from './CommentCard';
import ConfirmModal from './ConfirmModal';
import PageNavigator from './PageNavigator';

interface Props {
  belongsTo?: string
  fetchAll?: boolean
}

const limit = pageLimit
let pageNo = pageNoInitial

const Comments: FC<Props> = ({ belongsTo, fetchAll }): JSX.Element => {
  const [comments, setComments] = useState<CommentResponse[]>()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [reachedToEnd, setReachToEnd] = useState(false)
  const [selectedComment, setSelectedComment] = useState<CommentResponse | null>(null)
  const [busyCommentLike, setBusyCommentLike] = useState<boolean>(false)
  const [busyFormSubmit, setBusyFormSubmit] = useState<boolean>(false)

  const user = useAuth();

  const handleNewCommentSubmit = async (content: string) => {
    setBusyFormSubmit(true)
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
    setBusyFormSubmit(false)
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
    setSelectedComment(comment)
    setShowConfirmModal(true)
  }

  const handleOnDeleteCancel = () => {
    setSelectedComment(null)
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
    if (!selectedComment) return;
    try {
      await axios.delete(`/api/comment?commentId=${selectedComment.id}`)
      updateDeletedComments(selectedComment)
      setShowConfirmModal(false)
      setSelectedComment(null)
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
    setBusyCommentLike(true)
    setSelectedComment(comment)
    try {
      const { data } = await axios.post('/api/comment/update-like', { commentId: comment.id })
      const { comment: updatedComment } = data
      updateLikedComments(updatedComment)
    } catch (error) {
      console.log(error);
    }
    setBusyCommentLike(false)
    setSelectedComment(null)
  }

  const fetchAllComments = async () => {
    if (!fetchAll) return
    try {
      const { data } = await axios.get('/api/comment/all', { params: { pageNo, limit } })
      const { comments } = data;

      if (!comments.length) {
        pageNo--
        return setReachToEnd(true)
      }
      setComments(comments)
    } catch (error) {
      console.log(error);
    }
  }

  const handleOnNextClick = async () => {
    if (reachedToEnd) return;
    pageNo++
    fetchAllComments()
  }

  const handleOnPrevClick = async () => {
    if (pageNo <= 1) return;
    if (reachedToEnd) setReachToEnd(false)
    pageNo--
    fetchAllComments()
  }

  useEffect(() => {
    const fetchComments = async () => {
      if (!belongsTo) return;
      try {
        const { data } = await axios.get('/api/comment', { params: { belongsTo } })
        const { comments } = data;
        setComments(comments)
      } catch (error) {
        console.log(error);
      }
    }

    if (belongsTo) {
      fetchComments()
    } else if (fetchAll) {
      fetchAllComments()
    }
  }, [belongsTo, fetchAll])

  return <div className="py-20 space-y-4">
    {user ? <CommentForm visible={!fetchAll} onSubmit={!busyFormSubmit ? handleNewCommentSubmit : undefined} title='Add Comment' busy={busyFormSubmit} /> : <div className='flex flex-col items-end space-y-2'>
      <h3 className='text-xl font-semibold text-secondary-dark'>Log in to add comment</h3>
      <GithubAuthButton />
    </div>}

    {comments?.map((comment) => {
      const { id, replies } = comment;
      return (<div key={id}>
        <CommentCard showControls={user?.id === comment.owner.id} busy={selectedComment?.id === comment.id && busyCommentLike} comment={comment} onReplySubmit={(content) => {
          handleReplySubmit({ content, repliedTo: id })
        }} onUpdateSubmit={(content) => {
          handleUpdateSubmit(content, comment.id)
        }} onDeleteClick={() => handleOnDeleteClick(comment)}
          onLikeClick={() => (selectedComment?.id === comment.id) ? undefined : handleOnLikeClick(comment)}
        />

        {replies && replies?.length > 0 && (
          <div className='w-[93%] ml-auto space-y-3'>
            <h1 className='mb-3 text-seconday-dark'>Replies</h1>
            {replies.map((reply) => {
              return (
                <CommentCard key={reply.id} comment={reply} busy={selectedComment?.id === reply.id && busyCommentLike} showControls={user?.id === reply.owner.id} onReplySubmit={(content) => {
                  handleReplySubmit({ content, repliedTo: id })
                }} onUpdateSubmit={(content) => {
                  handleUpdateSubmit(content, reply.id)
                }} onDeleteClick={() => handleOnDeleteClick(reply)}
                  onLikeClick={(selectedComment?.id === reply.id) ? undefined : () => handleOnLikeClick(reply)}
                />
              )
            })}
          </div>
        )}
      </div>)
    })}

    {fetchAll && <div className="flex justify-end py-10">
      <PageNavigator onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick} />
    </div>}

    <ConfirmModal visible={showConfirmModal} title='Are you sure?' subtitle='This action will remove this comment and replies if this is chief comment!' onCancel={handleOnDeleteCancel} onConfirm={handleOnDeleteConfirm} />
  </div>;
};

export default Comments;