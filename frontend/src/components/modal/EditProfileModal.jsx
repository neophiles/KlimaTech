import { useState } from "react";
import "./Modal.css";

const API_BASE = "http://127.0.0.1:8000";

function EditProfileModal({ isOpen, onClose, onConfirm }) {
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");

    if (!isOpen) return null;

    const handleEdit = async () => {
        // if (!username.trim()) {
        //     alert("Please enter your name or nickname.");
        //     return;
        // }
        // if (!userType) {
        //     alert("Please select your user type.");
        //     return;
        // }

        try {
        //     const userData = {
        //         username: username.trim(),
        //         user_type: userType.toLowerCase().replace(" ", "_"), // match backend Enum format
        //         lat,
        //         lon,
        //     };

        //     const response = await fetch(`${API_BASE}/user/add`, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(userData),
        //     });

        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         if (errorData.detail === "Username already exists") {
        //             alert("This username is already taken. Please choose another one.");
        //         } else {
        //             alert(errorData.detail || "Failed to create user");
        //         }
        //         return;
        //     }

        //     const createdUser = await response.json();
        //     console.log("User registered:", createdUser);

            // onConfirm?.(createdUser);
            onClose?.();
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Something went wrong while editing your profile.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <span>Keep your info</span>
                    <img className="logo" src="/logo/name_logo.png" alt="PRESKO LOGO" />
                </div>

                <hr />
                <h3>Edit Profile</h3>

                <form
                    className="register-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit();
                    }}
                >
                    {/* Username */}
                    <div className="input-group">
                        <label>What would you like us to call you?</label>
                        <input
                            type="text"
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
                            Confirm
                        </button>
                        <button
                            className="cancel-edit-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
