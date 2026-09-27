import FooterGroup from "./FooterGroup";

function Footer() {
    const footerGroup = [
        {
            id: 1,
            title: 'Explore',
            items: ['Home', 'Questions', 'Articles', 'Tutorials'],
        },
        {
            id: 2,
            title: 'Support',
            items: ['FAQs', 'Help', 'Contact Us'],
        },
        {
            id: 3,
            title: 'Stay connected',
            items: ['Facebook', 'Twitter', 'Instagram'],
        },
    ]

    return (
        <footer className="footer">

            <div className="footer-group">
                {footerGroup.map((group) => (
                    <FooterGroup
                        key={group.id}
                        title={group.title}
                        items={group.items}
                    />
                ))}
            </div>

            <div className="footer-bottom">
                <h3>DEV@Deakin 2026</h3>

                <div className="footer-links">
                    <span>Privacy Policy</span>
                    <span>Terms</span>
                    <span>Code of Conduct</span>
                </div>
            </div>

        </footer>
    )
}

export default Footer