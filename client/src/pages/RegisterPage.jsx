import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleSuccess = async (res) => {
    const decoded = jwtDecode(res.credential);
    const { name, email, sub } = decoded;

    try {
        const res = await fetch('/api/users/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, googleId: sub }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Google login failed');
        }
        dispatch(setCredentials(data));
        navigate('/');
    } catch (error) {
        setError(error.message);
    }
  };

  const googleFailure = (error) => {
    console.error(error);
    setError('Google Sign In was unsuccessful. Try again later');
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 px-4">
      <div className="w-full max-w-4xl mx-auto animation-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Create an Account</h1>
            <p className="text-gray-500 mb-8">Join ShopSphere today!</p>
            
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="relative">
                <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
               <div className="relative">
                <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-blue-400 flex items-center justify-center"
              >
                <FaUserPlus className="mr-2"/>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
            />

            <div className="py-4 text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                Login here
              </Link>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="hidden md:block w-1/2 bg-blue-600 rounded-r-2xl p-12 text-white text-center flex flex-col justify-center">
             <h2 className="text-3xl font-bold mb-4">Start Your Journey With Us</h2>
             <p>Create an account to enjoy faster checkout and a personalized shopping experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;