import { useState } from "react";
import "./Modal.css";
import { apiFetch } from "../../api/api";

function RegisterModal({ isOpen, onClose, onConfirm, onSwitchMode }) {
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    if (!isOpen) return null;

    const handleRegister = async () => {
        if (!username.trim()) {
            alert("Please enter your name or nickname.");
            return;
        }
        if (!userType) {
            alert("Please select your user type.");
            return;
        }

        try {
            const userData = {
                username: username.trim(),
                user_type: userType.toLowerCase().replace(" ", "_"), // match backend Enum format
                lat,
                lon,
            };

            const response = await fetch(`api/user/add`, {
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
            console.log("User registered:", createdUser);

            onConfirm?.(createdUser);
            onClose?.();
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Something went wrong while creating your account.");
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
                    {/* Username */}
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

                    {/* User Type */}
                    <div className="input-group">
                        <label>Which best describes you?</label>
                        <div className="user-type-options">
                            {[
                                { label: "Student", value: "student" },
                                { label: "Outdoor Worker", value: "outdoor_worker" },
                                { label: "Office Worker", value: "office_worker" },
                                { label: "Home-based", value: "home_based" },
                            ].map(({ label, value }) => (
                                <button
                                    type="button"
                                    key={value}
                                    className={`option-btn ${userType === value ? "selected" : ""}`}
                                    onClick={() => setUserType(userType === value ? "" : value)}
                                >
                                    {label}
                                </button>
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
