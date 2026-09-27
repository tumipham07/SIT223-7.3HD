
const request = require("supertest")
const jwt = require("jsonwebtoken")
// Test-only JWT value used in automated tests
process.env.JWT_SECRET = "test-jwt-secret"

// Mock Firebase so tests do not require real Firebase credentials
jest.mock("./firebaseAdmin", () => ({}))
const app = require("./server")

describe("Backend API", () => {

    // Create a valid JWT for authenticated route testing
    const validToken = jwt.sign(
        {
            userId: "test-user",
            email: "test@example.com",
            plan: "free"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    // Test that the backend is running
    test("GET / should confirm that the backend is running", async () => {
        const response = await request(app).get("/")

        expect(response.statusCode).toBe(200)
        expect(response.text).toBe("Backend is running")
    })

    // Registration should reject requests with missing fields
    test("POST /register should reject missing registration details", async () => {
        const response = await request(app)
            .post("/register")
            .send({})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("Please fill in all fields")
    })

    // Login should reject requests with missing credentials
    test("POST /login should reject missing login details", async () => {
        const response = await request(app)
            .post("/login")
            .send({})

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe(
            "Please enter your email and password"
        )
    })

    // Upgrade route should require authentication
    test("POST /upgrade should reject unauthenticated users", async () => {
        const response = await request(app)
            .post("/upgrade")
            .send({})

        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe(
            "You must be logged in to upgrade."
        )
    })

    // Creating a post should require authentication
    test("POST /posts should reject unauthenticated users", async () => {
        const response = await request(app)
            .post("/posts")
            .send({})

        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe(
            "You must be logged in to create a post."
        )
    })

    // Authenticated users should still provide a valid post type
    test("POST /posts should reject an invalid post type", async () => {
        const response = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                postType: "invalid",
                postPlan: "free",
                title: "Test Post",
                tags: ["test"]
            })

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe(
            "Invalid post type or post plan."
        )
    })

    // Authenticated users must provide a post title
    test("POST /posts should reject a missing title", async () => {
        const response = await request(app)
            .post("/posts")
            .set("Authorization", `Bearer ${validToken}`)
            .send({
                postType: "question",
                postPlan: "free",
                description: "Test description",
                tags: ["test"]
            })

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe(
            "Please enter a title."
        )

    })
    // Health endpoint should report that the backend is healthy
    test("GET /health should return healthy status", async () => {
        const response = await request(app).get("/health")

        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("healthy")
        expect(response.body.service).toBe("SIT223 DevOps Backend")
    })
})