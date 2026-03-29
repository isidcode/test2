// src/pages/search.page.jsx
import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import AnimationWrapper from "../common/page-animation"

const SearchPage = () => {
  const { query } = useParams()
  const [blogs, setBlogs] = useState(null)

  useEffect(() => {
    setBlogs(null)
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query })
      .then(({ data }) => setBlogs(data.blogs))
      .catch(console.error)
  }, [query])

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <h1 className="font-medium text-xl mb-8">
          Search results for:{" "}
          <span className="font-bold text-black">"{query}"</span>
        </h1>

        {blogs === null ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-grey h-28 rounded mb-4 animate-pulse" />
          ))
        ) : blogs.length === 0 ? (
          <div className="text-center w-full py-10 text-dark-grey">
            <p className="text-xl">No blogs found.</p>
          </div>
        ) : (
          blogs.map((blog, i) => (
            <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.1 }}>
              <Link
                to={`/blog/${blog.blog_id}`}
                className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
              >
                <div className="w-full">
                  <div className="flex gap-2 items-center mb-7">

                    
                    <img
                      src={blog.author?.avatar}
                      className="w-6 h-6 rounded-full"
                    />
                    <p className="line-clamp-1 text-dark-grey">
                      {blog.author?.fullname} @{blog.author?.username}
                    </p>
                  </div>
                  <h1 className="blog-title">{blog.title}</h1>
                  <p className="my-3 text-xl font-gelasio leading-7 line-clamp-2">
                    {blog.des}
                  </p>
                  <div className="flex gap-4 mt-7">
                    <span className="tag">{blog.tags[0]}</span>
                  </div>
                </div>

                <div className="h-28 aspect-square bg-grey rounded hidden sm:block">
                  <img
                    src={blog.banner}
                    className="w-full h-full aspect-square object-cover rounded"
                  />
                </div>
              </Link>
            </AnimationWrapper>
          ))
        )}
      </div>
    </section>
  )
}

export default SearchPage
