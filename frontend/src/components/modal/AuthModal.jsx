import { useState } from "react";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import "./Modal.css";

function AuthModal({ isOpen, onClose, onConfirm }) {
    const [mode, setMode] = useState("register");

    if (!isOpen) return null;

    return mode === "register" ? (
        <RegisterModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={(data) => onConfirm(data, true)}
            onSwitchMode={() => setMode("login")}
        />
    ) : (
        <LoginModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={(data) => onConfirm(data, false)}
            onSwitchMode={() => setMode("register")}
        />
    );
}

export default AuthModal;
