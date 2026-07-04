import { useContext, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const inputHandler = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const keyDownHandler = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const previousOtp = [...otp];
      previousOtp[index - 1] = "";
      setOtp(previousOtp);
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const nextOtp = [...otp];

    pastedValue.split("").forEach((char, index) => {
      nextOtp[index] = char;
    });

    setOtp(nextOtp);

    const focusIndex = Math.min(pastedValue.length, 5);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email },
      );

      if (data.success) {
        toast.success(data.message || "OTP sent to your email.");
        setStep("otp");
      } else {
        toast.error(data.message || "Unable to send OTP.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        {
          email,
          otp: otpValue,
          newPassword,
        },
      );

      if (data.success) {
        toast.success(data.message || "Password reset successfully.");
        navigate("/login");
      } else {
        toast.error(data.message || "Unable to reset password.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen sm:px-24">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mb-8"
      />

      {step === "email" ? (
        <form
          onSubmit={handleSendOtp}
          className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl text-center mb-4 font-semibold">
            Reset Password
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter your email address to receive a reset code.
          </p>

          <div className="mb-4 flex items-center w-full px-5 py-2.5 rounded-full gap-3 bg-[#333A5C]">
            <img src={assets.mail_icon} alt="mail" className="w-3 h-3" />
            <input
              type="email"
              placeholder="E-Mail Id"
              className="bg-transparent outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-center text-white disabled:opacity-70"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleResetPassword}
          className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl text-center mb-4 font-semibold">
            Reset Password OTP
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter the 6-digit code sent to your email.
          </p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                type="text"
                inputMode="numeric"
                maxLength={1}
                key={index}
                value={digit}
                required
                className="w-12 h-12 rounded-md bg-[#333A5C] text-xl text-white text-center"
                ref={(e) => (inputRefs.current[index] = e)}
                onChange={(e) => inputHandler(e, index)}
                onKeyDown={(e) => keyDownHandler(e, index)}
              />
            ))}
          </div>

          <div className="mb-4 flex items-center w-full px-5 py-2.5 rounded-full gap-3 bg-[#333A5C]">
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 flex items-center w-full px-5 py-2.5 rounded-full gap-3 bg-[#333A5C]">
            <input
              type="password"
              placeholder="Confirm Password"
              className="bg-transparent outline-none text-white w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-center text-white disabled:opacity-70"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
