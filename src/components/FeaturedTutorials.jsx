import Tutorial from './Tutorial'

import tutorial1 from '../assets/image/project1.3.jpg'
import tutorial2 from '../assets/image/project2.2.jpg'
import tutorial3 from '../assets/image/gallery2.jpg'

function FeaturedTutorials() {
    const tutorials = [
        {
            id: 1,
            title: 'React Components',
            description: 'Learn how to divide a React page into reusable parent and child components.',
            author: 'Tumi',
            rating: 5,
            image: tutorial1,
        },
        {
            id: 2,
            title: 'Working with Props',
            description: 'Learn how data can be passed from a parent component to a child component.',
            author: 'Tumi',
            rating: 4.9,
            image: tutorial2,
        },
        {
            id: 3,
            title: 'Using map() in React',
            description: 'Learn how to display multiple components from an array using the map function.',
            author: 'Tumi',
            rating: 5,
            image: tutorial3,
        },
    ]

    return (
        <section className="featured-tutorials">
            <h2>Tutorials</h2>

            <div className="tutorial-list">
                {tutorials.map((tutorial) => (
                    <Tutorial
                        key={tutorial.id}
                        title={tutorial.title}
                        description={tutorial.description}
                        author={tutorial.author}
                        rating={tutorial.rating}
                        image={tutorial.image}
                    />
                ))}
            </div>

            <button className="see-all-button">
                See all tutorials
            </button>
        </section>
    )
}

export default FeaturedTutorials