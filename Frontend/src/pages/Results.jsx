import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ResultsChart from '../components/ResultsChart';

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    const checkElectionStatus = async () => {
      const res = await api.get('/admin/election-status');
      setShowWinner(res.data.ended);
      if (res.data.ended) {
        const winnerRes = await api.get('/admin/winner');
        setWinner(winnerRes.data);
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

      {showWinner && winner && (
        <div className="p-4 my-4 bg-green-100 border border-green-400 rounded">
          <h3 className="text-xl font-bold text-green-700">🏆 Winner: {winner.name} ({winner.party})</h3>
          <p className="text-green-600">Total Votes: {winner.voteCount}</p>
        </div>
      )}
    </div>
  );
};

export default Results;
