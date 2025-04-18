"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SentimentPie from "@/components/SentimentPie";
import SubmissionTrends from "./submissionTrendsLineChart";

interface Form {
  _id: string;
  title: string;
  category: string;
}

interface FormAnalyticsProps {
  slug: string;
}

const FormAnalytics: React.FC<FormAnalyticsProps> = ({ slug }) => {
  console.log("slug received in FormAnalytics:", slug); // Debugging 
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("slug in fa ", slug)

  useEffect(() => {
    console.log("🔄 useEffect triggered with slug:", slug);
    if (!slug) {
      console.log("❌ No slug provided, exiting useEffect.");
      return;
    }
  
    const fetchFormDetails = async () => {
      try {
        const { data } = await axios.get(`/api/forms/${slug}`);
        console.log("API Response:", data.form); // Debug API response
        setForm(data.form); // Ensure 'data' matches { _id, title, category }
      } catch (error) {
        console.error("Error fetching form details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFormDetails();
  }, [slug]);
  

  if (loading) return <p>Loading analytics...</p>;
  if (!form) return <p>Form not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {form.title} - Analytics
      </h2>

      {form.category === "Feedback" && <SentimentPie formId={form._id} />}
      {form.category === "Registration" && <SubmissionTrends />}
      
      {form.category !== "Feedback" && form.category !== "Registration" && (
        <p className="text-center text-gray-500">No analytics available for this form type.</p>
      )}
    </div>
  );
};

export default FormAnalytics;
