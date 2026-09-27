function Subscribe() {
    function handleSubscribe(event) {
        event.preventDefault()
        alert('Thank you for subscribing!')
    }

    return (
        <section className="subscribe-section">
            <form className="subscribe-form" onSubmit={handleSubscribe}>
                <label htmlFor="email">SIGN UP FOR OUR DAILY INSIDER</label>

                <input type="email" id="email" placeholder="Enter your email" required />

                <button type="submit">Subscribe</button>
            </form>
        </section>
    )
}

export default Subscribe