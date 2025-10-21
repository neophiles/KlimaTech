import "./TipContainer.css";

function TipContainer({ isDo = true, mainText = "", subText = "", loading = false }) {
    const tipType = isDo ? "do" : "dont";

    if (loading) {
        // Skeleton placeholder version
        return (
            <div className={`tip-container skeleton`}>
                <div className="skeleton-circle" />
                <div className="skeleton-lines">
                    <div className="skeleton-line main" />
                    <div className="skeleton-line sub" />
                </div>
            </div>
        );
    }

    const tipIcon = {
        "do": (
            <svg className="nav-btn-icon tip-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M9 12l2 2l4 -4" />
            </svg>
        ),
        "dont": (
            <svg className="nav-btn-icon tip-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" />
                <path d="M9 8l6 8" />
                <path d="M15 8l-6 8" />
            </svg>
        ),
    };

    return (
        <div className={`tip-container ${tipType}`}>
            {tipIcon[tipType]}
            <div className="tip-texts">
                <span className="main-text">{mainText}</span>
                <span className="sub-text">{subText}</span>
            </div>
        </div>
    );
}

export default TipContainer;
