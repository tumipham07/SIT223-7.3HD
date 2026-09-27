import { useState } from "react"
import "./Post.css"
import { useNavigate } from "react-router-dom"

function Post({ user }) {
    // Navigate to the login page if the user is not logged in
    const navigate = useNavigate()

    const handlePost = async () => {
        setMessage("")

        // User must be logged in before creating a post
        if (!user) {
            alert("Please log in before creating a post.")
            navigate("/login")
            return
        }

        // Validate the post data based on the selected post type
        if (postType === "question") {
            if (title.trim() === "" || description.trim() === "" || tags.trim() === "") {
                setMessage("Please fill in all fields.")
                return
            }
        }

        if (postType === "article") {
            if (
                title.trim() === "" ||
                abstract.trim() === "" ||
                articleText.trim() === "" ||
                tags.trim() === ""
            ) {
                setMessage("Please fill in all fields.")
                return
            }
        }
        // Validate the tags input
        const tagList = tags.split(",").filter((tag) => tag.trim() !== "")

        if (tagList.length > 3) {
            setMessage("Please enter no more than 3 tags.")
            return
        }

        try {
            // Get the JWT that was saved when the user logged in
            const token = localStorage.getItem("token")

            // Send the validated post data to the backend
            const response = await fetch("http://localhost:5000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                    // Send the JWT so the backend can verify the logged-in user
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    postType: postType,
                    postPlan: postPlan,
                    title: title,

                    // Send the question description
                    description: description,

                    // Send the article abstract
                    abstract: abstract,

                    // Send the full article content
                    articleText: articleText,

                    // Send the validated list of tags
                    tags: tagList
                })
            })

            // Read the response returned by the backend
            const data = await response.json()

            // Display an error returned by the backend
            if (!response.ok) {
                setMessage(data.message)
                return
            }

            // Display the success message returned by the backend
            setMessage(data.message)


        } catch (error) {
            console.log(error)

            // Display an error if the frontend cannot reach the backend
            setMessage("Unable to create post. Please try again.")
        }
    }
    // Stores the selected post type: question or article
    const [postType, setPostType] = useState("question")
    // Stores the selected post plan: free or paid
    const [postPlan, setPostPlan] = useState("free")

    // Stores the user's post input
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [abstract, setAbstract] = useState("")
    const [articleText, setArticleText] = useState("")
    const [tags, setTags] = useState("")

    // Stores success or error messages shown to the user
    const [message, setMessage] = useState("")

    return (
        <div className="post-page">

            <div className="post-header">
                New Post
            </div>

            <div className="post-type">
                <span>Select Post Type:</span>

                <label>
                    <input
                        type="radio"
                        name="postType"
                        value="question"
                        checked={postType === "question"}
                        onChange={() => setPostType("question")}
                    />
                    Question
                </label>

                <label>
                    <input
                        type="radio"
                        name="postType"
                        value="article"
                        checked={postType === "article"}
                        onChange={() => setPostType("article")}
                    />
                    Article
                </label>

            </div>
            <div className="post-type">
                <span>Select Post Plan:</span>

                <label>
                    <input
                        type="radio"
                        name="postPlan"
                        value="free"
                        checked={postPlan === "free"}
                        onChange={() => setPostPlan("free")}
                    />
                    Free
                </label>

                <label>
                    <input
                        type="radio"
                        name="postPlan"
                        value="paid"
                        checked={postPlan === "paid"}
                        onChange={() => setPostPlan("paid")}
                    />
                    Paid
                </label>
            </div>

            {postType === "question" ? (

                <div>
                    <div className="section-header">
                        What do you want to ask or share
                    </div>

                    <p className="post-description">
                        This section is designed based on the type of the post. It could be
                        developed by conditional rendering.
                        <span>
                            {" "}For post a question, the following section would be appeared.
                        </span>
                    </p>

                    <div className="form-row">
                        <label>Title</label>

                        <input
                            type="text"
                            placeholder="Start your question with how, what, why, etc."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <label>Describe your problem</label>

                        <textarea
                            rows="12"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <label>Tags</label>

                        <input
                            type="text"
                            placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <button className="post-button" onClick={handlePost}>
                        Post
                    </button>
                </div>

            ) : (

                <div>
                    <div className="section-header">
                        What do you want to ask or share
                    </div>

                    <p className="post-description">
                        This section is designed based on the type of the post. It could be
                        developed by conditional rendering.
                        <span>
                            {" "}For post an article, the following section would be appeared.
                        </span>
                    </p>

                    <div className="form-row">
                        <label>Title</label>

                        <input
                            type="text"
                            placeholder="Enter a descriptive title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <label>Abstract</label>

                        <textarea
                            rows="3"
                            placeholder="Enter a 1-paragraph abstract"
                            value={abstract}
                            onChange={(e) => setAbstract(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <label>Article Text</label>

                        <textarea
                            rows="8"
                            placeholder="Enter your article text"
                            value={articleText}
                            onChange={(e) => setArticleText(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <label>Tags</label>

                        <input
                            type="text"
                            placeholder="Please add up to 3 tags to describe what your article is about e.g., Java"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <button className="post-button" onClick={handlePost}>
                        Post
                    </button>
                </div>

            )}
            {message && (
                <p
                    className={
                        message === "Post created successfully"
                            ? "post-message success"
                            : "post-message error"
                    }
                >
                    {message}
                </p>
            )}

        </div>
    )
}

export default Post