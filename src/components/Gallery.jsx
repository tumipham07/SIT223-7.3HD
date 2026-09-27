import gallery1 from '../assets/image/gallery1.jpg'
import gallery2 from '../assets/image/gallery2.jpg'
import gallery3 from '../assets/image/gallery3.jpg'
import gallery4 from '../assets/image/gallery4.jpg'

function Gallery() {
    return (
        <div class="gallery">

            <h2>My Photos</h2>
            <p>Here are some of my photos engaging in various activities in Melbourne:</p>
            <div class="gallery-images">
                <img src={gallery1} alt="Gallery image 1" />
                <img src={gallery2} alt="Gallery image 2" />
                <img src={gallery3} alt="Gallery image 3" />
                <img src={gallery4} alt="Gallery image 4" />
            </div>
        </div>
    )
}

export default Gallery