// @ts-nocheck
// Pulled from https://blog.logrocket.com/building-rich-text-editors-in-react-using-draft-js-and-react-draft-wysiwyg/

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import DOMPurify from 'dompurify';

const Editor = dynamic(() =>
  import('react-draft-wysiwyg').then((mod) => mod.Editor)
) as Editor;

const App = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  return (
    <div className="App">
      <header className="App-header">Rich Text Editor Example</header>
      <Editor
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
