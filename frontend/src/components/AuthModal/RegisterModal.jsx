import { useState } from "react";
import "./AuthModal.css";

const API_BASE = "http://127.0.0.1:8000";

function RegisterModal({ isOpen, onClose, onConfirm, onSwitchMode }) {
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");

    if (!isOpen) return null;

    const handleRegister = async () => {
        try {
            const userData = {
                username: username.trim() || null,
                user_type: userType || null
            };

            const response = await fetch(`${API_BASE}/user/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.detail === "Username already exists") {
                    alert("This username is already taken. Please choose another one.");
                } else {
                    alert(errorData.detail || "Failed to create user");
                }
                return;
            }

            const createdUser = await response.json();
            console.log("User logged in:", createdUser);
            onConfirm?.(createdUser);
            onClose?.();
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Something went wrong while creating user.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <span>Hey there! Let’s keep you</span>
                    <img className="logo" src="/logo/name_logo.png" alt="PRESKO LOGO" />
                </div>

                <hr />
                <h3>Register</h3>

                <form
                    className="register-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister();
                    }}
                >
                    <div className="input-group">
                        <label>What would you like us to call you?</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter a name or nickname"
                        />
                    </div>

                    <div className="input-group">
                        <label>Which best describes you?</label>
                        <div className="user-type-options">
                            {["Student", "Outdoor Worker", "Office Worker", "Home-based"].map((type) => (
                                <label
                                    key={type}
                                    className={`user-type-btn ${userType === type ? "selected" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="userType"
                                        value={type}
                                        checked={userType === type}
                                        onChange={(e) => setUserType(e.target.value)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr />
                    
                    <div className="button-group">
                        <button className="confirm-btn" type="submit">
                            Tara na!
                        </button>
                    </div>

                    <div className="toggle-text">
                        <p>
                            Already have an account?{" "}
                            <a
                                href="#"
                                className="link-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSwitchMode();
                                }}
                            >
                                Login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;
