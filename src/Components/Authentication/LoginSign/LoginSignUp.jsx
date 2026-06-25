import React, { useState, useEffect } from "react";
import { FiSmartphone } from "react-icons/fi";
import authService from "../../../api/authService";
import "./LoginSignUp.css";

const LoginSignUp = () => {
  const [viewMode, setViewMode] = useState("enter-number");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    email: "",
    gender: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Timer for resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const changeView = (newView) => {
    setViewMode(newView);
    setMessage("");
  };

  // Step 1: Send OTP
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const rawNumber = formData.phoneNumber.replace("+91", "").replace(/\s/g, "");
      const formattedPhoneNumber = `91${rawNumber}`;

      await authService.sendOtp({ phoneNumber: formattedPhoneNumber });
      
      setFormData((prev) => ({ ...prev, phoneNumber: formattedPhoneNumber }));
      changeView("enter-otp");
      setResendTimer(60);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send OTP. Check the number.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (verificationCode.length !== 6) {
      setMessage("Please enter the complete 6-digit code.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        phoneNumber: formData.phoneNumber,
        otp: verificationCode,
      };
      const response = await authService.verifyOtp(payload);

      if (response.data.success) {
        // ⭐ NEW: Store the JWT Token for backend authentication
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        if (response.data.isNewUser) {
          changeView("complete-profile");
        } else {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("isLoggedIn", "true");

          // ⭐ NEW: Automatically merge guest cart into user account upon login
          const sessionId = localStorage.getItem("cart_session");
          if (sessionId) {
            try {
              await authService.mergeCart(sessionId);
              localStorage.removeItem("cart_session");
            } catch (mergeErr) {
              console.error("Cart merge failed:", mergeErr);
            }
          }

          setMessage(`Welcome back, ${response.data.user.name}! Redirecting...`);
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      } else {
        setMessage(response.data.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      setMessage("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        phoneNumber: formData.phoneNumber,
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
      };
      const response = await authService.registerUser(payload);
      if (response.data.success) {
        // ⭐ NEW: Store token after successful registration
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isLoggedIn", "true");

        // ⭐ NEW: Merge guest cart after registration
        const sessionId = localStorage.getItem("cart_session");
        if (sessionId) {
          try {
            await authService.mergeCart(sessionId);
            localStorage.removeItem("cart_session");
          } catch (mergeErr) {
            console.error("Cart merge failed:", mergeErr);
          }
        }

        setMessage("Profile created! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage(response.data.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    setMessage("");
    try {
      await authService.sendOtp({ phoneNumber: formData.phoneNumber });
      setMessage("A new code has been sent.");
      setResendTimer(60);
    } catch (err) {
      setMessage("Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const cardBaseClass =
    "bg-white rounded-2xl shadow-lg w-full max-w-md p-8 border border-[#e3dbcf]";

  const renderContent = () => {
    switch (viewMode) {
      case "enter-otp":
        return (
          <div className={cardBaseClass}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f7f2eb] text-[11px] font-medium text-[#7b6a58] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2f261b]" />
              Step 2 · Verify OTP
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="bg-[#2f261b] text-white p-3 rounded-full mb-3">
                <FiSmartphone size={22} />
              </div>
              <h2 className="text-2xl font-bold text-[#2f261b] mb-1">
                Verify your number
              </h2>
              <p className="text-[#7b6a58] text-sm text-center">
                We’ve sent a 6-digit code to{" "}
                <span className="font-medium text-[#3a3126]">
                  {formData.phoneNumber}
                </span>
                .
              </p>
            </div>
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <input
                type="text"
                className="w-full text-center text-xl tracking-[0.5em] border border-[#e3dbcf] rounded-lg py-3 outline-none bg-white text-[#2f261b] focus:ring-2 focus:ring-[#2f261b] focus:border-[#2f261b]"
                placeholder="••••••"
                value={verificationCode}
                maxLength={6}
                required
                inputMode="numeric"
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#2f261b] text-white text-sm font-semibold hover:bg-black transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-[#a18f7b] text-xs mb-1">
                Didn’t get the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className="text-sm text-[#2f261b] font-medium hover:underline disabled:opacity-50"
              >
                {resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : loading
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            </div>
          </div>
        );

      case "complete-profile":
        return (
          <div className={cardBaseClass}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f7f2eb] text-[11px] font-medium text-[#7b6a58] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2f261b]" />
              Step 3 · Complete profile
            </div>

            <h2 className="text-2xl font-semibold text-[#2f261b] mb-2">
              Complete your profile
            </h2>
            <p className="text-xs text-[#7b6a58] mb-6">
              Welcome to Neutee! Just a few details to finish setting up your
              account.
            </p>
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-sm">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                className="w-full border border-[#e3dbcf] rounded-lg px-4 py-3 bg-white text-[#3a3126] focus:ring-2 focus:ring-[#2f261b] outline-none"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                className="w-full border border-[#e3dbcf] rounded-lg px-4 py-3 bg-white text-[#3a3126] focus:ring-2 focus:ring-[#2f261b] outline-none"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full border border-[#e3dbcf] rounded-lg px-4 py-3 bg-white text-[#3a3126] focus:ring-2 focus:ring-[#2f261b] outline-none"
              >
                <option value="" disabled>
                  Select Gender *
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#2f261b] text-white text-sm font-semibold hover:bg-black transition"
              >
                {loading ? "Saving..." : "Create Account"}
              </button>
            </form>
          </div>
        );

      default:
        return (
          <div className={cardBaseClass}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f7f2eb] text-[11px] font-medium text-[#7b6a58] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2f261b]" />
              Step 1 · Enter mobile
            </div>

            <h2 className="text-2xl font-bold text-[#2f261b] mb-2">
              Login or Sign Up
            </h2>
            <p className="text-xs text-[#7b6a58] mb-6">
              Fast, passwordless login using your mobile number.
            </p>

            <form onSubmit={handlePhoneSubmit} className="space-y-6 text-sm">
              <div className="flex items-center border border-[#e3dbcf] rounded-lg overflow-hidden bg-white">
                <span className="px-3 bg-[#f7f2eb] text-[#3a3126] text-xs font-medium border-r border-[#e3dbcf]">
                  +91
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="10-digit mobile number"
                  required
                  value={formData.phoneNumber.replace("+91", "")}
                  onChange={handleChange}
                  maxLength={10}
                  className="flex-1 px-3 py-3 outline-none bg-white text-[#2f261b]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#2f261b] text-white text-sm font-semibold hover:bg-black transition"
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </form>

            <p className="text-[10px] text-[#a18f7b] text-center mt-4">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline hover:text-[#2f261b]">
                Terms of Use
              </a>{" "}
              &{" "}
              <a href="/privacy" className="underline hover:text-[#2f261b]">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#eeeae5] px-4 py-10">
      {renderContent()}

      {message && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-md text-white text-sm ${
            message.toLowerCase().includes("welcome") ||
            message.toLowerCase().includes("sent") ||
            message.toLowerCase().includes("created") ||
            message.toLowerCase().includes("profile")
              ? "bg-emerald-600"
              : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default LoginSignUp;