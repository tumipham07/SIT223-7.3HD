import "./Login.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"


function Login({ setUser }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        // Make sure both fields are filled in
        if (email === "" || password === "") {
            alert("Please enter your email and password")
            return
        }

        try {
            // Send login details to the Express backend
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            // Convert the backend response into JavaScript data
            const data = await response.json()

            if (response.ok) {
                // Store the JWT so the user stays logged in
                localStorage.setItem("token", data.token)

                // Store basic user information for the interface
                localStorage.setItem("user", JSON.stringify(data.user))
                // Update the shared React user state immediately
                setUser(data.user)

                alert(data.message)
                navigate("/")
            } else {
                alert(data.message)
            }

        } catch (error) {
            console.log(error)
            alert("Unable to connect to the server")
        }
    }


    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Login</h2>

                <label>Your email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <label>Your password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button onClick={handleLogin}>Login</button>

                <p>
                    Don't have an account?
                    <Link to="/signup"> Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login