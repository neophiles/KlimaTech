import { useEffect, useState } from "react";
import TipContainer from "./TipContainer";
import "./InitTipsWidget.css";

function InitTipsWidget({ barangayId }) {
    const [tips, setTips] = useState([]);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                // TODO: Replace hardcoded barangayId with actual barangayId when available
                const res = await fetch(`api/suggestions/tips/${1}`);
                if (!res.ok) throw new Error("Failed to fetch tips");
                const data = await res.json();
                setTips(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTips();
    }, [barangayId]);

    const doTips = tips.filter(t => t.is_do);
    const dontTips = tips.filter(t => !t.is_do);

    return (
        <div className="base-widget raised-widget inittips-widget">
            <div className="heading">Ano ang gagawin ko ngayong araw?</div>

            <div className="container do">
                <span className="subheading">GAWIN</span>
                {doTips.map((tip, i) => (
                    <TipContainer
                        key={i}
                        isDo={tip.is_do}
                        mainText={tip.main_text}
                        subText={tip.sub_text}
                    />
                ))}
            </div>

            <div className="container dont">
                <span className="subheading">HUWAG GAWIN</span>
                {dontTips.map((tip, i) => (
                    <TipContainer
                        key={i}
                        isDo={tip.is_do}
                        mainText={tip.main_text}
                        subText={tip.sub_text}
                    />
                ))}
            </div>
        </div>
    );
}

export default InitTipsWidget;
