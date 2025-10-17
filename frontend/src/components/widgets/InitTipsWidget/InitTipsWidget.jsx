import TipContainer from "./TipContainer";
import "./InitTipsWidget.css";

function InitTipsWidget() {
    return (
        <div className="base-widget raised-widget inittips-widget">
            <div className="heading">Ano ang gagawin ko ngayong araw?</div>
            <div className="container do">
                <span className="subheading">GAWIN</span>
                <TipContainer
                    isDo={true}
                    mainText={"Magdala ng payong at tubig"}
                    subText={"Paglabas"}
                />
                <TipContainer
                    isDo={true}
                    mainText={"Manatili sa silid-aralan"}
                    subText={"9AM-5PM"}
                />
                <TipContainer
                    isDo={true}
                    mainText={"Magpahinga sa library o mall"}
                    subText={"After class"}
                />
            </div>
            <div className="container dont">
                <span className="subheading">HUWAG GAWIN</span>
                <TipContainer
                    isDo={false}
                    mainText={"Maglaro sa labas ng tanghalian"}
                    subText={"Panganib: Heat exhaustion"}
                />
                <TipContainer
                    isDo={false}
                    mainText={"Mag-PE sa araw"}
                    subText={"Panganib: Dehydration"}
                />
                <TipContainer
                    isDo={false}
                    mainText={"Maglakad ng matagal walang payong"}
                    subText={"Panganib: Heat stroke"}
                />
            </div>
        </div>
    );
}

export default InitTipsWidget;