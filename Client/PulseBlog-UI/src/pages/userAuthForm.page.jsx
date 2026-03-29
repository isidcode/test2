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

  // ─── Send credentials to your backend ─────────────────────────
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", data)           // save in sessionStorage
        dispatch({ type: "LOGIN", data })       // save in redux
      })
      .catch(({ response }) => {
        toast.error(response?.data?.error || "Something went wrong")
      })
  }

  // ─── Form submit handler ───────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault()

    const serverRoute = type === "sign-in" ? "/signin" : "/signup"

    const emailRegex    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

    // collect form fields into an object
    const formData = {}
    new FormData(authForm.current).forEach((value, key) => {
      formData[key] = value
    })

    const { fullname, email, password } = formData

    if (type === "sign-up" && fullname.length < 3) {
      return toast.error("Full name must be at least 3 letters long")
    }
    if (!emailRegex.test(email)) {
      return toast.error("Enter a valid email address")
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be 6–20 chars with at least 1 number, 1 uppercase & 1 lowercase letter"
      )
    }

    userAuthThroughServer(serverRoute, formData)
  }

  // ─── Already logged in → redirect home ───────────────────────
  if (userAuth?.access_token) {
    return <Navigate to="/" />
  }

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-full max-w-[350px]" onSubmit={handleSubmit}>

          <h1 className="text-4xl font-gelasio capitalize text-center mb-10">
            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {/* Show Full Name only on Sign Up */}
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

          {/* Toggle Sign In / Sign Up */}
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