import { FC, useCallback, useState } from "react";
import { BsBoxArrowUpRight, BsPencilSquare } from "react-icons/bs";
import { BiUnlink } from "react-icons/bi";
import { BubbleMenu, Editor } from "@tiptap/react";
import LinkForm, { linkOption } from "./LinkForm";
import { getFocusedEditor } from "../EditorUtils";

interface Props {
  editor: Editor;
}

const EditLink: FC<Props> = ({ editor }): JSX.Element => {

  const [showEditForm, setShowEditForm] = useState(false);

  const handleOnLinkOpenClick = useCallback(() => {
    const { href } = editor.getAttributes('link')
    if (href) {
      window.open(href, '_blank');
    }
  }, [editor]);

  const handleLinkEditClick = () => {
    setShowEditForm(true);
  };

  const handleUnlinkClick = () => {
    editor.commands.unsetLink()
  };

  const handleSubmit = ({ url, openInNewTab }: linkOption) => {
    getFocusedEditor(editor).unsetLink().setLink({ href: url, target: openInNewTab ? '_blank' : '_self' }).run();
    setShowEditForm(false);
  }

  const getInitialState = useCallback(() => {
    const { href, target } = editor.getAttributes('link')
    return { url: href, openInNewTab: target === '_blank' }
  }, [editor]);

  return (
    <BubbleMenu shouldShow={({ editor }) => {
      return editor.isActive('link');
    }} editor={editor}
      tippyOptions={{
        onHide: () => {
          setShowEditForm(false);
        },
        appendTo: 'parent'
      }}
    >
      <LinkForm visible={showEditForm} onSubmit={handleSubmit} initialState={getInitialState()} />
      {!showEditForm && <div className="z-50 flex items-center p-3 space-x-6 rounded shadow-md bg-primary dark:bg-primary-dark text-primary-dark dark:text-primary shadow-secondary-dark">
        <button onClick={handleOnLinkOpenClick}>
          <BsBoxArrowUpRight />
        </button>
        <button onClick={handleLinkEditClick}>
          <BsPencilSquare />
        </button>
        <button onClick={handleUnlinkClick}>
          <BiUnlink />
        </button>
      </div>}
    </BubbleMenu>
  );
};

export default EditLink;
