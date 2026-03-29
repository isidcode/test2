// src/App.jsx
import { Route, Routes } from "react-router-dom"
import Navbar       from "./components/navbar.component"
import UserAuthForm from "./pages/userAuthForm.page"
import Editor       from "./pages/editor.page"
import HomePage     from "./pages/home.page"
import SearchPage   from "./pages/search.page" // Import Search
import BlogPage     from "./pages/blog.page"   // Import Blog

const App = () => {
  return (
    <Routes>
      <Route path="/editor" element={<Editor />} />

      <Route path="/" element={<Navbar />}>
        <Route index         element={<HomePage />} />
        <Route path="signin" element={<UserAuthForm type="sign-in" />} />
        <Route path="signup" element={<UserAuthForm type="sign-up" />} />
        
        {/* Add the new routes here */}
        <Route path="search/:query" element={<SearchPage />} />
        <Route path="blog/:blog_id" element={<BlogPage />} />
      </Route>
    </Routes>
  )
}

export default App