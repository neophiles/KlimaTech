import { getIndexByHeat, getColorByIndex } from "../../scripts/utils"

function AdvisoryWidget({ heatIndex, riskLevel, advice }) {
    const index = getIndexByHeat(heatIndex);
    const bgColor = getColorByIndex(index);

    // const gradients = [
    //     "linear-gradient(to bottom right, #4caf50 0%, #81C784 65%)",
    //     "linear-gradient(to bottom right, #FFEB3B 0%, #FF9800 65%)",
    //     "linear-gradient(to bottom right, #B40000 0%, #FF8A00 65%)",
    //     "linear-gradient(to bottom right, #8B0000 0%, #FF4500 65%)",
    //     "linear-gradient(to bottom right, #5A0000 0%, #FF0000 65%)"
    // ];
    // const fontColors = ["#fff", "#333", "#FFC90A", "#fff", "#fff"];

    // const topGradient = gradients[index];
    // const fontColor = fontColors[index];

    return (
        <div className="base-widget raised-widget  advisory-widget">
            <div className="top-half" style={{ backgroundColor: bgColor }}>
                <h1 className="warning">{ riskLevel }</h1>    
            </div>
            <div className="bottom-half">
                <p className="advice">{ advice }</p>
            </div>
        </div>
    );
}

export default AdvisoryWidget;