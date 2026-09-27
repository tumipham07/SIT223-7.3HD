import "./Signup.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"


function Signup() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const handleCreate = async () => {

        if (
            fullName === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill in all fields")
            return
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email")
            return
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        console.log("validation passed")

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    password: password
                })
            })

            const data = await response.json()

            if (response.ok) {
                alert(data.message)
                navigate("/login")
            } else {
                alert(data.message)
            }

        } catch (error) {
            console.log(error)
            alert("Unable to connect to the server")
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h2>Create a DEV@Deakin Account</h2>

                <label>Full name</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <label>Confirm password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />

                <button onClick={handleCreate}>Create</button>

                <p>
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup