import { useState } from "react";
import "./AuthModal.css";

const API_BASE = "http://127.0.0.1:8000";

function LoginModal({ isOpen, onClose, onConfirm, onSwitchMode }) {
    const [username, setUsername] = useState("");

    if (!isOpen) return null;

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim() }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.detail || "Invalid username.");
                return;
            }

            const data = await response.json();
            console.log("User logged in:", data);

            onConfirm?.(data.user);
            onClose?.();
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong during login.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <span>Welcome back to</span>
                    <img className="logo" src="/logo/name_logo.png" alt="PRESKO LOGO" />
                </div>
                <h3>Login</h3>

                <form
                    className="register-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <div className="input-group">
                        <label>What's your username?</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="button-group">
                        <button className="confirm-btn" type="submit">
                            Welcome back!
                        </button>
                    </div>

                    <div className="toggle-text">
                        <p>
                            Don’t have an account?{" "}
                            <a href="#" className="link-button" onClick={(e) => { e.preventDefault(); onSwitchMode(); }}>
                                Register
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;
