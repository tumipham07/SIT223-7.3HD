const express = require("express")
const cors = require("cors")
const db = require("./firebaseAdmin")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

// Stop the server if the JWT secret has not been configured
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured")
}

// Create the Express backend application
const app = express()

// Backend server port
const PORT = 5000

// Allow the React frontend to communicate with the backend
app.use(cors())

// Allow the backend to read JSON request data
app.use(express.json())

// Simple test route to confirm that the backend is running
app.get("/", (req, res) => {
    res.send("Backend is running")
})
// Health endpoint used by Jenkins and monitoring tools
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "SIT223 DevOps Backend"
    })
})

// Register a new user account
app.post("/register", async (req, res) => {
    try {
        // Get signup details sent from the React frontend
        const { fullName, email, password } = req.body

        // Check required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields"
            })
        }

        // Check whether the email already exists
        const existingUser = await db
            .collection("users")
            .where("email", "==", email)
            .get()

        if (!existingUser.empty) {
            return res.status(400).json({
                message: "Email already registered"
            })
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10)

        // Save the new user with a Free subscription by default
        await db.collection("users").add({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            plan: "free"
        })

        res.status(201).json({
            message: "Account created successfully"
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

// Login an existing user
app.post("/login", async (req, res) => {
    try {
        // Get login details sent from the React frontend
        const { email, password } = req.body

        // Check that both fields are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter your email and password"
            })
        }

        // Find the user in Firestore using their email
        const userSnapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get()

        if (userSnapshot.empty) {
            return res.status(401).json({
                message: "Incorrect email or password"
            })
        }

        const userDoc = userSnapshot.docs[0]
        const user = userDoc.data()

        // Compare the entered password with the stored hashed password
        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Incorrect email or password"
            })
        }

        // Create a signed JWT for the authenticated user
        const token = jwt.sign(
            {
                userId: userDoc.id,
                email: user.email,
                plan: user.plan
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )

        // Send the token and basic user information back to React
        res.json({
            message: "Login successful",
            token: token,
            user: {
                fullName: user.fullName,
                email: user.email,
                plan: user.plan
            }
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Something went wrong"
        })
    }
})
// Upgrade an authenticated user from Free to Paid
app.post("/upgrade", async (req, res) => {
    try {
        // Read the JWT sent by the frontend
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "You must be logged in to upgrade."
            })
        }

        // Extract the token from "Bearer TOKEN"
        const token = authHeader.split(" ")[1]

        // Verify that the JWT is valid
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        )

        // Find the currently logged-in user's Firestore document
        const userRef = db
            .collection("users")
            .doc(decoded.userId)

        const userDoc = await userRef.get()

        if (!userDoc.exists) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        const user = userDoc.data()

        // Do not allow a Paid user to upgrade again
        if (user.plan === "paid") {
            return res.status(400).json({
                message: "You are already on the Paid plan."
            })
        }

        const { paymentMethod, startDate } = req.body

        // Use the selected date, or start immediately when no date is selected
        const planStartDate =
            startDate || new Date().toISOString()

        // Update only the subscription information.
        // Do not store card numbers, CVV, or other payment details.
        await userRef.update({
            plan: "paid",
            paymentMethod: paymentMethod,
            planStartDate: planStartDate,
            upgradedAt: new Date().toISOString()
        })

        // Return the updated user information
        const updatedUser = {
            fullName: user.fullName,
            email: user.email,
            plan: "paid"
        }

        res.json({
            message: "Plan upgraded successfully",
            user: updatedUser
        })

    } catch (error) {
        console.log(error)

        res.status(401).json({
            message: "Unable to verify your login session."
        })
    }
})

// Create a new post for an authenticated user
app.post("/posts", async (req, res) => {
    try {
        // Read the JWT sent by the frontend
        const authHeader = req.headers.authorization

        // Check that the request includes a Bearer token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "You must be logged in to create a post."
            })
        }

        // Extract the JWT from "Bearer TOKEN"
        const token = authHeader.split(" ")[1]

        // Verify the JWT and identify the logged-in user
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        )

        // Get the post information sent from React
        const {
            postType,
            postPlan,
            title,
            description,
            abstract,
            articleText,
            tags
        } = req.body

        // Check that the post type and plan are valid
        if (
            !["question", "article"].includes(postType) ||
            !["free", "paid"].includes(postPlan)
        ) {
            return res.status(400).json({
                message: "Invalid post type or post plan."
            })
        }
        // Every post must have a title and at least one tag
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Please enter a title."
            })
        }

        if (!Array.isArray(tags) || tags.length === 0 || tags.length > 3) {
            return res.status(400).json({
                message: "Please enter between 1 and 3 tags."
            })
        }
        // Question posts require a description
        if (postType === "question") {
            if (!description || description.trim() === "") {
                return res.status(400).json({
                    message: "Please describe your question."
                })
            }
        }
        // Article posts require both an abstract and article text
        if (postType === "article") {
            if (
                !abstract ||
                abstract.trim() === "" ||
                !articleText ||
                articleText.trim() === ""
            ) {
                return res.status(400).json({
                    message: "Please complete the abstract and article text."
                })
            }
        }

        // Save the post in the Firestore posts collection
        const newPost = await db.collection("posts").add({
            postType: postType,
            postPlan: postPlan,
            title: title,
            description: description || "",
            abstract: abstract || "",
            articleText: articleText || "",
            tags: tags,

            // Store the ID of the logged-in user who created the post
            userId: decoded.userId,

            // Store when the post was created
            createdAt: new Date().toISOString()
        })

        // Tell the frontend that the post was saved successfully
        res.status(201).json({
            message: "Post created successfully",
            postId: newPost.id
        })

    } catch (error) {
        console.log(error)

        // Return an error if the post cannot be created
        res.status(500).json({
            message: "Unable to create post."
        })
    }
})
// Get the posts that the current user is allowed to view
app.get("/posts", async (req, res) => {
    try {
        // Visitors are treated as Free users by default
        let userPlan = "free"

        // Read the Authorization header if the user is logged in
        const authHeader = req.headers.authorization

        if (authHeader && authHeader.startsWith("Bearer ")) {
            // Extract the JWT from "Bearer TOKEN"
            const token = authHeader.split(" ")[1]

            // Verify the logged-in user
            const decoded = jwt.verify(
                token,
                JWT_SECRET
            )

            // Get the latest user information from Firestore
            const userDoc = await db
                .collection("users")
                .doc(decoded.userId)
                .get()

            if (!userDoc.exists) {
                return res.status(404).json({
                    message: "User not found."
                })
            }

            // Use the user's current subscription plan
            userPlan = userDoc.data().plan
        }

        let postsSnapshot

        // Paid users can receive both Free and Paid posts
        if (userPlan === "paid") {
            postsSnapshot = await db
                .collection("posts")
                .get()
        } else {
            // Visitors and Free users only receive Free posts
            postsSnapshot = await db
                .collection("posts")
                .where("postPlan", "==", "free")
                .get()
        }

        // Convert Firestore documents into normal JavaScript objects
        const posts = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))

        // Return only the posts this user is allowed to access
        res.json({
            posts: posts
        })

    } catch (error) {
        console.log(error)

        res.status(401).json({
            message: "Unable to load posts."
        })
    }
})
// Start the server only when this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

// Export the Express app so Jest and Supertest can test it
module.exports = app