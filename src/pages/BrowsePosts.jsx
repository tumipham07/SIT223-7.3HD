import { useState, useEffect } from "react"
import "./BrowsePosts.css"

function BrowsePosts({ user }) {

    // Stores the posts received from the backend
    const [posts, setPosts] = useState([])

    // Stores an error message if posts cannot be loaded
    const [message, setMessage] = useState("")
    // Stores the ID of the post currently expanded
    const [expandedPostId, setExpandedPostId] = useState(null)
    // Stores the IDs of posts hidden by the user
    const [hiddenPostIds, setHiddenPostIds] = useState([])
    // Stores the selected post type filter
    const [filterType, setFilterType] = useState("all")

    // Stores the selected post plan filter
    const [filterPlan, setFilterPlan] = useState("all")

    // Stores the tag entered by the user for filtering
    const [filterTag, setFilterTag] = useState("")
    // Stores the selected creation date filter
    const [filterDate, setFilterDate] = useState("")

    // Load the posts that the current user is allowed to view
    useEffect(() => {

        const loadPosts = async () => {
            try {
                // Get the JWT if the visitor is currently logged in
                const token = localStorage.getItem("token")

                // Prepare the request headers
                const headers = {}

                // Only send the Authorization header when a token exists
                if (token) {
                    headers.Authorization = `Bearer ${token}`
                }

                // Ask the backend for the allowed posts
                const response = await fetch(
                    "http://localhost:5000/posts",
                    {
                        method: "GET",
                        headers: headers
                    }
                )

                const data = await response.json()

                // Display an error if the backend could not load the posts
                if (!response.ok) {
                    setMessage(data.message)
                    return
                }

                // Save the posts returned by the backend into React state
                setPosts(data.posts)
                setMessage("")

            } catch (error) {
                console.log(error)

                // Display an error if the backend cannot be reached
                setMessage("Unable to load posts.")
            }
        }

        loadPosts()

    }, [user])
    // Reset the Browse Posts page back to its original state
    const handleReset = () => {
        // Show all hidden posts again
        setHiddenPostIds([])

        // Collapse any expanded post
        setExpandedPostId(null)
        // Clear all filters
        setFilterType("all")
        setFilterPlan("all")
        setFilterTag("")
    }

    return (
        <div className="browse-posts-page">

            {/* Page heading */}
            <h1>Browse Posts</h1>

            {/* Posts will be displayed here later */}
            <p>Browse questions and articles from DEV@Deakin.</p>

            {/* Filtering controls */}
            <div className="filter-section">

                {/* Filter posts by type */}
                <label>
                    Post Type:
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="question">Question</option>
                        <option value="article">Article</option>
                    </select>
                </label>

                {/* Filter posts by subscription plan */}
                <label>
                    Post Plan:
                    <select
                        value={filterPlan}
                        onChange={(e) => setFilterPlan(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                </label>
                {/* Filter posts by creation date */}
                <label>
                    Date:
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </label>
                {/* Filter posts by tag */}
                <label>
                    Tag:
                    <input
                        type="text"
                        placeholder="Search tag..."
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                    />
                </label>



                {/* Reset filtering, hiding and expanded posts */}
                <button onClick={handleReset}>
                    Reset
                </button>

            </div>
            {/* Display all posts returned by the backend */}
            <div className="posts-list">
                {posts
                    .filter((post) => !hiddenPostIds.includes(post.id))
                    // Filter by Question or Article
                    .filter((post) => filterType === "all" ? true : post.postType === filterType)
                    // Filter by Free or Paid
                    .filter((post) => filterPlan === "all" ? true : post.postPlan === filterPlan)
                    // Filter by tag
                    .filter((post) => filterTag === "" ? true : post.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())))
                    // Filter posts by their creation date
                    .filter((post) => filterDate === "" ? true : post.createdAt.substring(0, 10) === filterDate)
                    .map((post) => (
                        <div className="post-card" key={post.id}>

                            {/* Display the post title */}
                            <h2>{post.title}</h2>

                            {/* Display basic post information */}
                            <p>
                                Type: {post.postType} | Plan: {post.postPlan}
                            </p>
                            {/* Display the date when the post was created */}
                            <p>
                                Created: {post.createdAt.substring(0, 10)}
                            </p>
                            {/* Display the post tags */}
                            <p>
                                Tags: {post.tags.join(", ")}
                            </p>
                            {/* Expand or collapse the selected post */}
                            <button onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}>
                                {expandedPostId === post.id ? "Collapse" : "Expand"}
                            </button>
                            {/* Display the full content only when the post is expanded */}
                            {expandedPostId === post.id && (
                                <div className="post-full-content">

                                    {/* Display question content */}
                                    {post.postType === "question" && (
                                        <p>{post.description}</p>
                                    )}

                                    {/* Display article content */}
                                    {post.postType === "article" && (
                                        <>
                                            <p>
                                                <strong>Abstract:</strong> {post.abstract}
                                            </p>

                                            <p>{post.articleText}</p>
                                        </>
                                    )}

                                </div>
                            )}
                            {/* Hide this post from the current list */}
                            <button onClick={() => setHiddenPostIds([...hiddenPostIds, post.id])}>
                                Hide
                            </button>
                        </div>
                    ))}
            </div>

            {/* Display an error message when required */}
            {message && (
                <p className="browse-message">
                    {message}
                </p>
            )}

        </div>
    )
}

export default BrowsePosts