import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ResultsChart from '../components/ResultsChart';

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState([]);   // winner → winners
  const [winnerStatus, setWinnerStatus] = useState(""); // "winner" | "draw" | ""
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    const checkElectionStatus = async () => {
      const res = await api.get('/admin/election-status');
      setShowWinner(res.data.ended);
      if (res.data.ended) {
        const winnerRes = await api.get('/admin/winner');
        setWinnerStatus(winnerRes.data.status);
        if (winnerRes.data.status === "winner") {
          setWinners([winnerRes.data.winner]);   // ✅ ek ko bhi array me daal do
        } else if (winnerRes.data.status === "draw") {
          setWinners(winnerRes.data.winners);    // ✅ already array hai
        }
      }

    };
    checkElectionStatus();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/vote/results');
        setCandidates(res.data);
      } catch (err) {
        console.error('Error fetching results:', err);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Election Results</h2>
      {candidates.length > 0 ? (
        <ResultsChart data={candidates} />
      ) : (
        <p className="text-gray-500">No votes cast yet or loading...</p>
      )}

      {showWinner && winners.length > 0 && (
        <div className="p-4 my-4 bg-green-100 border border-green-400 rounded">
          {winnerStatus === "winner" ? (
            <>
              <h3 className="text-xl font-bold text-green-700">
                🏆 Winner: {winners[0].name} ({winners[0].party})
              </h3>
              <p className="text-green-600">Total Votes: {winners[0].voteCount}</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-yellow-700">⚖️ It's a Draw!</h3>
              <ul className="list-disc ml-6 text-yellow-600">
                {winners.map((w, i) => (
                  <li key={i}>
                    {w.name} ({w.party}) — {w.voteCount} votes
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default Results;
