// src/pages/userAuthForm.page.jsx
import { useRef } from "react"
import InputBox from "../components/input.component"
import { Link, Navigate } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import { toast, Toaster } from "react-hot-toast"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { storeInSession } from "../main"

const UserAuthForm = ({ type }) => {
  const authForm = useRef()
  const dispatch = useDispatch()
  const { userAuth } = useSelector((state) => state)

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        // ✅ backend returns { user, accessToken, refreshToken }
        // we store the shape our app needs
        const userData = {
          access_token: data.accessToken,
          username:     data.user?.username,
          fullname:     data.user?.fullname,
          profile_img:  data.user?.avatar,   // ✅ backend calls it avatar
        }
        storeInSession("user", userData)
        dispatch({ type: "LOGIN", data: userData })
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message || "Something went wrong")
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // ✅ backend register route: /api/v1/users/register
    // ✅ backend login route:    /api/v1/users/Login
    const serverRoute = type === "sign-in"
      ? "/api/v1/users/Login"
      : "/api/v1/users/register"

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

    const formData = {}
    new FormData(authForm.current).forEach((value, key) => {
      formData[key] = value
    })

    const { fullname, email, password } = formData

    if (type === "sign-up" && fullname?.length < 3)
      return toast.error("Full name must be at least 3 letters")
    if (!emailRegex.test(email))
      return toast.error("Enter a valid email address")
    if (!passwordRegex.test(password))
      return toast.error("Password: 6–20 chars, 1 number, 1 uppercase, 1 lowercase")

    userAuthThroughServer(serverRoute, formData)
  }

  const handleGoogleAuth = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/users/google"
  }

  if (userAuth?.access_token) return <Navigate to="/" />

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-full max-w-[350px]" onSubmit={handleSubmit}>

          <h1 className="text-4xl font-gelasio capitalize text-center mb-10">
            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-circle-user"
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button className="btn-dark center mt-6 w-[40%]" type="submit">
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-30 uppercase text-dark-grey font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-5 h-5 object-contain"
            />
            continue with google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="underline text-black ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?{" "}
              <Link to="/signin" className="underline text-black ml-1">
                Sign in here
              </Link>
            </p>
          )}

        </form>
      </section>
    </AnimationWrapper>
  )
}

export default UserAuthForm