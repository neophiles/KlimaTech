import React from "react";
import "./LoginModal.css";

const API_BASE = "http://127.0.0.1:8000";

const LoginModal = ({ isOpen, onClose, onConfirm }) => {
    const [username, setUsername] = React.useState("");
    const [phoneNum, setPhoneNum] = React.useState("");
    const [allowLocation, setAllowLocation] = React.useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const userData = { username, phoneNum, allowLocation }; 

        // send user data to backend, kayo na bahala di ako marunong nitey

        onConfirm?.(userData);
        onClose();
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
                        type="text"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        placeholder="Enter your phone number"
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
                    <button className="close-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;