
"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

function toBanglaNumber(value: number) {
  return value.toLocaleString("bn-BD");
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য আনা যায়নি");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : data.products ?? []);
      } catch {
        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Category list
  const categories = Array.from(
    new Map(
      products.map((product) => [
        product.category,
        product.categoryNameBn,
      ])
    ).entries()
  );

  // Search, Filter and Sort
  const filteredProducts = products
    .filter((product) =>
      `${product.nameBn} ${product.categoryNameBn}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
    .filter(
      (product) =>
        selectedCategory === "all" ||
        product.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "low") return a.today - b.today;
      if (sortOrder === "high") return b.today - a.today;
      return 0;
    });

  return (
    <main className="min-h-screen bg-[#fffaf0] text-gray-800">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a
            href="/"
            className="text-2xl font-extrabold text-green-700"
          >
            🛒 বাজার দর
          </a>

          <p className="hidden text-sm text-gray-500 sm:block">
            প্রতিদিনের বাজারদর, এক জায়গায়
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-12">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 to-green-700 px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="mb-3 text-sm font-semibold text-green-200">
            আপনার নিত্যদিনের বাজার সঙ্গী
          </p>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            বাজারে যাওয়ার আগে,
            <br />
            জেনে নিন আজকের দাম!
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-green-100">
            চাল, ডালসহ নিত্যপ্রয়োজনীয় পণ্যের দাম এবং বাজারের
            পরিবর্তন জেনে নিন সহজেই।
          </p>

          <a
            href="#products"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-green-800 transition hover:bg-green-50"
          >
            পণ্যের দাম দেখুন ↓
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-5 pb-16"
      >
        {/* Heading */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              আজকের বাজারদর
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              আপনার প্রয়োজনীয় পণ্যের দাম খুঁজে নিন
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
            মোট পণ্য: {toBanglaNumber(filteredProducts.length)}
          </span>
        </div>

        {/* Search, Category Filter and Sorting */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-semibold"
            >
              পণ্য খুঁজুন
            </label>

            <input
              id="product-search"
              type="search"
              placeholder="যেমন: চাল, আলু, পেঁয়াজ..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-sm font-semibold"
            >
              পণ্যের ক্যাটাগরি
            </label>

            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="all">সব ক্যাটাগরি</option>

              {categories.map(([category, categoryNameBn]) => (
                <option key={category} value={category}>
                  {categoryNameBn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="price-sort"
              className="mb-2 block text-sm font-semibold"
            >
              দাম অনুযায়ী সাজান
            </label>

            <select
              id="price-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="default">সাধারণ ক্রম</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border bg-white p-5"
              >
                <div className="mb-4 h-14 w-14 rounded-full bg-gray-200" />
                <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-8 w-1/2 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-full rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            <p>{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 font-bold underline"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Empty API Response */}
        {!loading && !error && products.length === 0 && (
          <p className="rounded-xl bg-white p-6">
            এখন কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </p>
        )}

        {/* No Search Results */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-white px-5 py-12 text-center">
              <p className="text-4xl">🔎</p>

              <h3 className="mt-3 text-lg font-bold">
                কোনো পণ্য পাওয়া যায়নি
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                অন্য নাম দিয়ে খুঁজে দেখুন অথবা ফিল্টার পরিবর্তন করুন।
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSortOrder("default");
                }}
                className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          )}

        {/* Product Cards */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="text-4xl">
                    {product.categoryIcon}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      product.change.dir === "up"
                        ? "bg-red-100 text-red-700"
                        : product.change.dir === "down"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.change.dir === "up"
                      ? "▲ দাম বেড়েছে"
                      : product.change.dir === "down"
                        ? "▼ দাম কমেছে"
                        : "● দাম অপরিবর্তিত"}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {product.categoryNameBn}
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {product.nameBn}
                </h3>

                <p className="mt-4 text-3xl font-extrabold text-green-800">
                  ৳{toBanglaNumber(product.today)}

                  <span className="ml-1 text-sm font-medium text-gray-500">
                    / {product.unit}
                  </span>
                </p>

                <div className="mt-4 border-t pt-3 text-sm text-gray-500">
                  <div className="flex justify-between gap-2">
                    <span>গতকাল</span>

                    <span className="font-semibold text-gray-700">
                      ৳{toBanglaNumber(product.yesterday)}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between gap-2">
                    <span>গত সপ্তাহ</span>

                    <span className="font-semibold text-gray-700">
                      ৳{toBanglaNumber(product.lastWeek)}
                    </span>
                  </div>

                  <p
                    className={`mt-3 font-semibold ${
                      product.change.dir === "up"
                        ? "text-red-600"
                        : product.change.dir === "down"
                          ? "text-green-700"
                          : "text-gray-500"
                    }`}
                  >
                    পরিবর্তন: {product.change.pct > 0 ? "+" : ""}
                    {toBanglaNumber(product.change.pct)}%
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-5 py-8 text-center text-sm text-gray-300">
        <p className="text-lg font-bold text-white">
          🛒 বাজার দর
        </p>

        <p className="mt-2">
          বাজার করার আগে দাম জেনে নিন। বাজারভেদে প্রকৃত দাম আলাদা হতে পারে।
        </p>

        <p className="mt-4">
          © ২০২৬ বাজার দর | সর্বসাধারণের জন্য তৈরি
        </p>
      </footer>
    </main>
  );
}
