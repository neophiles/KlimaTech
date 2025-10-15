import React from "react";
import "./LoginModal.css";

const API_BASE = "http://127.0.0.1:8000";

const LoginModal = ({ isOpen, onClose, onConfirm }) => {
    const [username, setUsername] = React.useState("");
    const [phoneNum, setPhoneNum] = React.useState("");
    const [allowLocation, setAllowLocation] = React.useState(false);

    if (!isOpen) return null;

        const handleConfirm = async () => {
        try {
            // Validate inputs
            if (!username.trim()) {
                alert("Please enter a username.");
                return;
            }
            if (!phoneNum.trim()) {
                alert("Please enter a phone number.");
                return;
            }

            if (!allowLocation) {
                alert("Please enable location access to continue.");
                return;
            }

            let lat = null;
            let lon = null;

            // Get location
            if (allowLocation && navigator.geolocation) {
                await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            lat = pos.coords.latitude;
                            lon = pos.coords.longitude;
                            resolve();
                        },
                        (err) => {
                            console.warn("Location access denied:", err);
                            resolve();
                        }
                    );
                });
            }

            const userData = {
                username,
                phone_number: phoneNum,
                lat,
                lon,
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
            console.log("User created:", createdUser);

            onConfirm?.(createdUser);
            onClose();
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Something went wrong while creating user.");
        }
    };


    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title">
                    <h2>Welcome to</h2>
                    <img className="logo" src="/logo/name_logo.png" alt="PRESKO LOGO" />
                </div>
                <h3>Login</h3>
                
                <div className="input-group">
                    <label className="input-labels">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>

                <div className="input-group">
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        placeholder="Enter your phone number"
                        pattern="[0-9]*"
                        inputMode="numeric"
                    />
                </div>

                <div className="switch-group">
                    <label>Allow Location Access</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={allowLocation}
                            onChange={() => setAllowLocation(!allowLocation)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="button-group">
                    <button onClick={handleConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;