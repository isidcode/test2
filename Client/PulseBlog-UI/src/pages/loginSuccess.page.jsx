// src/pages/loginSuccess.page.jsx
import { useEffect } from "react"
import { useNavigate }  from "react-router-dom"
import { useDispatch }  from "react-redux"
import axios            from "axios"
import { storeInSession } from "../main"

const LoginSuccess = () => {
  const navigate = useNavigate()
  const dispatch  = useDispatch()

  useEffect(() => {
    // Backend set HTTP-only cookies. Now we fetch the current user
    // using those cookies — axios will send them automatically.
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/users/current-user", {
        withCredentials: true,   // ← CRITICAL: sends the cookie
      })
      .then(({ data }) => {
        // Normalise the shape to match what your app expects
        const userData = {
          access_token:  data.data?.accessToken  || "cookie",  // token is in cookie, not body
          username:      data.data?.username,
          fullname:      data.data?.fullname,
          profile_img:   data.data?.avatar,
        }

        storeInSession("user", userData)
        dispatch({ type: "LOGIN", data: userData })
        navigate("/")
      })
      .catch(() => {
        navigate("/signin")
      })
  }, [])

  return (
    <div className="h-cover flex flex-col items-center justify-center gap-4">
      <div className="animate-spin w-10 h-10 border-4 border-grey border-t-purple rounded-full" />
      <p className="text-dark-grey">Signing you in with Google...</p>
    </div>
  )
}

export default LoginSuccess