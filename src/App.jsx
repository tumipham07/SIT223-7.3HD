import { Routes, Route } from "react-router-dom"
import { useState } from "react"

import Navigation from "./components/Navigation"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Post from "./pages/Post"
import Pricing from "./pages/Pricing"
import BrowsePosts from "./pages/BrowsePosts"

function App() {
  // Load the saved user when the application starts
  const storedUser = localStorage.getItem("user")

  // Keep the logged-in user in shared React state
  const [user, setUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  )
  return (
    <>
      <Navigation user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass the logged-in user to the Post page */}
        <Route path="/post" element={<Post user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/browse" element={<BrowsePosts user={user} />} />
        <Route path="/pricing" element={<Pricing user={user} setUser={setUser} />} />

      </Routes>

      <Footer />
    </>
  )
}

export default App