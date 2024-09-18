import { Transition } from "@headlessui/react";
import React, { useState } from "react";

function SignIn({ onSignIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const userName = "admin";
  const correctPassword = "Admin123$$";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
  };

  const handleSignup = () => {
    // Handle signup logic
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === correctPassword && username === userName) {
        setUsername("");
        setPassword("");
        setLoading(false);
        onSignIn();
      } else {
        setShowError(true);
        setLoading(false);
      }
    }, 1000); // Simulate loading time
  };

  return (
    <div className="bg-gray-50 font-[sans-serif]">
      
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-lg w-full">
          <div className="p-8 rounded-2xl bg-white shadow mb-20">
            {/* Header with logo and website name */}
            <div className="flex items-center justify-center mb-6">
              {/*<img src="/path/to/logo.png" alt="Logo" className="w-12 h-12 mr-2" />*/}
            </div>
            <h2 className="text-gray-800 text-center text-[25px] font-bold">
              Sign in
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  User name
                </label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter user name"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="10"
                      cy="7"
                      r="6"
                      data-original="#000000"
                    ></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter password"
                  />
                  <svg
                    onClick={togglePasswordVisibility}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={showPassword ? "#000" : "#bbb"}
                    stroke={showPassword ? "#000" : "#bbb"}
                    className="w-4 h-4 absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              {/*<div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>*/}

              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center justify-center gap-2 mt-[50px]"
                >
                  {loading && <div className="loader-signin"></div>}

                  {loading ? <>Loading...</> : <>Sign In</>}
                </button>
              </div>
            </form>
            {showError && (
              <Transition
                show={showError}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <p className="text-red-500 text-sm mt-4 text-center">
                  Incorrect username or password!
                </p>
              </Transition>
            )}
          </div>
          {/* Footer */}
          <footer className="text-center text-gray-600 mt-6">
            <p className="text-[15px]">
              © 2024 Monitoring System All Rights Reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
