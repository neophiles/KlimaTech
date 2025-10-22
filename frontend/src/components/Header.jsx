import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Toggle from "./Toggle";

function Header() {
    const navigate = useNavigate();
    const handleGoToHome = () => navigate("/");

    const [menuOpen, setMenuOpen] = useState(false);

    const [darkMode, setDarkMode] = useState(() => {
        // Load previous preference from localStorage
        return localStorage.getItem("theme") === "dark";
    });

    const themeIcon = {
        moon: (
            <svg style={{color: "#02CAB2"}} className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                <path d="M19 11h2m-1 -1v2" />
            </svg>
        ),
        sun: (
            <svg style={{color: "#EDC10F"}} className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
            </svg>
        )
    };

    const toggleContainer = (
        <div className="theme-toggle-container">
            {darkMode ? themeIcon.moon : themeIcon.sun}
            <Toggle 
                otherClass={darkMode ? "dark" : "light"}
                checked={darkMode} 
                onClick={() => setDarkMode(!darkMode)}
            />
        </div>
    );

    // Apply theme to <body>
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);
    
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

                    {/* Hamburger (visible only on larger screens) */}
                    <Button
                        otherClass={"hamburger-btn"}
                        onClick={() => setMenuOpen(!menuOpen)}
                        children={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        }
                    />

                    {toggleContainer}
                </div>
            </header>

            {/* Sidebar / overlay nav for larger screens */}
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

                <hr />

                {toggleContainer}
            </aside>

            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
        </>
    );
}

export default Header;
