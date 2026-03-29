// src/pages/editor.page.jsx
import { createContext, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import BlogEditor   from "../components/blog-editor.component"
import PublishForm  from "../components/publish-form.component"

// ─── Shared state between Editor and Publish form ─────────────
export const EditorContext = createContext({})

const blankBlog = {
  title:   "",
  banner:  "",
  content: [],
  tags:    [],
  des:     "",
  author:  { personal_info: {} },
}

const Editor = () => {
  const [blog, setBlog]             = useState(blankBlog)
  const [editorState, setEditorState] = useState("editor")   // "editor" | "publish"
  const [textEditor, setTextEditor] = useState({ isReady: false })

  const { userAuth } = useSelector((state) => state)

  // Not logged in → go to sign in
  if (!userAuth?.access_token) {
    return <Navigate to="/signin" />
  }

  return (
    <EditorContext.Provider
      value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}
    >
      {editorState === "editor" ? <BlogEditor /> : <PublishForm />}
    </EditorContext.Provider>
  )
}

export default Editor