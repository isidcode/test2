// src/components/publish-form.component.jsx
import { useContext } from "react"
import { useSelector } from "react-redux"
import { useNavigate }  from "react-router-dom"
import { toast, Toaster } from "react-hot-toast"
import axios from "axios"

import AnimationWrapper  from "../common/page-animation"
import { EditorContext } from "../pages/editor.page"
import Tags              from "./tags.component"

const characterLimit = 200
const tagLimit       = 10

const PublishForm = () => {
  const { blog, setBlog, setEditorState } = useContext(EditorContext)
  const { title, banner, des, tags, content } = blog

  const { userAuth } = useSelector((state) => state)
  const access_token = userAuth?.access_token
  const navigate = useNavigate()

  const handleClose = () => setEditorState("editor")

  const handleTitleChange = (e) =>
    setBlog({ ...blog, title: e.target.value })

  const handleDesChange = (e) => {
    if (e.target.value.length <= characterLimit)
      setBlog({ ...blog, des: e.target.value })
  }

  const handleTagKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault()
      const tag = e.target.value.trim()
      if (!tag) return
      if (tags.length >= tagLimit) return toast.error(`Max ${tagLimit} tags`)
      if (!tags.includes(tag)) {
        setBlog({ ...blog, tags: [...tags, tag] })
      }
      e.target.value = ""
    }
  }

  const handlePublish = (e) => {
    if (e.target.className.includes("disable")) return
    if (!title.length)                          return toast.error("Add a blog title")
    if (!des.length || des.length > characterLimit)
      return toast.error(`Description must be under ${characterLimit} characters`)
    if (!tags.length) return toast.error("Add at least 1 tag")

    const loadingToast = toast.loading("Publishing...")
    e.target.classList.add("disable")

    const blogObj = { title, banner, des, content, tags, draft: false }

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then(() => {
        e.target.classList.remove("disable")
        toast.dismiss(loadingToast)
        toast.success("Blog published!")
        setTimeout(() => navigate("/"), 500)
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable")
        toast.dismiss(loadingToast)
        toast.error(response?.data?.error || "Publish failed")
      })
  }

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleClose}
        >
          <i className="fi fi-br-cross" />
        </button>

        {/* Preview Panel */}
        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
        </div>

        {/* Form Panel */}
        <div className="border-grey lg:border-l lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleTitleChange}
          />

          <p className="text-dark-grey mb-2 mt-9">Short Description</p>
          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleDesChange}
          />
          <p className="text-sm text-dark-grey text-right mt-1">
            {characterLimit - des.length} characters left
          </p>

          <p className="text-dark-grey mb-2 mt-9">
            Topics — helps rank your blog
          </p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Press Enter or comma to add a tag"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleTagKeyDown}
            />
            {tags.map((tag, i) => (
              <Tags key={i} tag={tag} tagIndex={i} />
            ))}
          </div>
          <p className="text-sm text-dark-grey text-right mt-1">
            {tagLimit - tags.length} tags left
          </p>

          <button className="btn-dark px-8 py-3 mt-6" onClick={handlePublish}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm