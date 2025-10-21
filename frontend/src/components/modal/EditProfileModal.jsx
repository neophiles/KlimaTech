import { useState } from "react";
import "./Modal.css";

const API_BASE = "http://127.0.0.1:8000";

function EditProfileModal({ isOpen, onClose, currentUser, onUpdate, onUserTypeChosen }) {
    const [username, setUsername] = useState(currentUser?.username || "");
    const [userType, setUserType] = useState(currentUser?.user_type || "");

    if (!isOpen) return null;

    const handleEdit = async () => {
        try {
            const userData = {
                username: username.trim(),
                user_type: userType,
            };

            const response = await fetch(`${API_BASE}/user/${currentUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.detail || "Failed to update user.");
                return;
            }

            const updatedUser = await response.json();
            onUpdate?.(updatedUser);

            // automatically open type-specific modal
            onUserTypeChosen?.(userType);

            onClose?.();
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Something went wrong while updating your profile.");
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
                    <div className="input-group">
                        <label>What would you like us to call you?</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter a name or nickname"
                        />
                    </div>

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
                                    onClick={() => setUserType(value)}
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
                        <button className="cancel-edit-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
