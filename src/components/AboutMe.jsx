import profileImage from '../assets/image/profile.jpg'
function AboutMe() {
    return (
        <div className="about-me">
            <img src={profileImage} alt="Profile" className="profile-image" />
            <div className="about-me-text">
                <h2>About Me</h2>
                <p>I am a Software Engineering student interested in cloud data and machine learning.</p>
                <p>I enjoy learning web development and building practical projects.</p>
            </div>
        </div>
    )
}

export default AboutMe