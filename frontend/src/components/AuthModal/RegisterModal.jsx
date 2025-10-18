import { useState, useEffect } from "react";
import "./RegisterModal.css";

const API_BASE = "http://127.0.0.1:8000";

function RegisterModal({ isOpen, onClose, onConfirm }) {
    const [username, setUsername] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [allowLocation, setAllowLocation] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(true);

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

            // LOGIN mode
            if (!isRegisterMode) {
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

                    // Parse and extract the user object
                    const data = await response.json();
                    console.log("User logged in:", data);

                    // Send only the user object (contains lat/lon)
                    onConfirm?.(data.user);

                    onClose?.();
                } catch (err) {
                    console.error("Login error:", err);
                    alert("Something went wrong during login.");
                }
                return;
            }

            // REGISTER mode
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
                <h3>{isRegisterMode ? "Register" : "Login"}</h3>
                
                <form
                    className="register-form"
                    onSubmit={async (e) => {
                        e.preventDefault(); // prevent reload
                        handleConfirm();    
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

                    {isRegisterMode && (
                        <>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={phoneNum}
                                    onChange={(e) => setPhoneNum(e.target.value)}
                                    placeholder="e.g. 09123456789"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                />
                                <small className="hint">
                                    We’ll only use this if we need to contact you.
                                </small>
                            </div>

                            <div className="switch-group">
                                <label>Allow Location Access</label>
                                <label className="switch">
                                    <input type="checkbox" readOnly checked={allowLocation} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </>
                    )}


                    <div className="button-group">
                        <button className="confirm-btn" type="submit">Let’s Go!</button>
                    </div>

                    {/* Toggle link */}
                    <div className="toggle-text">
                        {isRegisterMode ? (
                            <p>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => setIsRegisterMode(false)}
                                >
                                    Login
                                </button>
                            </p>
                        ) : (
                            <p>
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => setIsRegisterMode(true)}
                                >
                                    Register
                                </button>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;