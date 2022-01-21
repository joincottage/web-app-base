// Pulled from https://blog.logrocket.com/building-rich-text-editors-in-react-using-draft-js-and-react-draft-wysiwyg/

import dynamic from 'next/dynamic';
import React, { useState, useContext } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import { AppDataContext } from 'src/contexts/AppContext';
import setCreateATaskState from 'src/actions/setCreateATaskState';
import createLinkifyPlugin from '@draft-js-plugins/linkify';

const linkifyPlugin = createLinkifyPlugin();

const Editor = dynamic(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface OwnProps {
  className?: string;
}

const App = ({ className }: OwnProps) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { dispatch } = useContext(AppDataContext);
  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    dispatch(
      setCreateATaskState(
        JSON.stringify(convertToRaw(state.getCurrentContent()))
      )
    );
  };
  return (
    <div className={`App ${className}`}>
      <Editor
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        plugins={[linkifyPlugin]}
      />
    </div>
  );
};
export default App;
