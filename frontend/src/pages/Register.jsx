import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setMessage(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }
            );

            const token = response.data.token;

            // Save JWT
            localStorage.setItem("token", token);

            // Go to dashboard
            navigate("/");
        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">

            <div className="w-full max-w-md">

                {/* Logo */}

                <div className="mb-8 text-center">

                    <div className="text-5xl">
                        🌾
                    </div>

                    <h1 className="mt-3 text-3xl font-bold text-green-700">
                        AgriTrade
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Join the agricultural marketplace
                    </p>

                </div>

                {/* Register Card */}

                <div className="rounded-2xl bg-white p-8 shadow-lg">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Create Account
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Create your AgriTrade account.
                    </p>

                    {/* Error */}

                    {message && (
                        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {message}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                    >

                        {/* Name */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                        {/* Email */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                        {/* Password */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                        {/* Register */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>

                    </form>

                    {/* Login */}

                    <div className="mt-6 text-center text-sm text-slate-500">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-green-600 hover:text-green-700"
                        >
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;