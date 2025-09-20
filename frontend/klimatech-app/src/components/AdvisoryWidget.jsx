export function AdvisoryWidget() {
    const dangerGradient = "linear-gradient(to bottom right, #B40000 0%, #FF8A00 65%)";
    const dangerFontColor = "#FFC90A";

    return (
        <div className="base-widget raised-widget  advisory-widget">
            <div className="top-half" style={{ backgroundImage: dangerGradient }}>
                <h1 className="warning" style={{ color: dangerFontColor }}>DANGER (35°C)!</h1>    
            </div>
            <div className="bottom-half">
                <p className="advice">Avoid direct sun from 11 AM - 4 PM. Find the nearest water station using the map</p>
            </div>
        </div>
    );
}