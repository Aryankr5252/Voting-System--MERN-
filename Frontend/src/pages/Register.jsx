import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import { useAuth } from '../context/AuthContext'; // ✅ STEP 1: Import context

const Register = () => {
  const { setAuth } = useAuth(); // ✅ STEP 2: use setAuth from context

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem('token', data.token); // ✅ Save token

      // ✅ STEP 3: Decode token & set auth context
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setAuth({
        isLoggedIn: true,
        isAdmin: payload.isAdmin,
        token: data.token,
      });

      setMsg('Registration successful!');
      navigate('/'); // ✅ Redirect
    } catch (error) {
      setMsg(error.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {msg && <p className="text-sm text-red-600 mb-2">{msg}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          className="w-full p-2 border rounded"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
