import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/products";

export default function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [snapshot, setSnapshot] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    async function loadProducts(reset = false) {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("limit", "20");
        if (!reset && cursor) params.set("cursor", cursor);
        if (!reset && snapshot) params.set("snapshot", snapshot);
        if (category) params.set("category", category);

        const res = await fetch(`${API_URL}?${params}`);
        const data = await res.json();
        setSnapshot(data.snapshot);
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
        setProducts((prev) => (reset ? data.items : [...prev, ...data.items]));
        setLoading(false);
    }

    useEffect(() => {
        loadProducts(true);
    }, []);

    async function handleCategory(value: string) {
        setCategory(value);
        setCursor(null);
        setSnapshot(null);
        setProducts([]);
        const params = new URLSearchParams();
        params.set("limit", "20");
        if (value) params.set("category", value);

        const res = await fetch(`${API_URL}?${params}`);
        const data = await res.json();
        setProducts(data.items);
        setSnapshot(data.snapshot);
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
    }

    async function simulateUpdates() {
        const res = await fetch("http://localhost:3000/products/update", {
            method: "POST",
        });

        const data = await res.json();
		alert(`${data.updated} products updated`);
		console.log(data)
    }

    const categories = ["Books", "Electronics", "Sports", "Gaming"];

    return (
        <div className="min-h-screen bg-green-900 text-slate-200 px-6 py-10 font-sans">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-1">
                            Catalog
                        </p>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Products
                        </h1>
                    </div>
                    {snapshot && (
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                                Snapshot
                            </p>
                            <p className="font-mono text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-700/50">
                                {snapshot.slice(0, 19)}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={simulateUpdates}
                        className="border border-white px-3 py-1 rounded-2xl bg-black hover:bg-black/80 cursor-pointer"
                    >
                        Simulate 50 Updates
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => handleCategory("")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                            category === "" ?
                                "bg-green-600 border-green-600 text-white shadow-lg shadow-green-900/40"
                            :   "bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                                category === cat ?
                                    "bg-green-600 border-green-600 text-white shadow-lg shadow-green-900/40"
                                :   "bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-6xl mx-auto">
                {products.length === 0 && !loading ?
                    <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                        <svg
                            className="w-12 h-12 mb-4 opacity-40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                            />
                        </svg>
                        <p className="text-sm">No products found</p>
                    </div>
                :   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative bg-[#111827] rounded-xl border border-slate-800 p-5 flex flex-col gap-3 transition-all duration-300 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-950/50 hover:-translate-y-0.5"
                            >
                                {/* Top accent line on hover */}
                                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />

                                <div className="flex items-start justify-between gap-2">
                                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-green-400 bg-green-950/60 border border-green-900/60 px-2 py-0.5 rounded-full">
                                        {product.category}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
                                        {product.name}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                    <span className="text-lg font-bold text-white">
                                        ${product.price}
                                    </span>
                                    <button className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors">
                                        View →
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Skeleton cards while loading more */}
                        {loading &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={`skeleton-${i}`}
                                    className="bg-[#111827] rounded-xl border border-slate-800 p-5 flex flex-col gap-3 animate-pulse"
                                >
                                    <div className="h-5 w-20 bg-slate-800 rounded-full" />
                                    <div className="h-4 bg-slate-800 rounded-md w-full" />
                                    <div className="h-4 bg-slate-800 rounded-md w-3/4" />
                                    <div className="mt-auto pt-2 border-t border-slate-800 flex justify-between">
                                        <div className="h-6 w-16 bg-slate-800 rounded-md" />
                                        <div className="h-5 w-10 bg-slate-800 rounded-md" />
                                    </div>
                                </div>
                            ))}
                    </div>
                }

                {/* Load More */}
                {hasMore && !loading && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => loadProducts()}
                            disabled={loading}
                            className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-green-900/40 hover:shadow-green-900/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Load more
                            <svg
                                className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {!hasMore && products.length > 0 && (
                    <p className="mt-10 text-center text-xs text-slate-600 tracking-widest uppercase">
                        — All products loaded —
                    </p>
                )}
            </div>
        </div>
    );
}
