import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [crops, setCrops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [cropsResponse, categoriesResponse, ordersResponse] =
                await Promise.all([
                    api.get("/crops"),
                    api.get("/categories"),
                    api.get("/orders"),
                ]);

            setCrops(cropsResponse.data || []);
            setCategories(categoriesResponse.data || []);
            setOrders(ordersResponse.data || []);
        } catch (error) {
            console.error("Unable to load dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalStock = crops.reduce(
        (total, crop) => total + Number(crop.quantity || 0),
        0
    );

    const recentCrops = crops.slice(0, 4);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Hero Section */}
            <section className="relative mb-8 overflow-hidden rounded-3xl border border-amber-300/40 bg-gradient-to-br from-green-950/95 via-green-900/90 to-green-800/90 p-7 shadow-2xl sm:p-10">

                {/* Decorative circles */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10" />
                <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-green-400/10" />

                <div className="relative z-10 max-w-3xl">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                        🌱 Welcome to AgriTrade
                    </div>

                    <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
                        Connecting Farmers
                        <span className="block text-amber-300">
              With Better Markets
            </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-green-100 sm:text-lg">
                        Buy fresh agricultural products, manage your crops and
                        track your orders — all from one simple marketplace.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                        <Link
                            to="/crops"
                            className="rounded-xl bg-amber-400 px-6 py-3 text-center font-bold text-green-950 shadow-lg transition hover:bg-amber-300"
                        >
                            🌾 Explore Crops
                        </Link>

                        <Link
                            to="/orders"
                            className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20"
                        >
                            📦 View My Orders
                        </Link>

                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                    icon="🌾"
                    title="Available Crops"
                    value={loading ? "—" : crops.length}
                    description="Products listed"
                />

                <StatCard
                    icon="📂"
                    title="Categories"
                    value={loading ? "—" : categories.length}
                    description="Product categories"
                />

                <StatCard
                    icon="📦"
                    title="My Orders"
                    value={loading ? "—" : orders.length}
                    description="Orders placed"
                />

                <StatCard
                    icon="📊"
                    title="Total Stock"
                    value={loading ? "—" : totalStock}
                    description="Items available"
                />

            </section>

            {/* Quick Actions */}
            <section className="mb-8">

                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        Quick Actions
                    </h2>

                    <p className="text-sm text-green-100/80">
                        Manage your AgriTrade account
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <QuickAction
                        to="/crops"
                        icon="🌾"
                        title="Browse Crops"
                        description="Explore fresh agricultural products"
                    />

                    <QuickAction
                        to="/categories"
                        icon="📂"
                        title="Categories"
                        description="Browse products by category"
                    />

                    <QuickAction
                        to="/orders"
                        icon="📦"
                        title="My Orders"
                        description="Track and manage your orders"
                    />

                </div>
            </section>

            {/* Featured Crops */}
            <section>

                <div className="mb-5 flex items-end justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Featured Crops
                        </h2>

                        <p className="mt-1 text-sm text-green-100/80">
                            Fresh products available in the marketplace
                        </p>
                    </div>

                    <Link
                        to="/crops"
                        className="hidden font-semibold text-amber-300 transition hover:text-amber-200 sm:block"
                    >
                        View All →
                    </Link>

                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-64 animate-pulse rounded-2xl bg-white/20"
                            />
                        ))}
                    </div>
                ) : recentCrops.length === 0 ? (
                    <div className="rounded-2xl border border-white/20 bg-white/90 p-10 text-center shadow-xl">
                        <div className="text-5xl">🌱</div>

                        <h3 className="mt-4 text-xl font-bold text-gray-800">
                            No crops available
                        </h3>

                        <p className="mt-2 text-gray-500">
                            There are currently no crops listed in the marketplace.
                        </p>

                        <Link
                            to="/crops"
                            className="mt-5 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
                        >
                            Browse Crops
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {recentCrops.map((crop) => (
                            <div
                                key={crop.id}
                                className="group overflow-hidden rounded-2xl border border-white/30 bg-white/95 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >

                                {/* Crop Icon */}
                                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-100 to-emerald-50">
                  <span className="text-6xl transition duration-300 group-hover:scale-110">
                    🌾
                  </span>
                                </div>

                                <div className="p-5">

                                    <h3 className="truncate text-lg font-bold text-gray-900">
                                        {crop.name}
                                    </h3>

                                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gray-500">
                                        {crop.description || "Fresh agricultural product"}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Price
                                            </p>

                                            <p className="text-xl font-black text-green-700">
                                                ₹{crop.price}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">
                                                Stock
                                            </p>

                                            <p
                                                className={`font-bold ${
                                                    crop.quantity > 0
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {crop.quantity}
                                            </p>
                                        </div>

                                    </div>

                                    <Link
                                        to={`/crops/${crop.id}`}
                                        className="mt-4 block rounded-xl bg-green-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-800"
                                    >
                                        View Details
                                    </Link>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

                <Link
                    to="/crops"
                    className="mt-5 block text-center font-semibold text-amber-300 hover:text-amber-200 sm:hidden"
                >
                    View All Crops →
                </Link>

            </section>

        </div>
    );
}


/* ---------------- STAT CARD ---------------- */

function StatCard({ icon, title, value, description }) {
    return (
        <div className="rounded-2xl border border-white/20 bg-white/95 p-5 shadow-xl backdrop-blur transition hover:-translate-y-1">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-1 text-3xl font-black text-green-800">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        {description}
                    </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
                    {icon}
                </div>

            </div>

        </div>
    );
}


/* ---------------- QUICK ACTION ---------------- */

function QuickAction({ to, icon, title, description }) {
    return (
        <Link
            to={to}
            className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/95 p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-white"
        >

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-3xl transition group-hover:scale-110">
                {icon}
            </div>

            <div>
                <h3 className="font-bold text-gray-900">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <span className="ml-auto text-xl text-green-700">
        →
      </span>

        </Link>
    );
}

export default Dashboard;