import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../actions/authActions"; // Assuming these actions exist
import { RootState, AppDispatch } from "../store";
import { getOrganizations } from "../api/organization";
import { Organization } from "../types";

const LoginPage: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    organization: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const authError = useSelector((state: RootState) => state.auth.error);

  // Fetch organizations when component mounts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error("Failed to fetch organizations", error);
      }
    };
    fetchOrganizations();
  }, []);

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    dispatch(login({ email: loginForm.email, password: loginForm.password }));
  };

  // Handle registration form submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!registerForm.organization) {
      setErrorMessage("Please select an organization.");
      return;
    }
    dispatch(
      register({
        email: registerForm.email,
        password: registerForm.password,
        full_name: registerForm.fullName,
        organization: parseInt(registerForm.organization),
      })
    );
    setErrorMessage("");
  };

  // Toggle between login and registration forms
  const toggleForm = () => {
    setShowRegistration(!showRegistration);
    setErrorMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-purple-700">
          {showRegistration ? "Register" : "Login"}
        </h1>

        {/* Login Form */}
        {!showRegistration && (
          <form onSubmit={handleLogin} className="space-y-6 mt-4">
            <div>
              <label className="text-gray-700">Email:</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Password:</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* Registration Form */}
        {showRegistration && (
          <form onSubmit={handleRegister} className="space-y-6 mt-4">
            <div>
              <label className="text-gray-700">Full Name:</label>
              <input
                type="text"
                value={registerForm.fullName}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, fullName: e.target.value })
                }
                placeholder="Enter full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Email:</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Password:</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Confirm Password:</label>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Re-enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Organization:</label>
              <select
                value={registerForm.organization}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    organization: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="" disabled>
                  Select organization
                </option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={toggleForm}
            className="text-purple-600 hover:underline"
          >
            {showRegistration
              ? "Already have an account? Login"
              : "Don’t have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

