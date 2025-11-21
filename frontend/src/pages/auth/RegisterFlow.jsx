import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertTemplate from "../../components/AlertTemplate";
import { register } from "../../api/auth";
import UserTypeSelection from "./steps/UserTypeSelection";
import StudentOnboarding from "./steps/StudentOnboarding";
import OutdoorWorkerOnboarding from "./steps/OutdoorWorkerOnboarding";
import OfficeWorkerOnboarding from "./steps/OfficeWorkerOnboarding";
import HomeBasedOnboarding from "./steps/HomeBasedOnboarding";
import CredentialsStep from "./steps/CredentialsStep";

function RegisterFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: credentials, 2: user type, 3: onboarding
  const [alertInfo, setAlertInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    user_type: null,
  });

  // Step 1: Handle credentials
  const handleCredentialsSubmit = (credentials) => {
    setUserData((prev) => ({
      ...prev,
      ...credentials,
    }));
    setStep(2);
  };

  // Step 2: Handle user type selection
  const handleUserTypeSelect = (userType) => {
    setUserData((prev) => ({
      ...prev,
      user_type: userType,
    }));
    setStep(3);
  };

  // Step 3: Handle onboarding completion
  const handleOnboardingComplete = async (profileData) => {
    setIsLoading(true);

    try {
      // Register the user
      const res = await register({
        username: userData.username,
        password: userData.password,
        user_type: userData.user_type,
      });

      if (!res?.id) throw new Error("Registration failed");

      // Store profile data for later (if needed)
      sessionStorage.setItem(
        "pendingProfileData",
        JSON.stringify({
          userId: res.id,
          profileData,
          userType: userData.user_type,
        })
      );

      setAlertInfo({ status: "success", message: "Registration successful! Setting up your profile..." });
      
      // Wait a moment then save profile and redirect
      setTimeout(() => {
        saveProfileData(res.id, profileData);
      }, 1000);
    } catch (err) {
      setAlertInfo({
        status: "error",
        message: err.response?.data?.detail || "Registration failed. Please try again.",
      });
      console.error(err);
      setIsLoading(false);
    }
  };

  const saveProfileData = async (userId, profileData) => {
    try {
      const endpoint = getProfileEndpoint(userData.user_type);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${endpoint}/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) throw new Error("Failed to save profile");

      setAlertInfo({ status: "success", message: "Profile created successfully!" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      setAlertInfo({
        status: "error",
        message: "Profile saved but there was an issue. You can update it later.",
      });
      setTimeout(() => navigate("/login"), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileEndpoint = (userType) => {
    const endpoints = {
      student: "/users/student",
      outdoor_worker: "/users/outdoor-worker",
      office_worker: "/users/office-worker",
      home_based: "/users/home-based",
    };
    return endpoints[userType] || "/users/student";
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
      {alertInfo && (
        <AlertTemplate alertInfo={alertInfo} onClose={() => setAlertInfo(null)} />
      )}

      {step === 1 && (
        <CredentialsStep
          onSubmit={handleCredentialsSubmit}
          userData={userData}
          setUserData={setUserData}
        />
      )}

      {step === 2 && (
        <UserTypeSelection
          onSelect={handleUserTypeSelect}
          onBack={handleBack}
        />
      )}

      {step === 3 && (
        <div>
          {userData.user_type === "student" && (
            <StudentOnboarding
              onComplete={handleOnboardingComplete}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
          {userData.user_type === "outdoor_worker" && (
            <OutdoorWorkerOnboarding
              onComplete={handleOnboardingComplete}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
          {userData.user_type === "office_worker" && (
            <OfficeWorkerOnboarding
              onComplete={handleOnboardingComplete}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
          {userData.user_type === "home_based" && (
            <HomeBasedOnboarding
              onComplete={handleOnboardingComplete}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </>
  );
}

export default RegisterFlow;
