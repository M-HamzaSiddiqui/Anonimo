"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface TrendData {
  _id: string; // Date (YYYY-MM-DD)
  count: number; // Number of submissions on that date
}

interface FormData {
  _id: string;
  title: string;
}

const SubmissionTrends = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [formId, setFormId] = useState<string | "all">("all"); // "all" means show all registration forms
  const [forms, setForms] = useState<FormData[]>([]); // Store available registration forms
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrends(); // Load submission trends (includes forms)
  }, [formId]);

  // Fetch submission trends + forms in one API call
  const fetchTrends = async () => {
    setLoading(true);
    try {
      const url = formId === "all" ? "/api/forms/submission-trend-analysis" : `/api/forms/submission-trend-analysis?formId=${formId}`;
      const response = await axios.get(url);
      
      setTrends(response.data.trends);
      setForms(response.data.forms); // Forms are now fetched from the API
    } catch (error) {
      console.error("Error fetching submission trends:", error);
    }
    setLoading(false);
  };

  // Prepare chart data
  const chartData = {
    labels: trends.map((item) => item._id),
    datasets: [
      {
        label: "Submissions",
        data: trends.map((item) => item.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Card className="p-4">
      <CardHeader className="text-xl font-semibold">Submission Trends of Registrations</CardHeader>
      <CardContent>
        {/* Form Selector */}
        <Select value={formId} onValueChange={(value) => setFormId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Registration Forms</SelectItem>
            {forms.map((form) => (
              <SelectItem key={form._id} value={form._id}>
                {form.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chart */}
        {loading ? <p className="text-center mt-4">Loading...</p> : <Line data={chartData} />}
      </CardContent>
    </Card>
  );
};

export default SubmissionTrends;
