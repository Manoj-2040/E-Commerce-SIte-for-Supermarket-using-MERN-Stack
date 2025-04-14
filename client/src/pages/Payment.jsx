import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleUPIPayment = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // UPI Details
    const transactionId = `txn-${Date.now()}`;
    const upiId = "yourupi@upi"; // Replace with actual merchant UPI ID
    const payeeName = "Merchant Name"; 
    const transactionNotes = `Payment for Order ${transactionId}`;
    const currency = "INR";

    // Construct UPI Intent URL
    const upiIntentUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&mc=&tid=${transactionId}&tr=${transactionId}&tn=${transactionNotes}&am=${totalPrice}&cu=${currency}`;

    // Try opening the payment intent
    window.location.href = upiIntentUrl;

    // Fallback message if payment screen doesn't open
    setTimeout(() => {
      alert(
        "If the payment screen does not appear, please ensure you have a UPI-supported app (Google Pay, PhonePe, Paytm) installed and try again."
      );
    }, 3000);
  };

  // Retrieve cart data for order summary
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="payment-container">
      <h2 className="payment-header">Checkout</h2>

      {/* Order Summary */}
      <div className="bill">
        <div className="bill-header">
          <h3>Order Summary</h3>
        </div>

        <table className="bill-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price * item.qty}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2">Total</td>
              <td>₹{totalPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Actions */}
      <div className="payment-actions">
        <p className="payment-note">
          Proceed to continue, End-to-end secure payment via Google Pay.
        </p>
        <button
          className="payment-button"
          onClick={handleUPIPayment}
          disabled={paymentProcessing}
        >
          {paymentProcessing ? "Processing..." : "Pay via Google Pay"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
