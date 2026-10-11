
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Market = {
  name?: string;
  nameBn?: string;
  price?: number;
  today?: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image?: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets?: Market[];
};

function bn(value: number) {
  return value.toLocaleString("bn-BD");
}

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/products/${id}`
        );

        if (!response.ok) {
          throw new Error("পণ্য পাওয়া যায়নি");
        }

        const data = await response.json();
        const item = data.product ?? data;

        if (!cancelled) {
          if (item && item.id !== undefined) {
            setProduct(item);
          } else {
            setError("পণ্যের তথ্য পাওয়া যায়নি।");
          }
        }
      } catch {
        if (!cancelled) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf0] px-5 py-12">
        <div className="mx-auto max-w-3xl animate-pulse rounded-3xl bg-white p-8 shadow-sm">
          <div className="h-16 w-16 rounded-2xl bg-gray-200" />
          <div className="mt-6 h-5 w-1/3 rounded bg-gray-200" />
          <div className="mt-4 h-8 w-2/3 rounded bg-gray-200" />
          <div className="mt-5 h-10 w-1/2 rounded bg-gray-200" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf0] px-5 text-center">
        <p className="text-5xl">🔎</p>
        <h1 className="mt-4 text-2xl font-extrabold">
          পণ্য পাওয়া যায়নি
        </h1>
        <p className="mt-2 text-gray-600">
          {error || "এই পণ্যের তথ্য বর্তমানে পাওয়া যাচ্ছে না।"}
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf0] px-5 py-8 text-gray-800 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-xl font-extrabold text-green-700">
            🛒 বাজার দর
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-green-200 bg-white px-4 py-2 font-semibold text-green-800 transition hover:bg-green-50"
          >
            ← সব পণ্য
          </Link>
        </header>

        <article className="mt-7 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-green-900 to-green-700 p-6 text-white sm:p-10">
            <span className="text-6xl">{product.categoryIcon || "🛍️"}</span>

            <p className="mt-5 text-sm font-medium text-green-100">
              {product.categoryNameBn}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              {product.nameBn}
            </h1>

            <p className="mt-6 text-4xl font-extrabold sm:text-5xl">
              ৳{bn(product.today)}
              <span className="ml-2 text-base font-medium text-green-100">
                / {product.unit}
              </span>
            </p>

            <p className="mt-4 font-bold">
              {product.change.dir === "up"
                ? "▲ দাম বেড়েছে"
                : product.change.dir === "down"
                  ? "▼ দাম কমেছে"
                  : "● দাম অপরিবর্তিত"}
              {" "}({product.change.pct > 0 ? "+" : ""}
              {bn(product.change.pct)}%)
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <h2 className="text-xl font-extrabold">দামের ইতিহাস</h2>
            <p className="mt-1 text-sm text-gray-500">
              আগের সময়ের সঙ্গে আজকের দাম তুলনা করুন।
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">গতকাল</p>
                <p className="mt-2 text-2xl font-extrabold">
                  ৳{bn(product.yesterday)}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">গত সপ্তাহ</p>
                <p className="mt-2 text-2xl font-extrabold">
                  ৳{bn(product.lastWeek)}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">গত মাস</p>
                <p className="mt-2 text-2xl font-extrabold">
                  ৳{bn(product.lastMonth)}
                </p>
              </div>
            </div>

            <div className="mt-9">
              <h2 className="text-xl font-extrabold">বাজারভিত্তিক দাম</h2>

              {product.markets && product.markets.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {product.markets.map((market, index) => (
                    <div
                      key={`${market.nameBn ?? market.name ?? "market"}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4"
                    >
                      <span className="font-medium">
                        {market.nameBn ?? market.name ?? "বাজার"}
                      </span>

                      <span className="font-extrabold text-green-800">
                        ৳{bn(market.price ?? market.today ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  এই পণ্যের আলাদা বাজারভিত্তিক দাম পাওয়া যায়নি।
                </p>
              )}
            </div>

            <p className="mt-8 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              মনে রাখবেন: বাজার ও স্থানভেদে প্রকৃত দাম কিছুটা আলাদা হতে পারে।
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
            >
              ← অন্য পণ্যের দাম দেখুন
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
