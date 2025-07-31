import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import ResultsChart from '../components/ResultsChart';


const AdminPanel = () => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [msg, setMsg] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.isAdmin) {
      navigate('/');
      return;
    }

    fetchResults();
  }, []);

  const handleDeleteAll = async () => {
    try {
      const res = await api.delete('/admin/delete-candidates', {
        headers: {
          Authorization: token,
        },
      });
      alert(res.data.msg);
      fetchResults(); // refresh chart
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete');
    }
  };


  const fetchResults = async () => {
    try {
      const res = await api.get('/admin/results', {
        headers: { Authorization: token },
      });
      setCandidates(res.data);
    } catch (err) {
      setMsg('Failed to fetch results');
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    console.log({ name, party });
    try {
      const res = await api.post(
        '/admin/add-candidate',
        { name, party },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMsg(res.data.msg);
      setName('');
      setParty('');
      fetchResults(); // refresh results
    } catch (err) {
      console.log('Error:', err);
      setMsg(err.response?.data?.msg || 'Error adding candidate');
    }
  };

  const handleReset = async () => {
    try {
      const res = await api.post('/admin/reset', {}, {
        headers: { Authorization: token }
      });
      setMsg(res.data.msg);
      fetchResults();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Failed to reset');
    }
  };


  const handleSetElection = async () => {
    try {
      const res = await api.post(
        '/admin/election',
        { endDate },
        { headers: { Authorization: token } }
      );
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Failed to set time');
    }
  };



  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {msg && <p className="text-blue-600 mb-2">{msg}</p>}

      <form onSubmit={handleAddCandidate} className="space-y-4 mb-8 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Party Name"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Candidate
        </button>

      </form>
      <div className="my-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Set Voting End Time</h3>
        <input
          type="datetime-local"
          className="p-2 border rounded mr-2"
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={handleSetElection}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Time
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Voting Results</h3>
      <div className="space-y-2">
        {candidates.map((c) => (
          <div
            key={c._id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">{c.party}</p>
            </div>
            <span className="text-lg font-bold">{c.voteCount} 🗳️</span>
          </div>
        ))}
      </div>

      {candidates.length > 0 && <ResultsChart data={candidates} />}

      {/* <button
        onClick={handleReset}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Reset Election
      </button> */}
      <button
        onClick={handleDeleteAll}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Reset Voting
      </button>

    </div>
  );
};

export default AdminPanel;
