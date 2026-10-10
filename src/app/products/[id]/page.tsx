
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets?: {
    name?: string;
    nameBn?: string;
    price?: number;
    today?: number;
  }[];
};

function bn(value: number) {
  return value.toLocaleString("bn-BD");
}

export default function ProductDetails() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(
          `https://api.api-store.workers.dev/api/bazardor/products/${id}`
        );

        if (!response.ok) {
          throw new Error("পণ্য পাওয়া যায়নি");
        }

        const data = await response.json();
        setProduct(data.product ?? data);
      } catch {
        setError("পণ্যের তথ্য পাওয়া যায়নি।");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf0] p-8">
        <p className="text-center text-lg">পণ্যের তথ্য লোড হচ্ছে...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#fffaf0] p-8 text-center">
        <h1 className="text-2xl font-bold">পণ্য পাওয়া যায়নি</h1>
        <a href="/" className="mt-4 inline-block text-green-700 underline">
          হোম পেজে ফিরে যান
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf0] px-5 py-10 text-gray-800">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="font-semibold text-green-700">
          ← হোম পেজে ফিরে যান
        </a>

        <article className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <span className="text-6xl">{product.categoryIcon}</span>

          <p className="mt-5 text-sm text-gray-500">
            {product.categoryNameBn}
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            {product.nameBn}
          </h1>

          <p className="mt-6 text-4xl font-extrabold text-green-800">
            ৳{bn(product.today)}
            <span className="ml-2 text-base font-medium text-gray-500">
              / {product.unit}
            </span>
          </p>

          <p
            className={`mt-4 font-bold ${
              product.change.dir === "up"
                ? "text-red-600"
                : product.change.dir === "down"
                  ? "text-green-700"
                  : "text-gray-500"
            }`}
          >
            {product.change.dir === "up"
              ? "▲ দাম বেড়েছে"
              : product.change.dir === "down"
                ? "▼ দাম কমেছে"
                : "● দাম অপরিবর্তিত"}{" "}
            ({bn(product.change.pct)}%)
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গতকাল</p>
              <p className="mt-2 text-xl font-bold">
                ৳{bn(product.yesterday)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গত সপ্তাহ</p>
              <p className="mt-2 text-xl font-bold">
                ৳{bn(product.lastWeek)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">গত মাস</p>
              <p className="mt-2 text-xl font-bold">
                ৳{bn(product.lastMonth)}
              </p>
            </div>
          </div>

          <h2 className="mt-8 text-xl font-bold">বাজারের তথ্য</h2>

          {product.markets && product.markets.length > 0 ? (
            <div className="mt-4 space-y-3">
              {product.markets.map((market, index) => (
                <div
                  key={`${market.nameBn ?? market.name ?? "market"}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border p-4"
                >
                  <span className="font-medium">
                    {market.nameBn ?? market.name ?? "বাজার"}
                  </span>

                  <span className="font-bold text-green-800">
                    ৳{bn(market.price ?? market.today ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-gray-500">
              এই পণ্যের জন্য আলাদা বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </article>
      </div>
    </main>
  );
}