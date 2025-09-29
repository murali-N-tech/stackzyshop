// File: murali-n-tech/stackzyshop/stackzyshop-3235c54223918767faa652b708cef5187c89e7e7/client/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { FaEnvelope, FaLock, FaSignInAlt, FaPhone } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to log in');
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
        const res = await fetch('/api/users/google-auth', {
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
    <div className="flex justify-center items-center min-h-[70vh] bg-secondary px-4">
      <div className="w-full max-w-4xl mx-auto animation-fade-in">
        <div className="bg-white rounded-lg shadow-2xl flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h1 className="text-3xl font-bold mb-2 text-dark">Welcome Back!</h1>
            <p className="text-gray-500 mb-8">Sign in to continue to ShopSphere.</p>
            
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition"
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
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition"
                  required
                />
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-blue-400 flex items-center justify-center"
              >
                <FaSignInAlt className="mr-2"/>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <br/>
            <br/>

            <GoogleLogin
                            onSuccess={googleSuccess}
                            onError={googleFailure}
            />

            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <Link to="/phone-login" className="w-full bg-accent hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center">
              <FaPhone className="mr-2" />
              Login with Phone
            </Link>
            

            <div className="py-4 text-center">
              <span className="text-gray-600">New Customer? </span>
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Register here
              </Link>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="hidden md:block w-1/2 bg-primary rounded-r-lg p-12 text-white text-center flex flex-col justify-center">
             <h2 className="text-3xl font-bold mb-4">Discover a World of Products</h2>
             <p>Sign in to access your cart, wishlist, and personalized recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;