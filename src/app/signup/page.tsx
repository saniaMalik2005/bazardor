"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold">সাইন আপ</h1>
      <p className="mt-2 text-gray-600">
        বাজারদর অ্যাকাউন্ট তৈরি করো
      </p>

      <form className="mt-6 space-y-4" onSubmit={(e) => {
        e.preventDefault();
        alert("Signup API এখনো সংযুক্ত করা হয়নি।");
      }}>
        <div>
          <label className="block text-sm font-medium">নাম</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
            placeholder="তোমার নাম"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">ইমেইল</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">পাসওয়ার্ড</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
            placeholder="কমপক্ষে ৬ অক্ষর"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
        >
          অ্যাকাউন্ট তৈরি করো
        </button>

        <p className="text-center text-sm">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-semibold text-green-700">
            সাইন ইন করো
          </Link>
        </p>
      </form>
    </main>
  );
}
