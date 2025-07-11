import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ResultsChart from '../components/ResultsChart';

const Results = () => {
  const [candidates, setCandidates] = useState([]);

  const fetchResults = async () => {
    try {
      const res = await api.get('/vote/results');
      setCandidates(res.data);
      console.log(candidates);
    } catch (err) {
      console.error('Error fetching results:', err);
    }
  };

  useEffect(() => {
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
    </div>
  );
};

export default Results;
