// src/pages/blog.page.jsx
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import BlogContent from "../components/blog-content.component"

const BlogPage = () => {
  const { blog_id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(({ data }) => {
        setBlog(data.blog)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [blog_id])

  return (
    <AnimationWrapper>
      {loading ? (
        <div className="h-cover flex justify-center items-center">
          <div className="animate-spin w-10 h-10 border-4 border-grey border-t-black rounded-full" />
        </div>
      ) : blog ? (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
          <img
            src={blog.banner}
            className="aspect-video object-cover rounded-lg"
          />

          <div className="mt-12">
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              {blog.title}
            </h2>

            <div className="flex justify-between my-8 pb-8 border-b border-grey">
              <div className="flex gap-5 items-start">

                {/* ✅ FIXED: avatar instead of personal_info.profile_img */}
                <img
                  src={blog.author?.avatar}
                  className="w-12 h-12 rounded-full"
                />
                <p className="capitalize text-lg">
                  {/* ✅ FIXED: fullname and username are flat */}
                  {blog.author?.fullname}
                  <br />
                  <Link
                    to={`/user/${blog.author?.username}`}
                    className="underline text-dark-grey text-sm"
                  >
                    @{blog.author?.username}
                  </Link>
                </p>
              </div>

              <p className="text-dark-grey opacity-75 max-sm:hidden">
                Published on{" "}
                {new Date(blog.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="blog-page-content mt-10 font-gelasio space-y-8">
            {blog.content[0].blocks.map((block, i) => (
              <div key={i} className="my-4 md:my-8">
                <BlogContent block={block} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1 className="text-center text-3xl mt-20">Blog not found</h1>
      )}
    </AnimationWrapper>
  )
}

export default BlogPage