"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, BarChart2, Users, FileText, RefreshCw, PieChart, LineChart } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import SentimentPie from "@/components/SentimentPie";
import SubmissionTrends from "@/components/submissionTrendsLineChart";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DashboardMetrics {
  totalForms: number;
  totalResponses: number;
  mostActiveForm: {
    title: string;
    responseCount: number;
  } | null;
}

const Page = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fetchDashboardMetrics = useCallback(async () => {
    if (!session?.user?._id) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsMetricsLoading(true);
    try {
      const response = await axios.get<DashboardMetrics>(`/api/dashboard/${session.user._id}/metrics`);
      setDashboardMetrics(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || "Failed to fetch dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setIsMetricsLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    if (session?.user?._id) fetchDashboardMetrics();
  }, [session, fetchDashboardMetrics]);

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 max-w-md">
          <CardContent className="pt-6 text-center text-white">
            <p className="text-xl">Please log in to access the dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Track your form performance and analytics at a glance
          </p>
        </motion.div>

        {isMetricsLoading ? (
          <div className="flex justify-center items-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-3 text-xl text-gray-300">Loading metrics...</span>
          </div>
        ) : dashboardMetrics ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate={isVisible ? "show" : "hidden"}
            className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={item} className="group rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="p-6">
                <div className="mb-4 bg-blue-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300 group-hover:text-blue-400">Total Forms</h3>
                <p className="text-3xl font-bold text-blue-400">{dashboardMetrics.totalForms}</p>
              </div>
            </motion.div>
            
            <motion.div variants={item} className="group rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
              <div className="p-6">
                <div className="mb-4 bg-green-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300 group-hover:text-green-400">Total Responses</h3>
                <p className="text-3xl font-bold text-green-400">{dashboardMetrics.totalResponses}</p>
              </div>
            </motion.div>
            
            {dashboardMetrics.mostActiveForm && (
              <motion.div variants={item} className="group rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
                <div className="p-6">
                  <div className="mb-4 bg-purple-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-300 group-hover:text-purple-400">Most Active Form</h3>
                  <p className="text-lg font-medium text-purple-400">{dashboardMetrics.mostActiveForm.title}</p>
                  <p className="text-sm text-gray-400 mt-1">Responses: {dashboardMetrics.mostActiveForm.responseCount}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center my-12"
          >
            <p className="text-xl text-gray-400">No metrics available.</p>
          </motion.div>
        )}

        <Separator className="my-10 bg-gray-800" />

        {/* 📊 Sentiment Analysis & Submission Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Analytics Overview
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 🟢 Sentiment Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
                <CardHeader className="border-b border-gray-700 bg-gray-800/80">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500/20 p-2 rounded-lg mr-3">
                      <PieChart className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Sentiment Analysis</h3>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 relative">
                  {/* Decorative chart backgrounds */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-500/5 rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Chart container with glassy effect */}
                  <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 relative z-10">
                    <SentimentPie />
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 flex justify-center space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-300">Positive</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm text-gray-300">Neutral</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-300">Negative</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 🔵 Submission Trends */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden shadow-lg hover:shadow-purple-900/20 transition-all duration-300">
                <CardHeader className="border-b border-gray-700 bg-gray-800/80">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500/20 p-2 rounded-lg mr-3">
                      <LineChart className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Submission Trends</h3>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 relative">
                  {/* Decorative chart backgrounds */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Chart container with glassy effect */}
                  <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 relative z-10">
                    <SubmissionTrends />
                  </div>
                  
                  {/* Quick stats */}
                  {/* <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50">
                      <p className="text-xs text-gray-400">Last 7 days</p>
                      <p className="text-lg font-semibold text-purple-400">+24%</p>
                    </div>
                    <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50">
                      <p className="text-xs text-gray-400">Peak day</p>
                      <p className="text-lg font-semibold text-blue-400">Thursday</p>
                    </div>
                    <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50">
                      <p className="text-xs text-gray-400">Trending</p>
                      <p className="text-lg font-semibold text-green-400">Upward</p>
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex justify-end mt-8"
        >
          <Button 
            onClick={fetchDashboardMetrics} 
            disabled={isMetricsLoading} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center shadow-lg transition-all duration-300 hover:shadow-blue-500/20"
          >
            {isMetricsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Metrics
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;