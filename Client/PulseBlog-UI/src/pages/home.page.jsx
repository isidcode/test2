// src/pages/home.page.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import AnimationWrapper from "../common/page-animation"
import { Link } from "react-router-dom"

const HomePage = () => {
  const [blogs, setBlogs] = useState(null)

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then(({ data }) => setBlogs(data.blogs))
      .catch(console.error)
  }, [])

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <h1 className="font-medium text-xl mb-8">Latest Blogs</h1>

          {blogs === null
            ? Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-grey h-28 rounded mb-4 animate-pulse" />
              ))
            : blogs.map((blog, i) => (
                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                  <Link to={`/blog/${blog.blog_id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
                    <div className="w-full">
                      <div className="flex gap-2 items-center mb-7">
                        <img src={blog.author.personal_info.profile_img} className="w-6 h-6 rounded-full" />
                        <p className="line-clamp-1 text-dark-grey">
                          {blog.author.personal_info.fullname} @{blog.author.personal_info.username}
                        </p>
                      </div>
                      <h1 className="blog-title">{blog.title}</h1>
                      <p className="my-3 text-xl font-gelasio leading-7 line-clamp-2">{blog.des}</p>
                      <div className="flex gap-4 mt-7">
                        <span className="tag">{blog.tags[0]}</span>
                        <span className="ml-3 flex items-center gap-2 text-dark-grey">
                          <i className="fi fi-rr-heart text-xl" />
                          {blog.activity.total_likes}
                        </span>
                      </div>
                    </div>
                    <div className="h-28 aspect-square bg-grey rounded">
                      <img src={blog.banner} className="w-full h-full aspect-square object-cover rounded" />
                    </div>
                  </Link>
                </AnimationWrapper>
              ))}
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage