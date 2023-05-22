import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Editor, { FinalPost } from '../../../../components/editor';
import { dbConnect } from '../../../../lib/dbConnect';
import Post from '../../../../models/Post';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { generateFormData } from '../../../../utils/helper';
import axios from 'axios';


interface PostResponse extends FinalPost {
  id: string
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Update: NextPage<Props> = ({ post }) => {

  const handleSubmit = async (post: FinalPost) => {
    const { id: postId } = post
    try {
      const formData = generateFormData(post)
      const { data } = await axios.patch(`/api/posts/${postId}`, formData)
    } catch (err: any) {
      console.log(err.response.data);
    }
  }

  return <AdminLayout title='Update Post'>
    <div className="max-w-4xl mx-auto">
      <Editor initialValue={post} onSubmit={handleSubmit} btnTitle='Update' />
    </div>
  </AdminLayout>;
};

interface ServerSideResponse {
  post: PostResponse
}

export const getServerSideProps: GetServerSideProps<ServerSideResponse> = async (context) => {
  const slug = context.query.slug as string;

  try {
    await dbConnect()
    const post = await Post.findOne({ slug })
    if (!post) return { notFound: true }

    const { _id, meta, title, content, thumbnail, tags } = post

    return {
      props: {
        post: {
          id: _id.toString(),
          title,
          content,
          tags: tags.join(', '),
          thumbnail: thumbnail?.url || '',
          slug,
          meta
        }
      }
    }
  } catch (err) {
    console.log(err);
    return { notFound: true }
  }
};

export default Update;