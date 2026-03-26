"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Signup failed");
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
            <h1 className="text-3xl font-bold text-white text-gradient">Join the Queue</h1>
            <p className="text-white/50">Register to manage your appointments seamlessly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-white/40 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Sign In
            </a>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
