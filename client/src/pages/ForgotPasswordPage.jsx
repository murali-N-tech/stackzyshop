import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }
            setMessage(data.message);
            // On success, redirect to the reset password page
            navigate('/reset-password'); 
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
                    <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Forgot Password</h1>
                    <p className="text-gray-500 mb-8 text-center">
                        Enter your email to receive a password reset OTP.
                    </p>

                    {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
                    {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                    <form onSubmit={submitHandler} className="space-y-6">
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-blue-400 flex items-center justify-center"
                        >
                            <FaPaperPlane className="mr-2" />
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>

                    <div className="py-4 text-center">
                        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;