import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Pricing.css"

function Pricing({ user, setUser }) {
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()
    // Stores the selected payment method
    const [paymentMethod, setPaymentMethod] = useState("card")

    // Stores the optional date when the Paid plan should begin
    const [startDate, setStartDate] = useState("")

    // Store the payment form values
    const [nameOnCard, setNameOnCard] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")
    const [paypalEmail, setPaypalEmail] = useState("")
    const handleUpgradeClick = () => {
        // User must be logged in before upgrading
        if (!user) {
            alert("Please log in before upgrading your plan")
            navigate("/login")
            return
        }

        // Paid users cannot upgrade again
        if (user.plan === "paid") {
            alert("You are already on the Paid plan")
            return
        }

        // Free logged-in users can open the payment modal
        setShowModal(true)
    }
    const handleConfirmUpgrade = async () => {
        // User must be logged in, check again
        if (!user) {
            alert("Please log in before upgrading your plan.")
            navigate("/login")
            return
        }

        // Prevent Paid users from upgrading again
        if (user.plan === "paid") {
            alert("You are already on the Paid plan.")
            return
        }

        // Validate card payment details
        if (paymentMethod === "card") {
            if (
                nameOnCard.trim() === "" ||
                cardNumber.trim() === "" ||
                expiry.trim() === "" ||
                cvv.trim() === ""
            ) {
                alert("Please fill in all required payment fields.")
                return
            }

            // Remove spaces before checking the card number
            const cleanedCardNumber = cardNumber.replace(/\s/g, "")

            if (!/^\d{16}$/.test(cleanedCardNumber)) {
                alert("Please enter a valid 16-digit card number.")
                return
            }

            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                alert("Please enter the expiry date in MM/YY format.")
                return
            }

            if (!/^\d{3,4}$/.test(cvv)) {
                alert("Please enter a valid CVV.")
                return
            }
        }

        // Validate PayPal payment
        if (paymentMethod === "paypal") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (
                paypalEmail.trim() === "" ||
                !emailPattern.test(paypalEmail)
            ) {
                alert("Please enter a valid PayPal email.")
                return
            }
        }

        try {
            // Retrieve the JWT created during login
            const token = localStorage.getItem("token")

            // Ask the backend to upgrade this logged-in user
            const response = await fetch("http://localhost:5000/upgrade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentMethod: paymentMethod,
                    startDate: startDate
                })
            })

            const data = await response.json()

            if (!response.ok) {
                alert(data.message)
                return
            }

            // Save the new Paid user information locally
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            )

            // Update React immediately so the navbar changes to Paid Plan
            setUser(data.user)

            // Close the payment modal
            setShowModal(false)

            alert(
                "Payment successful! Your receipt has been sent to your email."
            )

        } catch (error) {
            console.log(error)
            alert("Unable to complete the upgrade. Please try again.")
        }
    }
    return (
        <div className="pricing-page">

            <div className="pricing-header">
                <h1>Pricing</h1>
                <p>Choose the plan that works best for you</p>
            </div>

            <div className="pricing-cards">

                {/* Free plan */}
                <div className="pricing-card">
                    <h2>Free</h2>

                    <div className="price">
                        $0
                        <span>/ month</span>
                    </div>

                    <p className="plan-description">
                        A simple plan for getting started with DEV@Deakin.
                    </p>

                    <div className="plan-features">
                        <p>✓ Standard access to DEV@Deakin</p>
                        <p>✓ Up to 5 posts per month</p>
                        <p>✓ Standard image upload limit</p>
                        <p>✓ Access to public questions and articles</p>
                        <p>✓ Basic community features</p>
                    </div>

                    {user?.plan === "free" && (
                        <button className="current-plan-button" disabled>
                            Your Current Plan
                        </button>
                    )}
                </div>

                {/* Paid plan */}
                <div className="pricing-card paid-card">

                    <div className="recommended">
                        Recommended
                    </div>

                    <h2>Paid</h2>

                    <div className="price">
                        $9.99
                        <span>/ month</span>
                    </div>

                    <p className="plan-description">
                        More features for users who want more from DEV@Deakin.
                    </p>

                    <div className="plan-features">
                        <p>✓ Everything included in Free</p>
                        <p>✓ Early access to premium posts</p>
                        <p>✓ Up to 50 posts per month</p>
                        <p>✓ Larger image upload limit</p>
                        <p>✓ Priority access to new features</p>
                        <p>✓ Paid membership badge</p>
                    </div>

                    {user?.plan === "paid" ? (
                        <button className="current-plan-button" disabled>
                            Your Current Plan
                        </button>
                    ) : (
                        <button className="upgrade-button" onClick={handleUpgradeClick}>
                            Upgrade Plan
                        </button>
                    )}
                </div>

            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="payment-modal">
                        <button
                            className="modal-close"
                            onClick={() => setShowModal(false)}
                        >

                        </button>

                        <h2>Upgrade to Paid</h2>

                        <p className="modal-price">
                            $9.99 / month
                        </p>
                        <div className="payment-field">
                            <label>
                                Payment Method <span className="required">*</span>
                            </label>

                            <div className="payment-method-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Credit / Debit Card
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={paymentMethod === "paypal"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    PayPal
                                </label>
                            </div>
                        </div>
                        {paymentMethod === "card" && (
                            <>
                                <div className="payment-field">

                                    <label>
                                        Name on Card <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                    />
                                </div>

                                <div className="payment-field">
                                    <label>
                                        Card Number <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                </div>

                                <div className="payment-row">
                                    <div className="payment-field">
                                        <label>
                                            Expiry <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                        />
                                    </div>

                                    <div className="payment-field">
                                        <label>
                                            CVV <span className="required">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="123"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {paymentMethod === "paypal" && (
                            <div className="payment-field">
                                <label>
                                    PayPal Email <span className="required">*</span>
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your PayPal email"
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                />

                                <small className="date-note">
                                    A payment link will be sent to your PayPal email.
                                    After completing the payment through PayPal, you will be redirected back to DEV@Deakin.
                                </small>
                            </div>
                        )}
                        <div className="payment-field">
                            <label>Plan Start Date (Optional)</label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                            <small className="date-note">
                                If no date is selected, your Paid plan will start immediately.
                            </small>
                        </div>
                        <button
                            className="confirm-upgrade-button"
                            onClick={handleConfirmUpgrade}
                        >
                            Confirm Upgrade
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Pricing