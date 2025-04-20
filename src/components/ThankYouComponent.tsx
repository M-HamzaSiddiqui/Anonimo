"use client";

import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const ThankYou = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [marks, setMarks] = useState<number | null>(null);
  const [totalMarks, setTotalMarks] = useState<number | null>(null);

  useEffect(() => {
    const m = searchParams.get("marks");
    const total = searchParams.get("total");

    if (m && total) {
      setMarks(parseInt(m));
      setTotalMarks(parseInt(total));
    }
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="backdrop-blur-sm bg-black/60 rounded-2xl shadow-xl overflow-hidden border border-gray-800 w-full max-w-md"
      >
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-8 border-b border-gray-800">
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center"
          >
            <div className="bg-indigo-600/30 p-6 rounded-full border border-indigo-500/50 mb-4">
              <Check className="text-indigo-400 w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 text-center">
              Thank You!
            </h1>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="p-8 text-center">
          <p className="text-gray-300 text-lg mb-4">
            Your response has been recorded successfully.
          </p>

          {marks !== null && totalMarks !== null && (
            <div className="text-xl text-white font-semibold mt-4">
              You scored:{" "}
              <span className="text-green-400">
                {marks}/{totalMarks}
              </span>
            </div>
          )}

          <div className="py-4 flex justify-center space-x-3">
            <Button onClick={() => router.push("/")} variant="secondary">
              Back to Home
            </Button>
          </div>

          <div className="flex justify-center mt-6">
            <Sparkles className="text-indigo-400 w-6 h-6 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
