import backgroundImage from '../assets/image/background.jpg'
function Banner() {
    return (
        <div className="banner" >
            <img src={backgroundImage} alt="Banner" className="banner-image" />
            <div className="banner-text">
                <h2>Hello, I am Tumi</h2>
            </div>
        </div>
    )
}

export default Banner