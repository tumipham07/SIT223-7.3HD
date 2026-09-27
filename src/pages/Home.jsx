import '../App.css'

import Header from '../components/Header'
import Banner from '../components/Banner'
import AboutMe from '../components/AboutMe'
import Work from '../components/Work'
import Gallery from '../components/Gallery'
import FeaturedArticles from '../components/FeaturedArticles'
import FeaturedTutorials from '../components/FeaturedTutorials'
import Subscribe from '../components/Subscribe'


function Home() {
    return (
        <div>
            <Header />
            <Banner />
            <AboutMe />
            <Work />
            <Gallery />
            <FeaturedArticles />
            <FeaturedTutorials />
            <Subscribe />
        </div>
    )
}

export default Home