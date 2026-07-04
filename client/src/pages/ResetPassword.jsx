import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const inputRefs = React.useRef([]);

  const inputHandler = (e, index) => {
    if (e.target.value > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const keyDownHandler = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen sm:px-24">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mb-8"
      />

      <form className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl text-center mb-4 font-semibold">
          Reset Password
        </h1>
        <p className="text-indigo-300 mb-6 text-center">
          Enter your E-Mail address.
        </p>

        <div className="mb-4 flex items-center w-full px-5 py-2.5 rounded-full gap-3 bg-[#333A5C]">
          <img src={assets.mail_icon} className="w-3 h-3" />
          <input
            type="email"
            placeholder="E-Mail Id"
            className="bg-transparent outline-none text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-center text-white">
            Submit
          </button>
        </div>
      </form>

      {/* otp to reset password */}
      <form className="bg-slate-900 rounded-lg p-8 shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl text-center mb-4 font-semibold">
          Reset Password OTP
        </h1>
        <p className="text-indigo-300 mb-6 text-center">
          Enter the 6-digit code sent to your Email Id.
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                required
                className="w-12 h-12 rounded-md bg-[#333A5C] text-xl text-white text-center"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => inputHandler(e, index)}
                onKeyDown={(e) => keyDownHandler(e, index)}
              />
            ))}
        </div>

        <button className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-center text-white"></button>
      </form>
    </div>
  );
};

export default ResetPassword;
