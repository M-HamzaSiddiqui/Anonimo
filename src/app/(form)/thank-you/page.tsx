"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";

const ThankYou = () => {
  useEffect(() => {
    // Replace the current entry in history
    window.history.replaceState(null, "", window.location.href);

    // Prevent back navigation
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg animate-fade-in">
        <div className="flex justify-center">
          <Sparkles className="text-yellow-400 w-16 h-16 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mt-4">
          Thank You! 🎉
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Your response has been recorded successfully.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
