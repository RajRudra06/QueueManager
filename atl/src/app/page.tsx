"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-20 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          <span>Real-time Syncing v1.0</span>
        </motion.div>

        {/* Hero Text */}
        <div className="space-y-6">
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Manage Your <br />
            <span className="text-gradient">Time & Queue</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            The smartest way for institutions to handle appointments.
            No more physical lines. Just scan, book, and track your position in real-time.
          </motion.p>
        </div>

        {/* CTA Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link href="/signup">
            <button className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 group">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/login">
            <button className="px-8 py-4 rounded-2xl glass glass-hover text-white font-semibold">
              Sign In
            </button>
          </Link>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20"
        >
          <FeatureCard 
            icon={<Clock className="w-6 h-6 text-indigo-400" />}
            title="Slot-Based Booking"
            description="Book your preferred time slots instantly without any scheduling conflicts."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-purple-400" />}
            title="Live Queue Tracking"
            description="Watch your position advance in real-time with precise ETA updates."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-blue-400" />}
            title="Admin Dashboard"
            description="Comprehensive control for service providers to manage capacity and flow."
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass glass-hover p-8 rounded-3xl text-left space-y-4">
      <div className="p-3 rounded-2xl bg-white/5 w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white/90">{title}</h3>
      <p className="text-white/50 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
