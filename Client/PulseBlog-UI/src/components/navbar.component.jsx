import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import logo from "../imgs/logo.png"
import { removeFromSession } from "../main"

const Navbar = () => {

  const [ searchVisible, setSearchVisible ] = useState(false)
  const [ userMenuOpen,  setUserMenuOpen  ] = useState(false)

  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const { userAuth }  = useSelector((state) => state)
  const access_token  = userAuth?.access_token
  const profile_img   = userAuth?.profile_img

  // ── Search on Enter key ──────────────────────────────────────
  const handleSearch = (e) => {
    if (e.keyCode === 13 && e.target.value.length) {
      navigate(`/search/${e.target.value}`)
    }
  }

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = () => {
    removeFromSession("user")
    dispatch({ type: "LOGOUT" })
    setUserMenuOpen(false)
  }

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════════ */}
      <nav className="navbar">

        {/* LOGO */}
        <Link to="/" className="flex-none">
          <img
            src={logo}
            alt="PulseBlog"
            className="w-[120px] h-auto object-contain"
          />
        </Link>

        {/* SEARCH BAR — desktop always visible, mobile toggles */}
        <div
          className={`
            absolute md:relative
            top-[80px] md:top-auto
            left-0
            w-full md:w-auto
            bg-white md:bg-transparent
            px-[5vw] md:px-0
            py-4 md:py-0
            border-b md:border-none
            border-grey
            ${searchVisible ? "flex" : "hidden"}
            md:flex
            items-center
          `}
        >
          <div className="relative w-full md:w-[300px]">
            {/* Search Icon */}
            <i className="fi fi-br-search absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey text-sm pointer-events-none" />
            {/* Input */}
            <input
              type="text"
              placeholder="Search"
              onKeyDown={handleSearch}
              className="
                w-full bg-grey
                py-3 pl-11 pr-5
                rounded-full
                text-sm
                placeholder:text-dark-grey
                outline-none
                focus:bg-transparent
                focus:border focus:border-grey
              "
            />
          </div>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-3 md:gap-5 ml-auto">

          {/* Mobile — search toggle button */}
          <button
            className="md:hidden w-10 h-10 rounded-full bg-grey flex items-center justify-center"
            onClick={() => setSearchVisible(v => !v)}
          >
            <i className="fi fi-br-search text-base" />
          </button>

          {/* ── LOGGED IN STATE ── */}
          {access_token ? (
            <>
              {/* Write button — desktop only */}
              <Link
                to="/editor"
                className="hidden md:flex items-center gap-2 link"
              >
                <i className="fi fi-rr-file-edit text-xl" />
                <p>Write</p>
              </Link>

              {/* Profile avatar + dropdown */}
              <div className="relative">
                <img
                  src={profile_img}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() => setUserMenuOpen(v => !v)}
                />

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="
                    absolute right-0 mt-3
                    bg-white border border-grey
                    rounded-lg shadow-lg
                    z-50 w-52
                    overflow-hidden
                  ">
                    {/* Write — mobile only inside dropdown */}
                    <Link
                      to="/editor"
                      className="flex items-center gap-2 link md:hidden"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <i className="fi fi-rr-file-edit" />
                      <p>Write</p>
                    </Link>

                    <Link
                      to={`/user/${userAuth.username}`}
                      className="link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>

                    <Link
                      to="/dashboard/blogs"
                      className="link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/settings/edit-profile"
                      className="link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>

                    <hr className="border-grey" />

                    <button
                      className="link text-left w-full"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ── LOGGED OUT STATE ── */
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}

        </div>
      </nav>

      {/* Page content renders here */}
      <Outlet />
    </>
  )
}

export default Navbar