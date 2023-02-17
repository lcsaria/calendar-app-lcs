/* eslint-disable react/react-in-jsx-scope */
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);
  const history = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let login = {email: email, password: password};

    axios.get("http://localhost:8081/login", login).then(
      (res) => {
       console.log(res.data);
       authContext.setIsAuthenticated(true);
       history.push("/dashboard");
      }
    ).catch((err) => {
      console.log(err);
      setError("Invalid credentials");
    })
  };

  return (
    <div>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Log in to your account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
          <input className="border border-gray-400 p-2 w-full" type="email" id="email" name="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
          <input className="border border-gray-400 p-2 w-full" type="password" id="password" name="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600">Log in</button>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;