
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setMessage(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      setMessage("অ্যাকাউন্ট তৈরি হয়েছে! সাইন ইন পেজে নেওয়া হচ্ছে।");

      setTimeout(() => {
        router.push("/signin");
      }, 1200);
    } catch {
      setMessage("সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold">সাইন আপ</h1>

      <p className="mt-2 text-gray-600">
        বাজারদর অ্যাকাউন্ট তৈরি করো
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSignup}>
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
          disabled={loading}
          className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "অপেক্ষা করো..." : "অ্যাকাউন্ট তৈরি করো"}
        </button>

        {message && (
          <p role="status" className="text-sm text-center">
            {message}
          </p>
        )}

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
