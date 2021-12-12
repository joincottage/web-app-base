// Pulled from https://blog.logrocket.com/building-rich-text-editors-in-react-using-draft-js-and-react-draft-wysiwyg/

import dynamic from 'next/dynamic';
import React, { useState, useContext } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import DOMPurify from 'dompurify';
import { AppDataContext } from 'src/contexts/AppContext';
import setCreateATaskState from 'src/actions/setCreateATaskState';

const Editor = dynamic(
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
        // @ts-ignore
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    </div>
  );
};
export default App;
