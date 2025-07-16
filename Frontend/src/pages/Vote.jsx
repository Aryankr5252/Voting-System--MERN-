import { useEffect, useState } from 'react';
import { getCandidates, castVote } from '../services/candidate';
import { useNavigate } from 'react-router-dom';

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState('');
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      setHasVoted(data.hasVoted);
      setVotedCandidateId(data.votedFor);
    } catch (err) {
      console.error('Failed to fetch user profile');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCandidates = async () => {
      try {
        const data = await getCandidates();
        setCandidates(data);

        await fetchUser(); // 🔁 get latest hasVoted from backend
      } catch (error) {
        setMessage('Failed to load candidates');
      }
    };

    fetchCandidates();
  }, []);


  const handleVote = async (id) => {
    try {
      const res = await castVote(id, token);
      setMessage(res.msg);
      setHasVoted(true);
      setVotedCandidateId(id); // ✅ store voted candidate ID
      await fetchUser(); // 🟢 refresh user info after voting
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Error voting');
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Cast Your Vote</h2>
      {message && <p className="mb-4 text-blue-600 font-semibold">{message}</p>}

      <div className="grid gap-4">
        {candidates.map((candidate) => {
  const isVotedForThis = candidate._id === votedCandidateId;

  return (
    <div
      key={candidate._id}
      className={`border p-4 rounded shadow flex justify-between items-center ${
        isVotedForThis ? 'bg-green-100 border-green-400 shadow-lg shadow-green-200' : ''
      }`}
    >
      <div>
        <h3 className="text-xl font-semibold">{candidate.name}</h3>
        <p className="text-gray-600">Party: {candidate.party}</p>
        <p className="text-sm text-gray-400">Votes: {candidate.voteCount}</p>
      </div>

      {hasVoted ? (
        isVotedForThis ? (
          <span className="text-green-700 font-semibold">Voted ✅</span>
        ) : null
      ) : (
        <button
          onClick={() => handleVote(candidate._id)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Vote
        </button>
      )}
    </div>
  );
})}
      </div>
    </div>
  );
};

export default Vote;
