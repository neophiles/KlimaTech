import "./TipContainer.css";

function TipContainer({ isDo = true, mainText = "", subText = "" }) {
    const tipType = isDo ? "do" : "dont";

    const tipIcon = {
        "do": (
            <svg className="nav-btn-icon icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M9 12l2 2l4 -4" />
            </svg>
        ),
        "dont": (
            <svg className="nav-btn-icon icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" />
                <path d="M9 8l6 8" />
                <path d="M15 8l-6 8" />
            </svg>
        )
    }

    const subTextIcon = {
        "do": (
            <svg className="nav-btn-icon sub-text-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        "dont": (
            <svg className="nav-btn-icon sub-text-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 9v4" />
                <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                <path d="M12 16h.01" />
            </svg>
        )
    }

    return (
        <div className={`tip-container ${tipType}`}>
            {tipIcon[tipType]}
            <div className="tip-texts">
                <span className="main-text">{mainText}</span>
                <div className="sub-text-container">
                    {subTextIcon[tipType]}
                    <span className="sub-text">{subText}</span>
                </div>
            </div>
        </div>
    );
}

export default TipContainer;