import { useState } from "react";
import "./ProfileSubPage.css";
import EditProfileModal from "../../components/modal/EditProfileModal";

function ProfileSubPage({ currentUser }) {
    const [editMode, setEditMode] = useState(false);

    return (
        <>
            {editMode && <EditProfileModal isOpen={true} onClose={() => setEditMode(false)} />}
                
            <div className="base-widget raised-widget settings-widget">
                <span className="widget-title">PROFILE</span>
                <hr />

                <div className="profile-info">
                    <div className="info-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={currentUser?.username || ""}
                            readOnly
                        />
                    </div>

                    <div className="info-group">
                        <label htmlFor="user-type">User Type</label>
                        <input
                            id="user-type"
                            type="text"
                            value={currentUser?.user_type || ""}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <div className="base-widget raised-widget settings-widget">
                <span className="widget-title">ACTIONS</span>
                <hr />

                <div className="profile-actions">
                    <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
                        Edit Profile
                    </button>
                    <button className="delete-account-btn">
                        Delete Account
                    </button>
                </div>
            </div>
        </>
    );
}

export default ProfileSubPage;