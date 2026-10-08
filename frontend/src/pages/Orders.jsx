import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/orders");
            setOrders(response.data || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Unable to load your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) return;

        try {
            await api.put(`/orders/${orderId}/cancel`);

            setOrders((current) =>
                current.map((order) =>
                    order.id === orderId
                        ? { ...order, status: "CANCELLED" }
                        : order
                )
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message || "Unable to cancel the order."
            );
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";

            case "CONFIRMED":
                return "bg-blue-100 text-blue-800 border-blue-200";

            case "SHIPPED":
                return "bg-purple-100 text-purple-800 border-purple-200";

            case "DELIVERED":
                return "bg-green-100 text-green-800 border-green-200";

            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200";

            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING":
                return "⏳";

            case "CONFIRMED":
                return "✅";

            case "SHIPPED":
                return "🚚";

            case "DELIVERED":
                return "📦";

            case "CANCELLED":
                return "❌";

            default:
                return "📋";
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Header */}
            <section className="mb-8 rounded-3xl border border-amber-300/30 bg-green-950/90 p-7 shadow-2xl sm:p-10">

                <div className="mb-3 inline-flex rounded-full border border-amber-400/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                    📦 AgriTrade Marketplace
                </div>

                <h1 className="text-4xl font-black text-white sm:text-5xl">
                    My Orders
                </h1>

                <p className="mt-3 max-w-2xl text-green-100/80">
                    Track your agricultural purchases and manage your orders.
                </p>
            </section>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-5 py-4 text-red-700 shadow">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="space-y-5">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-56 animate-pulse rounded-2xl bg-white/30"
                        />
                    ))}

                </div>
            ) : orders.length === 0 ? (

                /* Empty State */
                <div className="rounded-3xl bg-white/95 p-12 text-center shadow-xl">

                    <div className="text-7xl">
                        📦
                    </div>

                    <h2 className="mt-5 text-2xl font-bold text-gray-900">
                        No orders yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-gray-500">
                        You haven't placed any orders yet. Explore our marketplace
                        and find fresh agricultural products.
                    </p>

                    <Link
                        to="/crops"
                        className="mt-6 inline-block rounded-xl bg-green-700 px-7 py-3 font-bold text-white shadow-lg transition hover:bg-green-800"
                    >
                        🌾 Browse Crops
                    </Link>

                </div>
            ) : (

                /* Orders */
                <div className="space-y-6">

                    {orders.map((order) => (

                        <article
                            key={order.id}
                            className="overflow-hidden rounded-3xl border border-white/30 bg-white/95 shadow-xl"
                        >

                            {/* Order Header */}
                            <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-5 sm:px-7">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Order
                                        </p>

                                        <h2 className="mt-1 text-xl font-black text-gray-900">
                                            #{order.id}
                                        </h2>

                                        {order.createdAt && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${getStatusStyle(
                                            order.status
                                        )}`}
                                    >
                    <span>
                      {getStatusIcon(order.status)}
                    </span>

                                        {order.status}
                                    </div>

                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-5 py-6 sm:px-7">

                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                                    Order Items
                                </h3>

                                <div className="space-y-4">

                                    {(order.items || []).map((item, index) => (

                                        <div
                                            key={item.id || index}
                                            className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div className="flex items-center gap-4">

                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-3xl">
                                                    🌾
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {item.crop?.name ||
                                                            item.cropName ||
                                                            `Crop #${item.cropId}`}
                                                    </h4>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="text-left sm:text-right">

                                                <p className="text-xs text-gray-500">
                                                    Price
                                                </p>

                                                <p className="font-semibold text-gray-700">
                                                    ₹{item.price}
                                                </p>

                                                <p className="mt-1 text-lg font-black text-green-700">
                                                    ₹{item.subtotal}
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                                {/* Bottom */}
                                <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total Amount
                                        </p>

                                        <p className="text-3xl font-black text-green-800">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                    {order.status === "PENDING" && (
                                        <button
                                            onClick={() => cancelOrder(order.id)}
                                            className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-bold text-red-600 transition hover:bg-red-100"
                                        >
                                            Cancel Order
                                        </button>
                                    )}

                                </div>

                            </div>

                            {/* Status Progress */}
                            {order.status !== "CANCELLED" && (
                                <OrderProgress status={order.status} />
                            )}

                        </article>

                    ))}

                </div>
            )}

        </div>
    );
}


/* ---------------- ORDER PROGRESS ---------------- */

function OrderProgress({ status }) {

    const steps = [
        {
            key: "PENDING",
            label: "Placed",
            icon: "📝",
        },
        {
            key: "CONFIRMED",
            label: "Confirmed",
            icon: "✅",
        },
        {
            key: "SHIPPED",
            label: "Shipped",
            icon: "🚚",
        },
        {
            key: "DELIVERED",
            label: "Delivered",
            icon: "📦",
        },
    ];

    const statusIndex = steps.findIndex(
        (step) => step.key === status
    );

    const currentIndex = statusIndex === -1 ? 0 : statusIndex;

    return (
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-6 sm:px-7">

            <div className="flex items-start justify-between">

                {steps.map((step, index) => {

                    const completed = index <= currentIndex;

                    return (
                        <div
                            key={step.key}
                            className="relative flex flex-1 flex-col items-center"
                        >

                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-1/2 top-5 h-1 w-full ${
                                        index < currentIndex
                                            ? "bg-green-600"
                                            : "bg-gray-200"
                                    }`}
                                />
                            )}

                            <div
                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm ${
                                    completed
                                        ? "border-green-600 bg-green-600 text-white"
                                        : "border-gray-300 bg-white text-gray-400"
                                }`}
                            >
                                {step.icon}
                            </div>

                            <p
                                className={`mt-2 text-center text-xs font-semibold ${
                                    completed
                                        ? "text-green-700"
                                        : "text-gray-400"
                                }`}
                            >
                                {step.label}
                            </p>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default Orders;