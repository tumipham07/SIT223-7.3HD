function Project({ title, description, link, images }) {
    return (
        <div className="project">
            <h3>{title}</h3>

            <p>{description}</p>

            {link && (
                <p>
                    <a href={link}>Project instruction here</a>
                </p>
            )}

            <div className="project-image">
                {images.map((image, index) => (
                    <img
                        key={index}
                        className="project-img"
                        src={image}
                        alt={`${title} ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default Project