import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register/customer/', { username, password, email, first_name: firstName, last_name: lastName });
      alert('Account created — please login');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Create an account</h2>
        <form onSubmit={submit} className="space-y-3">
          <input required value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full border rounded px-3 py-2" />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2">
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" className="w-1/2 border rounded px-3 py-2" />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" className="w-1/2 border rounded px-3 py-2" />
          </div>
          <button className="w-full bg-orange-500 text-white px-3 py-2 rounded">Create account</button>
        </form>
      </div>
    </div>
  );
}

export default Register;