import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Header() {
    const navigate = useNavigate();
    const handleGoToHome = () => navigate("/");

    const [menuOpen, setMenuOpen] = useState(false);
    
    return (
        <>
            <header>
                <div className="container">
                    <Button
                        otherClass={"logo-btn"}
                        onClick={handleGoToHome}
                        children={
                            <>
                                <img className="logo" src="/logo/presko-logo.png" alt="PRESKO LOGO" />
                                <span className="title">PRESKO</span>
                            </>
                        }
                    />

                    {/* Hamburger (visible only on mobile) */}
                    <Button
                        otherClass={"hamburger-btn"}
                        onClick={() => setMenuOpen(!menuOpen)}
                        children={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        }
                    />
                </div>
            </header>

            {/* Sidebar / overlay nav for mobile */}
            <aside className={`mobile-nav ${menuOpen ? "open" : ""}`}>
                <Button
                    otherClass={"nav-btn-icon close-btn"}
                    onClick={() => setMenuOpen(false)}
                    children={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    }
                />

                <a href="/">Home</a>
                <a href="/map">PreskoSpots</a>
                <a href="/settings">Settings</a>
            </aside>

            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
        </>
    );
}

export default Header;
