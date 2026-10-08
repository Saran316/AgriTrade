import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load categories.");
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (event) => {
        event.preventDefault();

        if (!name.trim()) return;

        try {
            setAdding(true);
            setError("");

            await api.post("/categories", {
                name: name.trim(),
            });

            setName("");
            await loadCategories();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Unable to add category."
            );
        } finally {
            setAdding(false);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            await api.delete(`/categories/${id}`);
            setCategories((current) =>
                current.filter((category) => category.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Unable to delete category."
            );
        }
    };

    const categoryIcons = ["🌾", "🥕", "🍅", "🌽", "🥔", "🍚", "🍎", "🥬"];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Header */}
            <section className="mb-8 rounded-3xl border border-amber-300/30 bg-green-950/85 p-7 shadow-2xl sm:p-10">

                <div className="max-w-3xl">
                    <div className="mb-3 inline-flex rounded-full border border-amber-400/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                        📂 AgriTrade Marketplace
                    </div>

                    <h1 className="text-4xl font-black text-white sm:text-5xl">
                        Product Categories
                    </h1>

                    <p className="mt-3 text-green-100/80">
                        Explore agricultural products through organized categories.
                    </p>
                </div>
            </section>

            {/* Add Category */}
            <section className="mb-8 rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl">

                <h2 className="text-xl font-bold text-gray-900">
                    Add New Category
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Create a category for your agricultural products.
                </p>

                <form
                    onSubmit={addCategory}
                    className="mt-5 flex flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="h-12 flex-1 rounded-xl border border-gray-300 px-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />

                    <button
                        type="submit"
                        disabled={adding || !name.trim()}
                        className="h-12 rounded-xl bg-green-700 px-7 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {adding ? "Adding..." : "+ Add Category"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}
            </section>

            {/* Categories */}
            <section>

                <div className="mb-5 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            All Categories
                        </h2>

                        <p className="mt-1 text-sm text-green-100/80">
                            {categories.length} categories available
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-48 animate-pulse rounded-2xl bg-white/20"
                            />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="rounded-2xl bg-white/95 p-12 text-center shadow-xl">
                        <div className="text-6xl">📂</div>

                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                            No categories yet
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Create your first agricultural product category above.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className="group rounded-2xl border border-white/30 bg-white/95 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl transition group-hover:scale-110">
                                        {categoryIcons[index % categoryIcons.length]}
                                    </div>

                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                    >
                                        Delete
                                    </button>

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-gray-900">
                                    {category.name}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Agricultural product category
                                </p>

                                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-green-700">
                    Explore products →
                  </span>
                                </div>

                            </div>
                        ))}

                    </div>
                )}
            </section>
        </div>
    );
}

export default Categories;