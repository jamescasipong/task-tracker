import { Transition } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);

  //const { data, loadings, error } = useFetch("/dataRoute/ip");
  //const { data: ipData, loading: ipLoadings, error: ipError } = useFetch(`/dataRoute/ip/${data?.ip}`);

  useEffect(() => {
    // Focus the username input field when the component mounts
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const userName = "admin";
  const correctPassword = "Admin123$$";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    <div className="w-full bg-gray-100 font-sans">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-2">
        <div className="max-w-md w-full">
          <div className="sm:px-8 sm:py-8 px-5 py-8 rounded-2xl bg-white shadow-lg">
            <div className="flex justify-center mb-0">
              <img src="/favico.png" alt="Logo" className="h-28 w-28" />
            </div>

            {/*<p className="text-center">{ipData?.city && "You're in "}{ipLoadings ? "loading..." : (ipData?.city || "loading...")}</p>
            {error && <p className="text-red-500">{error.message}</p>}*/}

            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
              <div>
                <label className="font-medium text-gray-600 text-sm mb-2 block">
                  User Name
                </label>
                <input
                  name="username"
                  type="text"
                  ref={usernameRef}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full font-serif text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="font-medium text-gray-600 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Enter password"
                  />
                  <svg
                    onClick={togglePasswordVisibility}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={showPassword ? "#000" : "#bbb"}
                    className="w-5 h-5 absolute right-4 cursor-pointer font-medium"
                    viewBox="0 0 128 128"
                  >
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                  </svg>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none flex items-center justify-center gap-2"
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
            <p className="text-sm">© 2024 Monitor360 All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
