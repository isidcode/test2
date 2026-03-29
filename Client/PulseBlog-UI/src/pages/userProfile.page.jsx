// src/pages/userProfile.page.jsx
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import AnimationWrapper from "../common/page-animation"

const UserProfilePage = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username })
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { author: username })
      .then(({ data }) => setBlogs(data.blogs))
      .catch(console.error)
  }, [username])

  if (loading) {
    return (
      <div className="h-cover flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-grey border-t-black rounded-full" />
      </div>
    )
  }

  if (!profile) {
    return <h1 className="text-center text-3xl mt-20">User not found</h1>
  }

  
  const { username: uname, fullname, bio, avatar, account_info, social_links, joinedAt, createdAt } = profile

  return (
    <AnimationWrapper>
      <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">

        {/* Sidebar */}
        <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">

        
          <img
            src={avatar}
            alt="user avatar"
            className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32 object-cover"
          />

          <h1 className="text-2xl font-medium">@{uname}</h1>
          <p className="text-xl capitalize h-6">{fullname}</p>
          <p className="text-dark-grey">{bio}</p>

          <div className="flex gap-8 my-3">
            <div className="text-center">
              <h1 className="text-xl font-medium">
                {account_info?.total_posts ?? 0}
              </h1>
              <p className="text-dark-grey capitalize">Blogs Published</p>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-medium">
                {account_info?.total_reads ?? 0}
              </h1>
              <p className="text-dark-grey capitalize">Total Reads</p>
            </div>
          </div>

          <div className="flex gap-2 text-dark-grey">
            <i className="fi fi-rr-calendar text-xl" />
            <p>
              Joined{" "}
              {new Date(createdAt || joinedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Social links */}
          {social_links && Object.entries(social_links).some(([, v]) => v) && (
            <div className="flex gap-4 mt-2 flex-wrap">
              {Object.entries(social_links).map(([platform, link]) =>
                link ? (
                
                  <a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-dark-grey hover:text-black text-xl"
                  >
                    <i
                      className={`fi fi-brands-${
                        platform === "website" ? "chrome" : platform
                      }`}
                    />
                  </a>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Blogs list */}
        <div className="w-full">
          <h1 className="text-xl font-medium mb-8">Recent Blogs</h1>

          {blogs === null ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-grey h-24 rounded mb-4 animate-pulse" />
            ))
          ) : blogs.length === 0 ? (
            <p className="text-dark-grey text-center mt-10">
              No blogs published yet.
            </p>
          ) : (
            blogs.map((blog, i) => (
              <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                <Link
                  to={`/blog/${blog.blog_id}`}
                  className="flex gap-6 items-center border-b border-grey pb-5 mb-4"
                >
                  <div className="w-full">
                    <h1 className="blog-title">{blog.title}</h1>
                    <p className="my-2 text-dark-grey font-gelasio leading-7 line-clamp-1">
                      {blog.des}
                    </p>
                    <div className="flex gap-4 mt-3 items-center">
                      <span className="tag">{blog.tags?.[0]}</span>
                      <span className="flex items-center gap-1 text-dark-grey text-sm">
                        <i className="fi fi-rr-heart" />
                        {blog.activity?.total_likes ?? 0}
                      </span>
                      <span className="text-dark-grey text-sm">
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-24 aspect-square bg-grey rounded hidden sm:block flex-shrink-0">
                    <img
                      src={blog.banner}
                      alt="blog banner"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </Link>
              </AnimationWrapper>
            ))
          )}
        </div>

      </section>
    </AnimationWrapper>
  )
}

export default UserProfilePage
