"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/50">Enter your credentials to access your queue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  placeholder="name@university.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full py-4 text-lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-white/40 text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Create an account
            </a>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
