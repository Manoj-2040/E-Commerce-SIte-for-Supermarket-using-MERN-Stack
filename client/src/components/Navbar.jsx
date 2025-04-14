import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const Navigate = useNavigate(); // Use useNavigate to programmatically navigate
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // When a nav link is clicked, close the mobile menu.
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSignOut = () => {
    Navigate("/sign-in"); // Redirect to the auth page after signing out
    closeMenu(); // Close the menu when signing out
    localStorage.removeItem("cart"); // Clear the cart from local storage
  };

  return (
    <header className='navbar'>
      <div className='navbar__container'>
        <Link to='/' className='navbar__logo' onClick={closeMenu}>
          <img
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
            src='/images/logo.png'
            alt='Food 1'
          />
          <h2>NMart</h2>
        </Link>
        <nav className={`navbar__menu ${menuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to='/' onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to='/products' onClick={closeMenu}>
                Products
              </Link>
            </li>
            <li>
              <Link to='/cart' onClick={closeMenu}>
                Cart
              </Link>
            </li>
            {/* Conditionally render the Admin tab */}
            {isSignedIn && user?.publicMetadata?.isAdmin && (
              <li>
                <Link to='/admin' onClick={closeMenu}>
                  Admin
                </Link>
              </li>
            )}
            {isSignedIn && user ? (
              <>
                <li>
                  <Link to='/profile' onClick={closeMenu}>
                    Profile
                  </Link>
                </li>
                <li>
                  <SignOutButton>
                    <button className='navbar__signout' onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </SignOutButton>
                </li>
              </>
            ) : (
              <li>
                <Link to='/sign-in' onClick={closeMenu}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className='navbar__toggle' onClick={toggleMenu}>
          <span className='navbar__toggle-bar'></span>
          <span className='navbar__toggle-bar'></span>
          <span className='navbar__toggle-bar'></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
