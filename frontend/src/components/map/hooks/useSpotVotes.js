import { useState, useEffect, useCallback } from "react";
import * as api from "../api/coolspots";

/**
 * useSpotVotes(spotId)
 * - returns { likes, dislikes, userVote, loading, error, vote(type) }
 */
export default function useSpotVotes(spotId, initial = {}) {
  const [likes, setLikes] = useState(initial.likes ?? 0);
  const [dislikes, setDislikes] = useState(initial.dislikes ?? 0);
  const [userVote, setUserVote] = useState(initial.user_vote ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getVotes(spotId)
      .then(data => {
        if (!mounted) return;
        setLikes(data.likes ?? 0);
        setDislikes(data.dislikes ?? 0);
        setUserVote(data.user_vote ?? null);
      })
      .catch(err => setError(err.message || String(err)))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [spotId]);

  const vote = useCallback(async (type) => {
    // optimistic update
    const prev = { likes, dislikes, userVote };
    try {
      // compute optimistic counts
      let newLikes = likes;
      let newDislikes = dislikes;
      if (userVote === type) {
        // unvote
        if (type === "like") newLikes = Math.max(0, newLikes - 1);
        else newDislikes = Math.max(0, newDislikes - 1);
        setUserVote(null);
      } else {
        // switch or new
        if (type === "like") {
          newLikes = newLikes + 1;
          if (userVote === "dislike") newDislikes = Math.max(0, newDislikes - 1);
        } else {
          newDislikes = newDislikes + 1;
          if (userVote === "like") newLikes = Math.max(0, newLikes - 1);
        }
        setUserVote(type);
      }
      setLikes(newLikes);
      setDislikes(newDislikes);

      const result = await api.vote(spotId, type); // server canonical data
      setLikes(result.likes ?? newLikes);
      setDislikes(result.dislikes ?? newDislikes);
      setUserVote(result.user_vote ?? null);
      return result;
    } catch (err) {
      // rollback
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
      setUserVote(prev.userVote);
      setError(err.message || String(err));
      throw err;
    }
  }, [spotId, likes, dislikes, userVote]);

  return { likes, dislikes, userVote, loading, error, vote, setLikes, setDislikes, setUserVote };
}