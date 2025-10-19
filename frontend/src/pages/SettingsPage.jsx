import { useNavigate } from "react-router-dom";
import GuideWidget from "../components/widgets/GuideWidget";

function Settings({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove user data
    localStorage.removeItem("userData");

    // 2. Call any parent logout logic if passed
    if (onLogout) onLogout();

    // 3. Notify user
    alert("Logged out successfully!");

    // 4. Navigate to home page
    navigate("/");

    // 5. Wait briefly to ensure navigation finishes, then reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div>
      <GuideWidget onLogout={handleLogout} />
    </div>
  );
}

export default Settings;
