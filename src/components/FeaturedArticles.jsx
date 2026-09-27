import Article from './Article'

import article1 from '../assets/image/project1.2.jpg'
import article2 from '../assets/image/project2.1.jpg'
import article3 from '../assets/image/gallery1.jpg'

function FeaturedArticles() {
    const articles = [
        {
            id: 1,
            title: 'Understanding IoT Systems',
            description: 'An introduction to how connected devices communicate and work together.',
            author: 'Tumi',
            rating: 5,
            image: article1,
        },
        {
            id: 2,
            title: 'Building Smart Applications',
            description: 'Exploring how software and hardware can be combined to create useful systems.',
            author: 'James',
            rating: 5,
            image: article2,
        },
        {
            id: 3,
            title: 'Learning Web Development',
            description: 'Some useful lessons from developing responsive and interactive websites.',
            author: 'Tumi',
            rating: 4.9,
            image: article3,
        },
    ]

    return (
        <section className="featured-articles">
            <h2>Articles</h2>

            <div className="article-list">
                {articles.map((article) => (
                    <Article
                        key={article.id}
                        title={article.title}
                        description={article.description}
                        author={article.author}
                        rating={article.rating}
                        image={article.image}
                    />
                ))}
            </div>

            <button className="see-all-button">
                See all articles
            </button>
        </section>
    )
}

export default FeaturedArticles