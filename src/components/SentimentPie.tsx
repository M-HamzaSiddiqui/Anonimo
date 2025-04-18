"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem, ChartType } from "chart.js";
import axios from "axios";
import { useSession } from "next-auth/react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SentimentData {
  positive: string; // Changed to string to accommodate percentages
  negative: string;
  neutral: string;
}

interface SentimentPieProps {
  formId?: string;
}

const SentimentPie: React.FC<SentimentPieProps> = ({ formId }) => {
  const { data: session } = useSession();
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?._id) return;

    const fetchSentimentData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/forms/sentiment-analysis", {
          params: { userId: session.user._id, ...(formId && { formId }) },
        });
        console.log(data);
        setSentimentData(data);
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, [session, formId]);

  if (loading) return <p>Loading sentiment analysis...</p>;
  if (!sentimentData) return <p>No sentiment data available.</p>;

  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          parseFloat(sentimentData.positive), // Parse percentage strings to numbers
          parseFloat(sentimentData.negative),
          parseFloat(sentimentData.neutral),
        ],
        backgroundColor: [
          "#2ecc71", // Positive (Emerald Green)
          "#e74c3c", // Negative (Alizarin Crimson)
          "#f39c12", // Neutral (Orange)
        ],
        hoverOffset: 8,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        titleAlign: "center",
        bodyAlign: "center",
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: (context: TooltipItem<ChartType>) => {
            const dataset = context.dataset;
            const percentage = dataset.data[context.dataIndex] as number;
            const label = context.label || "";
            return `${label}: ${percentage.toFixed(2)}%`; // Display percentage with 2 decimal places
          },
        },
      },
    },
    cutout: "40%",
  } as const;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {formId ? `Sentiment Analysis of Feedbacks` : "Overall Sentiment Analysis of Feedbacks"}
      </h2>
      <div style={{ height: "300px" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default SentimentPie;