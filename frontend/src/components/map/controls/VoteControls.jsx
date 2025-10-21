import React from "react";
import "../modals/CoolSpotModal.css"; // reuse modal styles from modals folder
import useSpotVotes from "../../hooks/useSpotVotes";

function VoteButton({ active, onClick, children, className }) {
  return (
    <button className={`vote-btn ${className} ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function VoteControls({ spotId }) {
  const { likes, dislikes, userVote, loading, vote } = useSpotVotes(spotId);

  if (loading) return <div>Loading votes…</div>;

  return (
    <div className="modal-votes">
      <VoteButton className="up" active={userVote === "like"} onClick={() => vote("like")}>
        {/* reuse svg icons from your current file; simplified here */}
        <span>👍</span>
      </VoteButton>
      <div className="vote-count">{likes}</div>
      <div className="vote-bar">
        <div className="vote-bar-up" style={{ width: `${(likes/(likes+dislikes||1))*100}%` }} />
        <div className="vote-bar-down" style={{ width: `${(dislikes/(likes+dislikes||1))*100}%` }} />
      </div>
      <div className="vote-count">{dislikes}</div>
      <VoteButton className="down" active={userVote === "dislike"} onClick={() => vote("dislike")}>
        <span>👎</span>
      </VoteButton>
    </div>
  );
}