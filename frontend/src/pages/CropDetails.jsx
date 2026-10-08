import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";

import api from "../services/api";

function CropDetails() {
  const { id } = useParams();

  const [crop, setCrop] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCrop = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/crops/${id}`);

      setCrop(response.data);
    } catch (error) {
      console.error(error);

      toast.error(
          error.response?.data?.message ||
          "Unable to load crop"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrop();
  }, [id]);

  const getCropIcon = (name) => {
    const value = name?.toLowerCase() || "";

    if (value.includes("rice") || value.includes("paddy")) {
      return "🌾";
    }

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

  const increaseQuantity = () => {
    if (quantity >= crop.quantity) {
      toast.error(
          `Only ${crop.quantity} units available`
      );
      return;
    }

    setQuantity((previous) => previous + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
        Math.max(1, previous - 1)
    );
  };

  /*
   * This page sends the selected quantity directly
   * to the real backend order API.
   */
  const buyNow = async () => {
    if (!crop || crop.quantity <= 0) {
      toast.error("Crop is out of stock");
      return;
    }

    try {
      await api.post("/orders", {
        items: [
          {
            cropId: crop.id,
            quantity,
          },
        ],
      });

      toast.success("Order placed successfully!");

      setQuantity(1);

      await fetchCrop();
    } catch (error) {
      console.error(error);

      toast.error(
          error.response?.data?.message ||
          "Unable to place order"
      );
    }
  };

  if (loading) {
    return (
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />

            <p className="text-gray-600">
              Loading crop...
            </p>
          </div>
        </div>
    );
  }

  if (!crop) {
    return (
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4">
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <div className="mb-4 text-6xl">🌱</div>

            <h2 className="text-2xl font-bold text-gray-900">
              Crop not found
            </h2>

            <Link
                to="/crops"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              <ArrowLeft size={18} />
              Back to Crops
            </Link>
          </div>
        </div>
    );
  }

  const isOutOfStock = crop.quantity <= 0;

  const totalPrice =
      Number(crop.price) * quantity;

  return (
      <div className="min-h-[calc(100vh-72px)] px-4 py-8 md:px-8">

        <div className="mx-auto max-w-6xl">

          {/* BACK */}

          <Link
              to="/crops"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900"
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </Link>

          {/* MAIN CARD */}

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

            <div className="grid lg:grid-cols-2">

              {/* VISUAL */}

              <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-green-100 via-lime-50 to-yellow-50">

                <div className="text-[160px] drop-shadow-lg transition-transform duration-300 hover:scale-110">
                  {getCropIcon(crop.name)}
                </div>

              </div>

              {/* DETAILS */}

              <div className="p-6 md:p-10">

                <div className="mb-6">

                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  Fresh Crop
                </span>

                  <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
                    {crop.name}
                  </h1>

                  <p className="mt-4 leading-7 text-gray-600">
                    {crop.description ||
                        "Fresh quality crop available from our farmer marketplace."}
                  </p>

                </div>

                {/* PRICE */}

                <div className="mb-6 rounded-2xl bg-green-50 p-5">

                  <p className="text-sm text-gray-500">
                    Price
                  </p>

                  <div className="mt-1">

                  <span className="text-4xl font-bold text-green-700">
                    ₹{Number(crop.price).toFixed(2)}
                  </span>

                    <span className="ml-2 text-gray-500">
                    / unit
                  </span>

                  </div>

                </div>

                {/* STOCK */}

                <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 p-4">

                <span className="font-medium text-gray-600">
                  Available Stock
                </span>

                  <span
                      className={`font-bold ${
                          isOutOfStock
                              ? "text-red-600"
                              : crop.quantity <= 5
                                  ? "text-orange-600"
                                  : "text-green-600"
                      }`}
                  >
                  {isOutOfStock
                      ? "Out of Stock"
                      : `${crop.quantity} units`}
                </span>

                </div>

                {/* QUANTITY */}

                {!isOutOfStock && (
                    <div className="mb-6">

                      <p className="mb-3 font-semibold text-gray-800">
                        Quantity
                      </p>

                      <div className="flex items-center">

                        <button
                            onClick={decreaseQuantity}
                            className="flex h-12 w-12 items-center justify-center rounded-l-xl border border-gray-200 bg-gray-50 hover:bg-gray-100"
                        >
                          <Minus size={18} />
                        </button>

                        <div className="flex h-12 w-16 items-center justify-center border-y border-gray-200 font-bold">
                          {quantity}
                        </div>

                        <button
                            onClick={increaseQuantity}
                            className="flex h-12 w-12 items-center justify-center rounded-r-xl border border-gray-200 bg-gray-50 hover:bg-gray-100"
                        >
                          <Plus size={18} />
                        </button>

                      </div>

                    </div>
                )}

                {/* TOTAL */}

                {!isOutOfStock && (
                    <div className="mb-6 flex items-center justify-between">

                  <span className="text-gray-600">
                    Total
                  </span>

                      <span className="text-2xl font-bold text-gray-900">
                    ₹{totalPrice.toFixed(2)}
                  </span>

                    </div>
                )}

                {/* ACTIONS */}

                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                      disabled={isOutOfStock}
                      onClick={buyNow}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-700 px-5 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <ShoppingCart size={20} />

                    {isOutOfStock
                        ? "Out of Stock"
                        : "Buy Now"}
                  </button>

                  <Link
                      to="/crops"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-green-200 px-5 py-4 font-semibold text-green-700 transition hover:bg-green-50"
                  >
                    <ShoppingBasket size={20} />
                    Marketplace
                  </Link>

                </div>

              </div>

            </div>

          </div>

          {/* INFO */}

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-2 text-2xl">🌱</div>
              <h3 className="font-bold text-gray-900">
                Fresh Produce
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Crops listed directly through the AgriTrade marketplace.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-2 text-2xl">🔐</div>
              <h3 className="font-bold text-gray-900">
                Secure Ordering
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Orders are processed through your authenticated account.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-2 text-2xl">🚚</div>
              <h3 className="font-bold text-gray-900">
                Order Tracking
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View your orders and their status from My Orders.
              </p>
            </div>

          </div>

        </div>

      </div>
  );
}

export default CropDetails;