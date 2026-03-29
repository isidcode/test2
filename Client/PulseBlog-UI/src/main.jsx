import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

// ── Session helpers (used across all files) ──────────────────
export const lookInSession = (key) => {
  return JSON.parse(sessionStorage.getItem(key))
}

export const storeInSession = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export const removeFromSession = (key) => {
  sessionStorage.removeItem(key)
}

export const logOutUser = () => {
  sessionStorage.clear()
}

// ── Redux reducer ────────────────────────────────────────────
const userReducer = (state = { userAuth: null }, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, userAuth: action.data }
    case "LOGOUT":
      return { ...state, userAuth: null }
    default:
      return state
  }
}

export const store = createStore(userReducer)

// ── Restore session on page reload ───────────────────────────
const storedUser = lookInSession("user")
if (storedUser) {
  store.dispatch({ type: "LOGIN", data: storedUser })
}

// ── Render ───────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)