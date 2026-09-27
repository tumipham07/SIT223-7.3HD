function ArticleCard({ title, description, author, image, rating }) {
    return (
        <div className="article-card">
            <img src={image} alt={title} />

            <h3>{title}</h3>

            <p>{description}</p>

            <div className="article-info">
                <span>⭐{rating}</span>
                <span>{author}</span>
            </div>
        </div>
    )
}

export default ArticleCard