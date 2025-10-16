import { useState, useEffect } from "react";
import "./RegisterModal.css";

const API_BASE = "http://127.0.0.1:8000";

function RegisterModal({ isOpen, onClose, onConfirm }) {
    const [username, setUsername] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [allowLocation, setAllowLocation] = useState(false);

    // On mount, check if location permission is already granted
    useEffect(() => {
        if (!navigator.permissions) return;

        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            if (result.state === "granted") setAllowLocation(true);
            else setAllowLocation(false);

            // Listen for future changes
            result.onchange = () => {
                setAllowLocation(result.state === "granted");
            };
        });
    }, []);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        try {
            if (!allowLocation) {
                alert("Location access is required to continue.");
                return;
            }

            // Get location
            let lat = null;
            let lon = null;

            await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        lat = pos.coords.latitude;
                        lon = pos.coords.longitude;
                        resolve();
                    },
                    (err) => {
                        console.warn("Location access denied:", err);
                        alert("Location access is required to continue.");
                        resolve();
                    }
                );
            });

            const userData = {
                username: username.trim() || null, // Optional
                phone_number: phoneNum.trim() || null, // Optional
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
            onClose?.();
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Something went wrong while creating user.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title">
                    <span>Hey there! Let’s keep you</span>
                    <img className="logo" src="/logo/name_logo.png" alt="PRESKO LOGO" />
                </div>
                <h3>Register</h3>
                
                <form
                    className="register-form"
                    onSubmit={async (e) => {
                        e.preventDefault(); // prevent reload
                        handleConfirm();    // run your logic
                    }}
                >
                    <div className="input-group">
                        <label>What should we call you?</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter a name or nickname"
                        />
                    </div>

                    <div className="input-group">
                        <label>Want to share your number?</label>
                        <input
                            type="tel"
                            required
                            value={phoneNum}
                            onChange={(e) => setPhoneNum(e.target.value)}
                            placeholder="e.g. 09123456789"
                            pattern="[0-9]*"
                            inputMode="numeric"
                        />
                        <small className="hint">We’ll only use this if we need to contact you.</small>
                    </div>

                    <div className="switch-group">
                        <label>Allow Location Access</label>
                        <label className="switch">
                        <input
                            type="checkbox"
                            readOnly
                            checked={allowLocation}
                        />
                        <span className="slider"></span>
                        </label>
                    </div>

                    <div className="button-group">
                        <button className="confirm-btn" type="submit">Let’s Go!</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;