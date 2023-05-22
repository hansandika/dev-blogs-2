import { FC } from 'react';
import { Editor } from '@tiptap/react'
import DropdownOptions from '../../common/DropdownOptions';
import { AiFillCaretDown } from 'react-icons/ai';
import { getFocusedEditor } from '../EditorUtils';
import Button from './Button';
import {
  BsTypeStrikethrough,
  BsBraces,
  BsCode,
  BsListOl,
  BsListUl,
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsImageFill,
  BsLink45Deg,
  BsYoutube,
} from 'react-icons/bs';
import { RiDoubleQuotesL } from 'react-icons/ri';
import InsertLink from '../Link/InsertLink';
import { linkOption } from '../Link/LinkForm';
import EmbededYoutube from './EmbededYoutube';

interface Props {
  editor: Editor | null;
  onOpenImageClick?(): void;
}

const Toolbar: FC<Props> = ({ editor, onOpenImageClick }): JSX.Element | null => {
  if (!editor) return null;

  const options = [
    { label: "Paragraph", onClick: () => { getFocusedEditor(editor).setParagraph().run() } },
    { label: "Heading 1", onClick: () => { getFocusedEditor(editor).toggleHeading({ level: 1 }).run() } },
    { label: "Heading 2", onClick: () => { getFocusedEditor(editor).toggleHeading({ level: 2 }).run() } },
    { label: "Heading 3", onClick: () => { getFocusedEditor(editor).toggleHeading({ level: 3 }).run() } },
  ]

  const getLabel = (): string => {
    if (editor.isActive('heading', { level: 1 })) return "Heading 1"
    if (editor.isActive('heading', { level: 2 })) return "Heading 2"
    if (editor.isActive('heading', { level: 3 })) return "Heading 3"

    return "Paragraph";
  }

  const handleLinkSubmit = ({ url, openInNewTab }: linkOption) => {
    const { commands } = editor;
    commands.setLink({ href: url, target: openInNewTab ? '_blank' : '_self' })
  }

  const Head = () => {
    return <div className="flex items-center space-x-2 text-primary-dark dark:text-primary">
      <p>{getLabel()}</p>
      <AiFillCaretDown />
    </div>
  }

  const handleEmbedYoutube = (url: string) => {
    getFocusedEditor(editor).setYoutubeVideo({ src: url }).run()
  }

  return <div className='flex items-center'>
    {/* paragraph, heading 1,2,3 */}
    <DropdownOptions options={options} head={<Head />} />

    <div className="h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light mx-8" />

    <div className="flex items-center space-x-3">
      <Button onClick={() => { getFocusedEditor(editor).toggleBold().run() }} active={editor.isActive('bold')}>
        <BsTypeBold />
      </Button>
      <Button onClick={() => { getFocusedEditor(editor).toggleItalic().run() }} active={editor.isActive('italic')}>
        <BsTypeItalic />
      </Button>
      <Button onClick={() => { getFocusedEditor(editor).toggleUnderline().run() }} active={editor.isActive('underline')}>
        <BsTypeUnderline />
      </Button>
      <Button onClick={() => { getFocusedEditor(editor).toggleStrike().run() }} active={editor.isActive('strike')}>
        <BsTypeStrikethrough />
      </Button>
    </div>

    <div className="h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light mx-8" />

    <div className="flex items-center space-x-3">
      <Button onClick={() => { getFocusedEditor(editor).toggleBlockquote().run() }} active={editor.isActive('blockquote')}>
        <RiDoubleQuotesL />
      </Button>
      <Button onClick={() => { getFocusedEditor(editor).toggleCode().run() }} active={editor.isActive('code')}>
        <BsCode />
      </Button>
      <Button onClick={() => { getFocusedEditor(editor).toggleCodeBlock().run() }} active={editor.isActive('codeBlock')}>
        <BsBraces />
      </Button>

      <InsertLink onSubmit={handleLinkSubmit} />

      <Button onClick={() => { getFocusedEditor(editor).toggleOrderedList().run() }} active={editor.isActive('orderedList')}>
        <BsListOl />
      </Button>
      <Button onClick={() => { getFocusedEditor(editor).toggleBulletList().run() }} active={editor.isActive('bulletList')}>
        <BsListUl />
      </Button>

    </div>

    <div className="h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light mx-8" />

    <div className="flex items-center space-x-3">
      <EmbededYoutube onSubmit={handleEmbedYoutube} />
      <Button onClick={onOpenImageClick}>
        <BsImageFill />
      </Button>
    </div>
  </div>;
};

export default Toolbar;