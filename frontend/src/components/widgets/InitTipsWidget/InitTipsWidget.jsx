import { useEffect, useState } from "react";
import TipContainer from "./TipContainer";
import "./InitTipsWidget.css";

function InitTipsWidget({ barangayId, currentUser }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTips = async (force = false) => {
    if (!barangayId) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/suggestions/tips/${barangayId}?user_id=${currentUser?.id ?? ""}&force=${force}`
      );

      if (!res.ok) throw new Error("Failed to fetch tips");

      const data = await res.json();
      setTips(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [barangayId, currentUser?.id]);

  const doTips = tips.filter((t) => t.is_do);
  const dontTips = tips.filter((t) => !t.is_do);

  return (
    <div className="base-widget raised-widget inittips-widget">
      <div className="heading">
        Ano ang gagawin ko ngayong araw?
      </div>
    <button
        className="regen-btn"
        onClick={() => fetchTips(true)}
        disabled={loading}
    >
        Regenerate Tips
    </button>

      {loading && <div className="loading">Loading tips...</div>}
      {error && <div className="error-text">Error: {error}</div>}

      {!loading && !error && (
        <>
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
        </>
      )}
    </div>
  );
}

export default InitTipsWidget;
