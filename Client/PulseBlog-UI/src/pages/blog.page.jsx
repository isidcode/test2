// src/pages/blog.page.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import BlogContent from "../components/blog-content.component";

const BlogPage = () => {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(({ data }) => {
        setBlog(data.blog);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlog();
  }, [blog_id]);

  return (
    <AnimationWrapper>
      {loading ? (
        <div className="h-cover flex justify-center items-center">
          <div className="animate-spin w-10 h-10 border-4 border-grey border-t-black rounded-full" />
        </div>
      ) : blog ? (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
          <img src={blog.banner} className="aspect-video object-cover rounded-lg" alt="banner" />

          <div className="mt-12">
            <h2 className="text-4xl sm:text-5xl font-bold line-clamp-2 leading-tight">{blog.title}</h2>

            <div className="flex justify-between my-8 pb-8 border-b border-grey">
              <div className="flex gap-5 items-start">
                <img src={blog.author.personal_info.profile_img} className="w-12 h-12 rounded-full" alt="profile" />
                <p className="capitalize text-lg">
                  {blog.author.personal_info.fullname}
                  <br />
                  <Link to={`/user/${blog.author.personal_info.username}`} className="underline text-dark-grey text-sm">
                    @{blog.author.personal_info.username}
                  </Link>
                </p>
              </div>
              <p className="text-dark-grey opacity-75 max-sm:hidden">
                Published on {new Date(blog.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="blog-page-content mt-10 font-gelasio space-y-8">
            {/* Editor.js data is stored inside blog.content[0].blocks */}
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
  );
};

export default BlogPage;