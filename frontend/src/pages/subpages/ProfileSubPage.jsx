import { useState, useEffect } from "react";
import "./ProfileSubPage.css";
import EditProfileModal from "../../components/modal/EditProfileModal";

function ProfileSubPage({ currentUser }) {
    const [editMode, setEditMode] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/user/${currentUser.id}`);
                if (!res.ok) throw new Error("Failed to fetch user profile");

                const data = await res.json();
                setUserProfile(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser?.id]);

    const profile = userProfile || currentUser;

    return (
        <>
            {editMode && (
                <EditProfileModal
                    isOpen={true}
                    onClose={() => setEditMode(false)}
                    currentUser={profile}
                />
            )}

            <div className="base-widget raised-widget settings-widget">
                <span className="widget-title">PROFILE</span>
                <hr />

                {loading ? (
                    <div className="loading">Loading profile...</div>
                ) : error ? (
                    <div className="error-text">Error: {error}</div>
                ) : (
                    <div className="profile-info">
                        <div className="info-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={profile?.username || ""}
                                readOnly
                            />
                        </div>

                        <div className="info-group">
                            <label htmlFor="user-type">User Type</label>
                            <input
                                id="user-type"
                                type="text"
                                value={profile?.user_type || ""}
                                readOnly
                            />
                        </div>
                    </div>
                )}
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
