import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        setOpen(false);
        setMobileOpen(false);
        navigate("/login");
    };

    const closeMobile = () => {
        setMobileOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-green-800/20 bg-green-700 text-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMobile}
                    className="text-2xl font-bold tracking-tight"
                >
                    🌾 AgriTrade
                </Link>

                {/* Desktop Navigation */}
                {token && (
                    <div className="hidden items-center gap-6 md:flex">
                        <Link
                            to="/"
                            className="transition hover:text-green-200"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/categories"
                            className="transition hover:text-green-200"
                        >
                            Categories
                        </Link>

                        <Link
                            to="/crops"
                            className="transition hover:text-green-200"
                        >
                            Crops
                        </Link>

                        <Link
                            to="/orders"
                            className="transition hover:text-green-200"
                        >
                            Orders
                        </Link>
                    </div>
                )}

                {/* Right Side */}
                {token ? (
                    <div className="relative">

                        {/* Desktop Account Button */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="hidden items-center gap-2 rounded-lg bg-green-800 px-4 py-2 transition hover:bg-green-900 md:flex"
                        >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-700">
                👤
              </span>

                            <span className="font-semibold">
                Account
              </span>

                            <span className="text-sm">
                {open ? "▲" : "▼"}
              </span>
                        </button>

                        {/* Desktop Dropdown */}
                        {open && (
                            <div className="absolute right-0 mt-2 hidden w-52 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 md:block">

                                <Link
                                    to="/profile"
                                    onClick={() => setOpen(false)}
                                    className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                                >
                                    👤 My Profile
                                </Link>

                                <Link
                                    to="/orders"
                                    onClick={() => setOpen(false)}
                                    className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                                >
                                    📦 My Orders
                                </Link>

                                <div className="border-t" />

                                <button
                                    onClick={logout}
                                    className="block w-full px-5 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-800 text-xl hover:bg-green-900 md:hidden"
                        >
                            {mobileOpen ? "✕" : "☰"}
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="rounded-lg bg-white px-5 py-2 font-semibold text-green-700 transition hover:bg-green-50"
                    >
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile Menu */}
            {token && mobileOpen && (
                <div className="border-t border-green-600 bg-green-800 px-6 py-4 md:hidden">

                    <div className="flex flex-col gap-2">

                        <Link
                            to="/"
                            onClick={closeMobile}
                            className="rounded-lg px-4 py-3 font-medium hover:bg-green-700"
                        >
                            🏠 Dashboard
                        </Link>

                        <Link
                            to="/categories"
                            onClick={closeMobile}
                            className="rounded-lg px-4 py-3 font-medium hover:bg-green-700"
                        >
                            📂 Categories
                        </Link>

                        <Link
                            to="/crops"
                            onClick={closeMobile}
                            className="rounded-lg px-4 py-3 font-medium hover:bg-green-700"
                        >
                            🌾 Crops
                        </Link>

                        <Link
                            to="/orders"
                            onClick={closeMobile}
                            className="rounded-lg px-4 py-3 font-medium hover:bg-green-700"
                        >
                            📦 Orders
                        </Link>

                        <Link
                            to="/profile"
                            onClick={closeMobile}
                            className="rounded-lg px-4 py-3 font-medium hover:bg-green-700"
                        >
                            👤 My Profile
                        </Link>

                        <div className="my-1 border-t border-green-600" />

                        <button
                            onClick={logout}
                            className="rounded-lg px-4 py-3 text-left font-semibold text-red-200 hover:bg-green-700"
                        >
                            🚪 Logout
                        </button>

                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;