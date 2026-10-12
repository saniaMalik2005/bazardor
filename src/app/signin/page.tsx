"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/../auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        toast.error(result.error.message || "লগইন করা যায়নি");
        return;
      }
      toast.success("সফলভাবে লগইন হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("লগইন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf0] px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <Link href="/" className="text-xl font-extrabold text-green-700">🛒 বাজার দর</Link>
        <h1 className="mt-6 text-3xl font-bold">সাইন ইন</h1>
        <p className="mt-2 text-sm text-gray-500">তোমার অ্যাকাউন্টে প্রবেশ করো</p>
        <label className="mt-6 block text-sm font-medium">ইমেইল</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border p-3" placeholder="name@example.com" />
        <label className="mt-4 block text-sm font-medium">পাসওয়ার্ড</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border p-3" placeholder="পাসওয়ার্ড" />
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-green-700 p-3 font-semibold text-white disabled:opacity-60">
          {loading ? "অপেক্ষা করো..." : "সাইন ইন"}
        </button>
        <p className="mt-5 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-green-700">সাইন আপ করো</Link>
        </p>
      </form>
    </main>
  );
}
