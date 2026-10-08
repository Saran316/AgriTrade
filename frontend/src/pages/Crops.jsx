import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ShoppingBasket,
    Search,
    Plus,
    Minus,
    Trash2,
    X,
    GripVertical,
    ArrowLeft,
    ShoppingCart,
} from "lucide-react";

import api from "../services/api";

function Crops() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search
    const [search, setSearch] = useState("");

    // Basket
    const [basket, setBasket] = useState([]);
    const [isBasketOpen, setIsBasketOpen] = useState(false);
    const [isBasketHovered, setIsBasketHovered] = useState(false);

    // Dragging
    const [draggedCrop, setDraggedCrop] = useState(null);

    // Animation
    const [flyingParticles, setFlyingParticles] = useState([]);

    // Basket button reference
    const basketButtonRef = useRef(null);

    // --------------------------------------------------
    // LOAD CROPS
    // --------------------------------------------------

    const fetchCrops = async () => {
        try {
            setLoading(true);

            const response = await api.get("/crops");

            setCrops(response.data);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message || "Unable to load crops"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredCrops = useMemo(() => {
        return crops.filter((crop) =>
            crop.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [crops, search]);

    // --------------------------------------------------
    // BASKET HELPERS
    // --------------------------------------------------

    const getBasketItem = (cropId) => {
        return basket.find((item) => item.id === cropId);
    };

    const getBasketQuantity = (cropId) => {
        return getBasketItem(cropId)?.selectedQty || 0;
    };

    const totalItemCount = basket.reduce(
        (total, item) => total + item.selectedQty,
        0
    );

    const basketTotal = basket.reduce(
        (total, item) => total + item.price * item.selectedQty,
        0
    );

    // --------------------------------------------------
    // ADD TO BASKET
    // --------------------------------------------------

    const addCropToBasket = (crop, quantity = 1, position = null) => {
        if (!crop) return;

        if (crop.quantity <= 0) {
            toast.error("This crop is out of stock");
            return;
        }

        const existing = getBasketItem(crop.id);

        const currentQuantity = existing?.selectedQty || 0;

        const newQuantity = Math.min(
            currentQuantity + quantity,
            crop.quantity
        );

        if (newQuantity === currentQuantity) {
            toast.error(`Only ${crop.quantity} items available`);
            return;
        }

        // Flying animation
        if (position && basketButtonRef.current) {
            const rect = basketButtonRef.current.getBoundingClientRect();

            const particle = {
                id: Date.now(),
                startX: position.x,
                startY: position.y,
                endX: rect.left + rect.width / 2,
                endY: rect.top + rect.height / 2,
            };

            setFlyingParticles((previous) => [
                ...previous,
                particle,
            ]);

            setTimeout(() => {
                setFlyingParticles((previous) =>
                    previous.filter((item) => item.id !== particle.id)
                );
            }, 700);
        }

        setBasket((previous) => {
            const existingItem = previous.find(
                (item) => item.id === crop.id
            );

            if (existingItem) {
                return previous.map((item) =>
                    item.id === crop.id
                        ? {
                            ...item,
                            selectedQty: newQuantity,
                        }
                        : item
                );
            }

            return [
                ...previous,
                {
                    ...crop,
                    selectedQty: quantity,
                },
            ];
        });

        toast.success(`${crop.name} added to basket`);
    };

    // --------------------------------------------------
    // DRAG START
    // --------------------------------------------------

    const handleDragStart = (event, crop) => {
        if (crop.quantity <= 0) {
            event.preventDefault();
            return;
        }

        setDraggedCrop(crop);

        event.dataTransfer.setData(
            "text/plain",
            String(crop.id)
        );

        event.dataTransfer.effectAllowed = "copy";
    };

    // --------------------------------------------------
    // DRAG OVER BASKET
    // --------------------------------------------------

    const handleDragOver = (event) => {
        event.preventDefault();

        event.dataTransfer.dropEffect = "copy";

        setIsBasketHovered(true);
    };

    // --------------------------------------------------
    // DRAG LEAVE
    // --------------------------------------------------

    const handleDragLeave = (event) => {
        event.preventDefault();

        setIsBasketHovered(false);
    };

    // --------------------------------------------------
    // DROP
    // --------------------------------------------------

    const handleDropOnBasket = (event) => {
        event.preventDefault();

        setIsBasketHovered(false);

        const cropId = Number(
            event.dataTransfer.getData("text/plain")
        );

        const crop =
            crops.find((item) => item.id === cropId) ||
            draggedCrop;

        if (!crop) return;

        addCropToBasket(
            crop,
            1,
            {
                x: event.clientX,
                y: event.clientY,
            }
        );

        setDraggedCrop(null);
    };

    // --------------------------------------------------
    // BASKET QUANTITY
    // --------------------------------------------------

    const increaseQuantity = (cropId) => {
        setBasket((previous) =>
            previous.map((item) => {
                if (item.id !== cropId) {
                    return item;
                }

                if (item.selectedQty >= item.quantity) {
                    toast.error("Maximum available quantity reached");
                    return item;
                }

                return {
                    ...item,
                    selectedQty: item.selectedQty + 1,
                };
            })
        );
    };

    const decreaseQuantity = (cropId) => {
        setBasket((previous) =>
            previous
                .map((item) => {
                    if (item.id !== cropId) {
                        return item;
                    }

                    return {
                        ...item,
                        selectedQty: item.selectedQty - 1,
                    };
                })
                .filter((item) => item.selectedQty > 0)
        );
    };

    const removeFromBasket = (cropId) => {
        setBasket((previous) =>
            previous.filter((item) => item.id !== cropId)
        );

        toast.success("Removed from basket");
    };

    // --------------------------------------------------
    // CHECKOUT
    // --------------------------------------------------

    const checkout = async () => {
        if (basket.length === 0) {
            toast.error("Your basket is empty");
            return;
        }

        try {
            const orderData = {
                items: basket.map((item) => ({
                    cropId: item.id,
                    quantity: item.selectedQty,
                })),
            };

            await api.post("/orders", orderData);

            toast.success("Order placed successfully!");

            setBasket([]);
            setIsBasketOpen(false);

            await fetchCrops();
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to place order"
            );
        }
    };

    // --------------------------------------------------
    // CROP ICON
    // --------------------------------------------------

    const getCropIcon = (name) => {
        const value = name?.toLowerCase() || "";

        if (value.includes("rice")) return "🌾";
        if (value.includes("paddy")) return "🌾";
        if (value.includes("wheat")) return "🌾";
        if (value.includes("tomato")) return "🍅";
        if (value.includes("potato")) return "🥔";
        if (value.includes("onion")) return "🧅";
        if (value.includes("carrot")) return "🥕";
        if (value.includes("mango")) return "🥭";
        if (value.includes("banana")) return "🍌";
        if (value.includes("apple")) return "🍎";
        if (value.includes("coconut")) return "🥥";
        if (value.includes("chilli")) return "🌶️";
        if (value.includes("pepper")) return "🌶️";

        return "🌱";
    };

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />

                    <p className="text-gray-600">
                        Loading crops...
                    </p>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="min-h-[calc(100vh-72px)] px-4 py-8 md:px-8">

            {/* HEADER */}

            <div className="mx-auto max-w-7xl">

                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-green-700">
                            <ShoppingBasket size={18} />
                            <span>AgriTrade Marketplace</span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            Fresh Crops Marketplace
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Drag any crop into the basket to add it to your order.
                        </p>
                    </div>

                    {/* BASKET BUTTON */}

                    {/* FLOATING BASKET */}

                    <button
                        ref={basketButtonRef}
                        onClick={() => setIsBasketOpen(true)}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDropOnBasket}
                        className={`
    fixed bottom-6 right-6 z-[70]
    flex items-center gap-3
    rounded-full
    px-5 py-4
    font-semibold
    shadow-2xl
    transition-all duration-300
    ${
                            isBasketHovered
                                ? "scale-125 bg-yellow-500 text-white"
                                : "bg-green-700 text-white hover:scale-105 hover:bg-green-800"
                        }
  `}
                    >
                        <ShoppingBasket size={25} />

                        <span className="hidden sm:inline">
    {isBasketHovered ? "DROP HERE!" : "My Basket"}
  </span>

                        {totalItemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-md">
      {totalItemCount}
    </span>
                        )}
                    </button>
                </div>

                {/* DRAG INSTRUCTION */}

                <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-5">

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-700 text-2xl">
                            🖐️
                        </div>

                        <div>
                            <h2 className="font-bold text-green-900">
                                Drag & Drop Shopping
                            </h2>

                            <p className="text-sm text-green-800">
                                Drag a crop card and drop it directly into
                                the floating basket. You can also use
                                <strong> Add to Basket </strong>
                                on mobile devices.
                            </p>
                        </div>

                    </div>
                </div>

                {/* SEARCH */}

                <div className="mb-8">

                    <div className="relative max-w-2xl">

                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search crops..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                    </div>

                </div>

                {/* RESULTS */}

                <div className="mb-5 flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Available Crops
                        </h2>

                        <p className="text-sm text-gray-500">
                            {filteredCrops.length} crop
                            {filteredCrops.length !== 1 ? "s" : ""} available
                        </p>
                    </div>

                    <Link
                        to="/orders"
                        className="flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                    >
                        <ShoppingCart size={17} />
                        My Orders
                    </Link>

                </div>

                {/* EMPTY */}

                {filteredCrops.length === 0 ? (
                    <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                        <div className="mb-4 text-6xl">
                            🌱
                        </div>

                        <h3 className="text-xl font-bold text-gray-900">
                            No crops found
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Try searching with a different crop name.
                        </p>

                    </div>
                ) : (

                    /* CROP GRID */

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {filteredCrops.map((crop) => {

                            const basketQuantity =
                                getBasketQuantity(crop.id);

                            const isOutOfStock =
                                crop.quantity <= 0;

                            return (
                                <div
                                    key={crop.id}
                                    draggable={!isOutOfStock}
                                    onDragStart={(event) =>
                                        handleDragStart(event, crop)
                                    }
                                    className={`
                    group relative overflow-hidden rounded-3xl
                    border bg-white shadow-sm
                    transition-all duration-300
                    ${
                                        isOutOfStock
                                            ? "cursor-not-allowed opacity-60"
                                            : "cursor-grab border-gray-100 hover:-translate-y-1 hover:shadow-xl active:cursor-grabbing"
                                    }
                  `}
                                >

                                    {/* VISUAL */}

                                    <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 via-lime-50 to-yellow-50">

                                        <div className="text-8xl transition-transform duration-300 group-hover:scale-110">
                                            {getCropIcon(crop.name)}
                                        </div>

                                        {isOutOfStock && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                          OUT OF STOCK
                        </span>
                                            </div>
                                        )}

                                        {!isOutOfStock && (
                                            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-700 shadow">
                                                <span className="mr-1">✋</span>
                                                Drag me
                                            </div>
                                        )}

                                    </div>

                                    {/* CONTENT */}

                                    <div className="p-5">

                                        <div className="mb-3 flex items-start justify-between gap-3">

                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {crop.name}
                                                </h3>

                                                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                                    {crop.description ||
                                                        "Fresh quality crop from our farmer marketplace."}
                                                </p>
                                            </div>

                                            <GripVertical
                                                size={20}
                                                className="shrink-0 text-gray-300"
                                            />

                                        </div>

                                        {/* PRICE */}

                                        <div className="mb-4">

                      <span className="text-2xl font-bold text-green-700">
                        ₹{Number(crop.price).toFixed(2)}
                      </span>

                                            <span className="ml-1 text-sm text-gray-500">
                        / unit
                      </span>

                                        </div>

                                        {/* STOCK */}

                                        <div className="mb-4 flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Available
                      </span>

                                            <span
                                                className={`font-semibold ${
                                                    isOutOfStock
                                                        ? "text-red-600"
                                                        : crop.quantity <= 5
                                                            ? "text-orange-600"
                                                            : "text-green-600"
                                                }`}
                                            >
                        {crop.quantity} units
                      </span>

                                        </div>

                                        {/* BASKET QTY */}

                                        {basketQuantity > 0 && (
                                            <div className="mb-3 flex items-center justify-between rounded-xl bg-green-50 px-3 py-2">

                        <span className="text-sm font-medium text-green-800">
                          In basket
                        </span>

                                                <span className="font-bold text-green-700">
                          {basketQuantity}
                        </span>

                                            </div>
                                        )}

                                        {/* ACTION */}

                                        <div className="flex gap-2">

                                            <Link
                                                to={`/crops/${crop.id}`}
                                                className="flex-1 rounded-xl border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                            >
                                                View
                                            </Link>

                                            <button
                                                disabled={isOutOfStock}
                                                onClick={() =>
                                                    addCropToBasket(crop, 1)
                                                }
                                                className="flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-green-700 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                                            >
                                                <Plus size={17} />
                                                Add to Basket
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

            {/* FLYING PARTICLES */}

            {flyingParticles.map((particle) => (
                <div
                    key={particle.id}
                    className="pointer-events-none fixed z-[100] h-5 w-5 rounded-full bg-green-600 shadow-lg"
                    style={{
                        left: particle.startX,
                        top: particle.startY,
                        animation: "flyToBasket 0.7s ease-in-out forwards",
                        "--target-x": `${particle.endX - particle.startX}px`,
                        "--target-y": `${particle.endY - particle.startY}px`,
                    }}
                />
            ))}

            {/* BASKET OVERLAY */}

            {isBasketOpen && (
                <div
                    className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsBasketOpen(false)}
                />
            )}

            {/* BASKET DRAWER */}

            <aside
                className={`
          fixed right-0 top-0 z-[90]
          flex h-full w-full max-w-md
          flex-col bg-white shadow-2xl
          transition-transform duration-300
          ${
                    isBasketOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                }
        `}
            >

                {/* DRAWER HEADER */}

                <div className="flex items-center justify-between border-b border-gray-200 bg-green-700 px-5 py-5 text-white">

                    <div className="flex items-center gap-3">

                        <ShoppingBasket size={25} />

                        <div>
                            <h2 className="font-bold">
                                My Basket
                            </h2>

                            <p className="text-xs text-green-100">
                                {totalItemCount} item
                                {totalItemCount !== 1 ? "s" : ""}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={() => setIsBasketOpen(false)}
                        className="rounded-full p-2 transition hover:bg-white/10"
                    >
                        <X size={22} />
                    </button>

                </div>

                {/* BASKET CONTENT */}

                <div className="flex-1 overflow-y-auto p-5">

                    {basket.length === 0 ? (

                        <div className="flex h-full flex-col items-center justify-center text-center">

                            <div className="mb-5 text-7xl">
                                🧺
                            </div>

                            <h3 className="text-xl font-bold text-gray-900">
                                Your basket is empty
                            </h3>

                            <p className="mt-2 max-w-xs text-sm text-gray-500">
                                Drag a crop card into the basket to start
                                shopping.
                            </p>

                            <button
                                onClick={() => setIsBasketOpen(false)}
                                className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
                            >
                                Browse Crops
                            </button>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {basket.map((item) => (

                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-gray-200 p-4"
                                >

                                    <div className="flex gap-3">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-3xl">
                                            {getCropIcon(item.name)}
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-2">

                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {item.name}
                                                    </h4>

                                                    <p className="text-sm text-green-700">
                                                        ₹{Number(item.price).toFixed(2)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        removeFromBasket(item.id)
                                                    }
                                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                            </div>

                                            {/* QTY */}

                                            <div className="mt-3 flex items-center justify-between">

                                                <div className="flex items-center rounded-xl border border-gray-200">

                                                    <button
                                                        onClick={() =>
                                                            decreaseQuantity(item.id)
                                                        }
                                                        className="p-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Minus size={15} />
                                                    </button>

                                                    <span className="min-w-10 text-center text-sm font-bold">
                            {item.selectedQty}
                          </span>

                                                    <button
                                                        onClick={() =>
                                                            increaseQuantity(item.id)
                                                        }
                                                        className="p-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Plus size={15} />
                                                    </button>

                                                </div>

                                                <span className="font-bold text-gray-900">
                          ₹
                                                    {(
                                                        item.price *
                                                        item.selectedQty
                                                    ).toFixed(2)}
                        </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

                {/* CHECKOUT */}

                {basket.length > 0 && (

                    <div className="border-t border-gray-200 bg-gray-50 p-5">

                        <div className="mb-4 flex items-center justify-between">

              <span className="text-gray-600">
                Total
              </span>

                            <span className="text-2xl font-bold text-green-700">
                ₹{basketTotal.toFixed(2)}
              </span>

                        </div>

                        <button
                            onClick={checkout}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 py-4 font-bold text-white shadow-lg transition hover:bg-green-800"
                        >
                            <ShoppingCart size={20} />
                            Place Order
                        </button>

                    </div>

                )}

            </aside>

            {/* ANIMATION */}

            <style>{`
        @keyframes flyToBasket {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }

          70% {
            opacity: 1;
            transform:
              translate(
                calc(var(--target-x) * 0.75),
                calc(var(--target-y) * 0.75)
              )
              scale(1.2);
          }

          100% {
            opacity: 0;
            transform:
              translate(
                var(--target-x),
                var(--target-y)
              )
              scale(0.3);
          }
        }
      `}</style>

        </div>
    );
}

export default Crops;