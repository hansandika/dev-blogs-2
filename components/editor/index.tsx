import { FC, useState, useEffect, ChangeEventHandler } from 'react';
import { useEditor, EditorContent, getMarkRange, Range } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import TipTapImage from '@tiptap/extension-image'


import Toolbar from './Toolbar';
import EditLink from './Link/EditLink';
import GalleryModal, { ImageSelectionResult } from './GalleryModal';
import { getFocusedEditor } from './EditorUtils';
import axios from 'axios';
import SEOForm, { SEOResult } from './SEOForm';
import ActionButton from '../common/ActionButton';
import ThumbnailSelector from './ThumbnailSelector';

export interface FinalPost extends SEOResult {
  id?: string;
  title: string;
  content: string;
  thumbnail?: File | string;
}

interface Props {
  initialValue?: FinalPost;
  btnTitle?: string;
  busy?: boolean;
  onSubmit(post: FinalPost): void
}

const Editor: FC<Props> = ({ initialValue, btnTitle = 'Submit', busy = false, onSubmit }): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGalery, setShowGalery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ src: string }[]>([]);
  const [seoInitialValue, setSeoInitialValue] = useState<SEOResult>();
  const [post, setPosts] = useState<FinalPost>({
    title: '',
    content: '',
    meta: '',
    tags: '',
    slug: '',
  })

  const fetchImages = async () => {
    const { data } = await axios.get('/api/image')
    setImages(data.images);
  }

  const handleImageUpload = async (image: File) => {
    setUploading(true);
    const formData = new FormData()
    formData.append('image', image)
    const { data } = await axios.post('/api/image', formData)
    setUploading(false);

    setImages([data, ...images])
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: ''
        }
      }),
      Placeholder.configure({
        placeholder: 'Type Something..',
      }),
      Youtube.configure({
        width: 840,
        height: 472.5,
        HTMLAttributes: {
          class: 'mx-auto rounded',
        }
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: 'mx-auto'
        }
      })
    ],
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view;
        const selectionRange = getMarkRange(state.doc.resolve(pos), state.schema.marks.link);
        if (selectionRange) setSelectionRange(selectionRange);
      },
      attributes: {
        class: 'prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full'
      }
    }
  })

  const handleImageSelection = (result: ImageSelectionResult) => {
    if (!editor) return
    getFocusedEditor(editor).setImage({ src: result.src, alt: result.altText }).run()
  }

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange])

  const handleSEOChange = (result: SEOResult) => {
    setPosts({ ...post, ...result })
  }

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setPosts({ ...post, title: target.value })
  }

  const handleThumbnailChange = (file: File) => {
    setPosts({ ...post, thumbnail: file })
  }

  const handleSubmit = () => {
    if (!editor) return
    onSubmit({ ...post, content: editor.getHTML() })
  }

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    if (initialValue) {
      setPosts(initialValue)
      editor?.commands.setContent(initialValue.content)

      const { meta, tags, slug } = initialValue
      setSeoInitialValue({ meta, tags, slug })
    }
  }, [initialValue, editor])

  const { title, thumbnail } = post

  return <>
    <div className='p-3 transition dark:bg-primary-dark bg-primary'>
      <div className='sticky top-0 z-10 dark:bg-primary-dark bg-primary'>
        {/* Thumbnail Selector and Submit Button */}
        <div className="flex items-center justify-between mb-3">
          <ThumbnailSelector initialValue={thumbnail as string} onChange={handleThumbnailChange} />
          <div className="inline-block">
            <ActionButton busy={busy} title={btnTitle} onClick={handleSubmit} />
          </div>
        </div>
        {/* Title Input */}
        <input type="text" className='w-full py-2 mb-3 text-3xl italic font-semibold bg-transparent border-0 border-b outline-none border-secondary-dark dark:border-secondary-light text-primary-dark dark:text-primary' placeholder='Title' value={title} onChange={handleTitleChange} />
        <Toolbar editor={editor} onOpenImageClick={() => {
          setShowGalery(true)
        }} />
        <div className="h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3" />

      </div>
      {editor && <EditLink editor={editor} />}
      <EditorContent editor={editor} className='min-h-[300px]' />
      <div className="h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3" />
      <SEOForm title={title} onChange={handleSEOChange} initialValue={seoInitialValue} />
    </div>
    <GalleryModal visible={showGalery} images={images} onClose={() => { setShowGalery(false) }} onSelect={handleImageSelection} onFileSelect={handleImageUpload} uploading={uploading} />
  </>
};

export default Editor;