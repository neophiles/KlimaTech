import "./GreetingWidget.css";

function GreetingWidget({ username, barangay, locality, province }) {
    const currentTime = new Date().getHours();

    const greeting = 
        currentTime >= 5 && currentTime < 12 ? "Good morning" :
        currentTime >= 12 && currentTime < 18 ? "Good afternoon" :
        currentTime >= 18 && currentTime < 22 ? "Good evening" :
        "Good night";

    const displayName =
        username && username.trim().length > 0
        ? username.charAt(0).toUpperCase() + username.slice(1)
        : "User";

    return (
        <div className="base-widget greeting-widget">
            <div className="container">
                <div className="greeting-container">
                    <span className="greeting">{greeting},</span>
                    <span className="username">{displayName}!</span>
                </div>
                <div className="location-outer-container">
                    <svg className="nav-btn-icon user-location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h2.5" />
                        <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" />
                        <path d="M19 18v.01" />
                    </svg>
                    <div className="location-inner-container">
                        <span className="barangay">{barangay}</span>
                        <span className="locality">{locality}, {province}</span>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default GreetingWidget;