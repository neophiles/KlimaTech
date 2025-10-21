import { useState } from "react";
import "./ProfileSubPage.css";
import EditProfileModal from "../../components/modal/EditProfileModal";
import StudentModal from "../../components/modal/StudentModal";
import OutdoorWorkerModal from "../../components/modal/OutdoorWorkerModal";
import OfficeWorkerModal from "../../components/modal/OfficeWorkerModal";
import HomeBasedModal from "../../components/modal/HomeBasedModal";

function ProfileSubPage({ currentUser, setCurrentUser }) {
  const [editMode, setEditMode] = useState(false);
  const [activeTypeModal, setActiveTypeModal] = useState(null);
  const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            const response = await fetch(`api/user/${currentUser.id}`, { method: "DELETE" });

            if (response.status === 204) {
                alert("Account deleted successfully.");
                setCurrentUser(null);
                return;
            }

            let errorMessage = "Failed to delete account.";

            try {
                const data = await response.json();
                errorMessage = data.detail || errorMessage;
            } catch {
                // fallback if not JSON (e.g. "Internal Server Error")
                const text = await response.text();
                if (text) errorMessage = text;
            }

            alert(errorMessage);
        } catch (err) {
            console.error("Error deleting account:", err);
            alert("Something went wrong while deleting your account.");
        }
    };


  const closeAllModals = () => {
    setEditMode(false);
    setActiveTypeModal(null);
  };

  return (
    <>
      {/* Edit main profile modal */}
      {editMode && (
        <EditProfileModal
          isOpen={true}
          onClose={closeAllModals}
          currentUser={currentUser}
          onUpdate={(updatedUser) => setCurrentUser(updatedUser)}
          onUserTypeChosen={(type) => setActiveTypeModal(type)}
        />
      )}

      {/* Type-specific modals */}
      {activeTypeModal === "student" && (
        <StudentModal
          userId={currentUser.id}
          onClose={closeAllModals}
          existingProfile={currentUser.student_profile || null}
          editMode={true}
        />
      )}

      {activeTypeModal === "outdoor_worker" && (
        <OutdoorWorkerModal
          userId={currentUser.id}
          onClose={closeAllModals}
          existingProfile={currentUser.outdoor_worker_profile || null}
          editMode={true}
        />
      )}

      {activeTypeModal === "office_worker" && (
        <OfficeWorkerModal
          userId={currentUser.id}
          onClose={closeAllModals}
          existingProfile={currentUser.office_worker_profile || null}
          editMode={true}
        />
      )}

      {activeTypeModal === "home_based" && (
        <HomeBasedModal
          userId={currentUser.id}
          onClose={closeAllModals}
          existingProfile={currentUser.home_based_profile || null}
          editMode={true}
        />
      )}

      {/* Profile info */}
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

      {/* Actions */}
      <div className="base-widget raised-widget settings-widget">
        <span className="widget-title">ACTIONS</span>
        <hr />
        <div className="profile-actions">
          <button className="edit-profile-btn" onClick={() => setEditMode(true)} disabled={loading}>
            Edit Profile
          </button>
          <button className="delete-account-btn" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileSubPage;
