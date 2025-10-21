import { useState } from "react";
import "./ProfileSubPage.css";
import EditProfileModal from "../../components/modal/EditProfileModal";
import StudentModal from "../../components/modal/StudentModal";
import OutdoorWorkerModal from "../../components/modal/OutdoorWorkerModal";
import OfficeWorkerModal from "../../components/modal/OfficeWorkerModal";
import HomeBasedModal from "../../components/modal/HomeBasedModal";

const API_BASE = "http://127.0.0.1:8000";

function ProfileSubPage({ currentUser, setCurrentUser }) {
    const [editMode, setEditMode] = useState(false);
    const [activeTypeModal, setActiveTypeModal] = useState(null); // "student" | "outdoor_worker" | "office_worker" | "home_based"

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            const response = await fetch(`${API_BASE}/user/${currentUser.id}`, { method: "DELETE" });

            if (response.status === 204) {
                alert("Account deleted successfully.");
                setCurrentUser(null);
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "Failed to delete account.");
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            alert("Something went wrong while deleting your account.");
        }
    };

    return (
        <>
            {editMode && (
                <EditProfileModal
                    isOpen={true}
                    onClose={() => {
                        setEditMode(false);
                    }}
                    currentUser={currentUser}
                    onUpdate={(updatedUser) => setCurrentUser(updatedUser)}
                    onUserTypeChosen={(type) => setActiveTypeModal(type)} 
                />
            )}

            {/* Type-specific modals */}
            {activeTypeModal === "student" && (
                <StudentModal
                    userId={currentUser.id}
                    onClose={() => {
                        setEditMode(false);
                        setActiveTypeModal(null);
                    }}
                    existingProfile={currentUser.student_profile || null}
                    editMode={editMode}
                />
            )}
            {activeTypeModal === "outdoor_worker" && (
                <OutdoorWorkerModal
                    userId={currentUser.id}
                    onClose={() => {
                        setEditMode(false);
                        setActiveTypeModal(null);
                    }}
                    existingProfile={currentUser.outdoor_worker_profile || null}
                />
            )}
            {activeTypeModal === "office_worker" && (
                <OfficeWorkerModal
                    userId={currentUser.id}
                    onClose={() => {
                        setEditMode(false);
                        setActiveTypeModal(null);
                    }}
                    existingProfile={currentUser.office_worker_profile || null}
                />
            )}
            {activeTypeModal === "home_based" && (
                <HomeBasedModal
                    userId={currentUser.id}
                    onClose={() => {
                        setEditMode(false);
                        setActiveTypeModal(null);
                    }}
                    existingProfile={currentUser.home_based_profile || null}
                />
            )}

            <div className="base-widget raised-widget settings-widget">
                <span className="widget-title">PROFILE</span>
                <hr />
                <div className="profile-info">
                    <div className="info-group">
                        <label>Username</label>
                        <input type="text" value={currentUser?.username || ""} readOnly />
                    </div>
                    <div className="info-group">
                        <label>User Type</label>
                        <input type="text" value={currentUser?.user_type || ""} readOnly />
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
                    <button className="delete-account-btn" onClick={handleDelete}>
                        Delete Account
                    </button>
                </div>
            </div>
        </>
    );
}

export default ProfileSubPage;
