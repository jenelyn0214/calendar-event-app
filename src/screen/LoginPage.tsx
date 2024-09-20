import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../actions/authActions'; // Assuming these actions exist
import { RootState, AppDispatch } from '../store';
import { getOrganizations } from '../api/organization';
import { Organization } from '../types';

// Dummy Organizations
// const organizations = [
//   { id: 1, name: 'Organization A' },
//   { id: 2, name: 'Organization B' },
//   { id: 3, name: 'Organization C' },
// ];

const LoginPage: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false); // Toggle between login and registration
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organization: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const authError = useSelector((state: RootState) => state.auth.error);


  // Handle Login Form Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    // Dispatch login action
    dispatch(login({ email: loginForm.email, password: loginForm.password }));
  };

  // Handle Registration Form Submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('registerForm',registerForm)
    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!registerForm.organization) {
      setErrorMessage('Please select an organization.');
      return;
    }
    // Dispatch register action
    dispatch(register({
      email: registerForm.email,
      password: registerForm.password,
      full_name: registerForm.fullName,
      organization: parseInt(registerForm.organization),
    }));
    setErrorMessage('');
  };

  // Toggle between login and registration forms
  const toggleForm = () => {
    setShowRegistration(!showRegistration);
    setErrorMessage('');
  };


  useEffect( () => {
    async function  fetchData (){
      try{
        const newOrganizations = await getOrganizations()
        setOrganizations(newOrganizations)
      }catch(error){
        console.log('error')
      }
    }
    fetchData()
  
  }, [])
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {showRegistration ? 'Register' : 'Login'}
      </h1>

      {/* Login Form */}
      {!showRegistration && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="Enter email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {authError && <p className="text-red-500 text-sm">{authError}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {/* Registration Form */}
      {showRegistration && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name:</label>
            <input
              type="text"
              value={registerForm.fullName}
              onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
              placeholder="Enter full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              placeholder="Enter email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password:</label>
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Organization:</label>
            <select
              value={registerForm.organization}
              onChange={(e) => setRegisterForm({ ...registerForm, organization: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>Select organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}

      <p onClick={toggleForm} className="mt-6 text-blue-600 cursor-pointer hover:underline text-center">
        {showRegistration ? 'Already have an account? Login' : 'Don’t have an account? Register'}
      </p>
    </div>
  );
};

export default LoginPage;
