// src/components/blog-editor.component.jsx
import { useContext, useEffect } from "react"
import { Link, useNavigate }      from "react-router-dom"
import { toast, Toaster }         from "react-hot-toast"
import { useSelector }            from "react-redux"
import EditorJS                   from "@editorjs/editorjs"
import axios                      from "axios"

import logo          from "../imgs/logo.png"
import defaultBanner from "../imgs/blog banner.png"
import AnimationWrapper from "../common/page-animation"
import { EditorContext } from "../pages/editor.page"
import { tools }         from "./tools.component"

const BlogEditor = () => {
  const {
    blog, setBlog,
    setEditorState,
    textEditor, setTextEditor,
  } = useContext(EditorContext)

  const { title, banner, content } = blog
  const navigate = useNavigate()
  const { userAuth } = useSelector((state) => state)
  const access_token = userAuth?.access_token

  // ─── Initialize EditorJS once ─────────────────────────────────
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data:   Array.isArray(content) ? content[0] : content,
          tools,
          placeholder: "Let's write an awesome story",
        })
      )
    }
  }, [])

  // ─── Banner image upload ───────────────────────────────────────
  const handleBannerUpload = (e) => {
    const img = e.target.files[0]
    if (!img) return

    const loadingToast = toast.loading("Uploading banner...")

    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
      .then(async ({ data: { uploadURL } }) => {
        await axios({
          method: "PUT",
          url: uploadURL,
          headers: { "Content-Type": "multipart/form-data" },
          data: img,
        })
        const imageURL = uploadURL.split("?")[0]
        setBlog({ ...blog, banner: imageURL })
        toast.dismiss(loadingToast)
        toast.success("Banner uploaded!")
      })
      .catch(() => {
        toast.dismiss(loadingToast)
        toast.error("Upload failed")
      })
  }

  // ─── Prevent Enter key in title ───────────────────────────────
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) e.preventDefault()
  }

  // ─── Auto-resize title textarea ───────────────────────────────
  const handleTitleChange = (e) => {
    const el = e.target
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
    setBlog({ ...blog, title: el.value })
  }

  // ─── Go to Publish form ───────────────────────────────────────
  const handlePublish = () => {
    if (!banner.length) return toast.error("Upload a blog banner first")
    if (!title.length)  return toast.error("Write a blog title first")

    if (textEditor.isReady) {
      textEditor.save().then((data) => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data })
          setEditorState("publish")
        } else {
          toast.error("Write something in your blog to publish")
        }
      })
    }
  }

  // ─── Save as Draft ────────────────────────────────────────────
  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) return
    if (!title.length) return toast.error("Write a title before saving draft")

    const loadingToast = toast.loading("Saving draft...")
    e.target.classList.add("disable")

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        const blogObj = { title, banner, des: blog.des, content, tags: blog.tags, draft: true }

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
            headers: { Authorization: `Bearer ${access_token}` },
          })
          .then(() => {
            e.target.classList.remove("disable")
            toast.dismiss(loadingToast)
            toast.success("Draft saved!")
            setTimeout(() => navigate("/"), 500)
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable")
            toast.dismiss(loadingToast)
            toast.error(response?.data?.error || "Error saving draft")
          })
      })
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/"><img src={logo} className="flex-none w-10" /></Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2"  onClick={handlePublish}>Publish</button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>Save Draft</button>
        </div>
      </nav>

      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">

            {/* Banner */}
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner" className="cursor-pointer">
                <img src={banner || defaultBanner} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            {/* Title */}
            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            />

            <hr className="w-full opacity-10 my-5" />

            {/* EditorJS mounts here */}
            <div id="textEditor" className="font-gelasio" />

          </div>
        </section>
      </AnimationWrapper>
    </>
  )
}

export default BlogEditor