import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#222",
        color: "#fff",
        padding: "10px", // Reduced padding
        textAlign: "center",
        position: "relative",
        bottom: "0",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}>
      {/* Location Section */}
      <div style={{ flex: "1", margin: "5px", minWidth: "250px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#FF9800" }}>
          Location
        </h3>
        <p style={{ fontSize: "14px", color: "#8BC34A" }}>
        NMART, Sandapettai Street, near State Bank of India, Veeraganur, Tamil Nadu
        </p>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000968.5763973534!2d77.581202446875!3d11.477507600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab0b13435890cd%3A0x368ac12f2fceac97!2sNMART!5e0!3m2!1sen!2sin!4v1744617884333!5m2!1sen!2sin'
          width='250'
          height='150'
          style={{ border: "0", marginTop: "5px" }}
          allowFullScreen=''
          loading='lazy'></iframe>
      </div>

      {/* Follow Us Section */}
      <div style={{ flex: "1", margin: "5px", minWidth: "250px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#FF5722" }}>
          Follow Us
        </h3>
        <a
          href='https://www.instagram.com/supermarket'
          target='_blank'
          rel='noopener noreferrer'
          style={{
            color: "#C13584",
            margin: "0 5px",
            textDecoration: "none",
            fontSize: "14px",
          }}>
          Instagram
        </a>
        <a
          href='https://wa.me/19876543210'
          target='_blank'
          rel='noopener noreferrer'
          style={{
            color: "#25D366",
            margin: "0 5px",
            textDecoration: "none",
            fontSize: "14px",
          }}>
          WhatsApp
        </a>
        <a
          href='https://www.facebook.com/supermarket'
          target='_blank'
          rel='noopener noreferrer'
          style={{
            color: "#1877F2",
            margin: "0 5px",
            textDecoration: "none",
            fontSize: "14px",
          }}>
          Facebook
        </a>
        <a
          href='https://twitter.com/supermarket'
          target='_blank'
          rel='noopener noreferrer'
          style={{
            color: "#1DA1F2",
            margin: "0 5px",
            textDecoration: "none",
            fontSize: "14px",
          }}>
          Twitter
        </a>
      </div>

      {/* Contact & Copyright Section */}
      <div style={{ flex: "1", margin: "5px", minWidth: "250px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#FF9800" }}>
          Contact Information
        </h3>
        <p style={{ fontSize: "14px", color: "#4CAF50" }}>
          <strong>Contact:</strong> +91 9791626495
        </p>
        <p style={{ fontSize: "14px", color: "#E91E63" }}>
          <strong>Email:</strong> nmart@gmail.com
        </p>

        <p style={{ fontSize: "14px", fontWeight: "bold", color: "#f8b400" }}>
          &copy; {new Date().getFullYear()} NMart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
