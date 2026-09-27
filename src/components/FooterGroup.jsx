function FooterGroup({ title, items }) {
    return (
        <div className="footer-section">
            <h3>{title}</h3>

            {items.map((item, index) => (
                <p key={index}>{item}</p>
            ))}
        </div>
    )
}

export default FooterGroup