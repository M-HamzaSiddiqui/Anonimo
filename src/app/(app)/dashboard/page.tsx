"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import SentimentPie from "@/components/SentimentPie";
import SubmissionTrends from "@/components/submissionTrendsLineChart";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
    return <p className="text-center mt-10 text-lg">Please log in to access the dashboard.</p>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-lg shadow-md w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {isMetricsLoading ? (
        <div className="flex justify-center items-center my-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading metrics...</span>
        </div>
      ) : dashboardMetrics ? (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Total Forms</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardMetrics.totalForms}</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Total Responses</h3>
            <p className="text-3xl font-bold text-green-600">{dashboardMetrics.totalResponses}</p>
          </div>
          {dashboardMetrics.mostActiveForm && (
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Most Active Form</h3>
              <p className="text-lg font-medium">{dashboardMetrics.mostActiveForm.title}</p>
              <p className="text-sm text-gray-600 mt-1">Responses: {dashboardMetrics.mostActiveForm.responseCount}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">No metrics available.</p>
      )}

      <Separator className="my-8" />

      {/* 📊 Sentiment Analysis & Submission Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🟢 Sentiment Pie Chart */}
        <Card>
          <CardHeader className="text-lg font-semibold">Sentiment Analysis</CardHeader>
          <CardContent>
            <SentimentPie />
          </CardContent>
        </Card>

        {/* 🔵 Submission Trends */}
        <Card>
          <CardHeader className="text-lg font-semibold">Submission Trends</CardHeader>
          <CardContent>
            <SubmissionTrends />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={fetchDashboardMetrics} disabled={isMetricsLoading}>
          {isMetricsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Metrics"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
