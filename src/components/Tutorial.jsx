function Tutorial({ title, description, author, rating, image }) {
    return (
        <div className="tutorial-card">
            <img src={image} alt={title} />

            <h3>{title}</h3>

            <p>{description}</p>

            <div className="tutorial-info">
                <span>⭐ {rating}</span>
                <span>{author}</span>
            </div>
        </div>
    )
}

export default Tutorial