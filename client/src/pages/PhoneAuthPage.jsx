import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { FaPhone, FaKey } from "react-icons/fa";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// 🔑 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCJ69xsNNNMmD7WaEBZZKhCVkzKFFXPdXQ",
  authDomain: "stackzyshop.firebaseapp.com",
  projectId: "stackzyshop",
  storageBucket: "stackzyshop.firebasestorage.app",
  messagingSenderId: "620408027113",
  appId: "1:620408027113:web:25b922cc2a0d7b693f3d78",
  measurementId: "G-XCQP4N7QPR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
  const baseStyles =
    "px-6 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const PhoneAuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);

  const [confirmationResult, setConfirmationResult] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha verified ✅");
        },
      });
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, "+91" + phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep(2);
      setTimer(30);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationResult) return setError("Please request OTP first");
    setLoading(true);
    setError("");
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();

      // 👉 send token to backend to create session
      const res = await fetch("/api/users/phone-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");

      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 px-4">
      <div className="w-full max-w-4xl mx-auto animation-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Phone Login</h1>
            <p className="text-gray-500 mb-8">
              {step === 1 ? "Enter your phone number to receive an OTP." : "Enter the OTP sent to your phone."}
            </p>

            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="relative">
                  <FaPhone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="relative">
                  <FaKey className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Verifying..." : "Verify OTP & Log In"}
                </Button>

                {/* Resend OTP with cooldown */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSendOtp}
                  disabled={timer > 0 || loading}
                  className="w-full mt-4"
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </Button>

                <Button variant="secondary" onClick={() => setStep(1)} className="w-full mt-4">
                  Back
                </Button>
              </form>
            )}

            <div className="py-4 text-center">
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                Use Email Login Instead
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:block w-1/2 bg-green-600 rounded-r-2xl p-12 text-white text-center flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Fast & Secure Access</h2>
            <p>Log in instantly with your phone number, no password required.</p>
            <div className="flex justify-center mt-6">
              <FaPhone size={60} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuthPage;
