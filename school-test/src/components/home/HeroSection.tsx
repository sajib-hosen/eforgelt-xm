import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Timer, Award, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/quiz");
  };

  return (
    <section className="min-h-[calc(100vh-74px)] relative bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900 text-white overflow-auto">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/30" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 flex flex-col items-center text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
        >
          Test_School{" "}
          <span className="text-yellow-300 dark:text-yellow-400">
            Competency Assessment
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-100 dark:text-gray-200"
        >
          A 3-step progressive evaluation to certify your skills from A1 to C2
          with digital certification.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex gap-4"
        >
          <Button
            onClick={handleStart}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold dark:bg-yellow-500 dark:hover:bg-yellow-400"
          >
            Start Test <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="border-white/70 text-white hover:bg-white hover:text-indigo-700 dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-indigo-900"
            asChild
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl"
        >
          <FeatureCard
            icon={
              <BarChart3 className="h-8 w-8 text-yellow-300 dark:text-yellow-400" />
            }
            title="3-Step Assessment"
            desc="Progress through A1 → C2 with adaptive question sets and scoring rules."
          />
          <FeatureCard
            icon={
              <Timer className="h-8 w-8 text-yellow-300 dark:text-yellow-400" />
            }
            title="Timed Tests"
            desc="One minute per question with automatic submission to keep the pace fair."
          />
          <FeatureCard
            icon={
              <Award className="h-8 w-8 text-yellow-300 dark:text-yellow-400" />
            }
            title="Digital Certification"
            desc="Instantly receive a downloadable certificate when you achieve your highest level."
          />
        </motion.div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white/10 dark:bg-white/5 p-6 rounded-2xl shadow-lg border border-white/20 dark:border-white/10">
      {icon}
      <h3 className="text-xl font-semibold mb-2 text-white dark:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-100 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  );
}
