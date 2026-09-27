import { Link } from "react-router-dom"

function Navigation({ user, setUser }) {


    // Log the user out by removing their saved session information
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        // Update React state so the navbar immediately changes back to Login
        setUser(null)

        // Redirect the user to the Login page
        window.location.href = "/login"
    }

    return (
        <>
            <nav className="navigation-main">
                <div className="nav-left">
                    <a href="#home">Home</a>
                    <a href="#work">Work</a>
                    <a href="#contact">Contact</a>
                    <a href="#about">About</a>
                </div>
            </nav>

            <nav className="navigation-account">
                <div className="account-left">
                    <Link to="/" className="brand">
                        DEV@Deakin
                    </Link>

                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-box"
                    />
                </div>

                <div className="account-right">
                    <Link to="/post">Post</Link>
                    <Link to="/browse">Browse Posts</Link>
                    <Link to="/pricing">Pricing</Link>
                    {user ? (
                        <div className="user-menu">
                            <div className="user-avatar">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>

                            <div className="user-details">
                                <span className="user-name">
                                    Hi, {user.fullName}
                                </span>

                                <span className="user-plan">
                                    {user.plan === "paid"
                                        ? "Paid Plan"
                                        : "Free Plan"}
                                </span>
                            </div>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navigation