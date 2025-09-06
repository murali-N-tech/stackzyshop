import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { FaLock } from 'react-icons/fa';

const ResetPasswordPage = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }
            dispatch(setCredentials(data));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 px-4">
            <div className="w-full max-w-md mx-auto animation-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Reset Password</h1>
                    <p className="text-gray-500 mb-8 text-center">
                        Enter your OTP and new password.
                    </p>

                    {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Enter new password"
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
                                placeholder="Confirm new password"
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
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;