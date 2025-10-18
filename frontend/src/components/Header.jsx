import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Header() {
    const navigate = useNavigate();

    const handleGoToHome = () => {
        navigate("/");
    };

    return (
        <header>
            <div className="header-container">
                <Button
                    otherClass={"logo-btn"}
                    onClick={handleGoToHome}
                    children={
                        <>
                            <img className="logo" src="/logo/presko-logo.png" alt="PRESKO LOGO" />
                            <span className="title">PRESKO</span>
                        </>
                    }
                />   
            </div>
        </header>
    );
}

export default Header;