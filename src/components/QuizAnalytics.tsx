'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Loader2, Users, Award, BarChart } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const bucketLabels: Record<string, string> = {
  '0': '0–4',
  '5': '5–9',
  '10': '10–14',
  '15': '15–19',
  '20': '20–24',
  '25': '25–29',
  '30': '30–34',
  '35': '35–39',
  '40+': '40+',
};

type QuizAnalyticsProps = {
    formId: string;
  };

const QuizAnalytics = ({ formId }: QuizAnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/api/forms/analytics/${formId}/quiz-analytics`);
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch quiz analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchAnalytics();
  }, [formId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
          <p className="text-gray-600 font-medium">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center p-6">
          <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No analytics data available for this quiz.</p>
          <p className="text-gray-400 text-sm mt-2">Try again after collecting some submissions.</p>
        </div>
      </div>
    );
  }

  const { totalSubmissions, averageScore, scoreDistribution, submissionTrends, questionStats } = analytics;

  // Calculate pass rate (assuming pass is > 50%)
  const passRate = scoreDistribution
    ? (scoreDistribution
        .filter((d: any) => parseInt(d._id) >= 50)
        .reduce((acc: number, curr: any) => acc + curr.count, 0) /
        totalSubmissions) *
      100
    : 0;

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(53, 53, 53, 0.9)',
        padding: 12,
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 14,
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 13,
        },
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const distributionChartData = {
    labels: scoreDistribution.map((d: any) => bucketLabels[d._id] || `${d._id}%`),
    datasets: [
      {
        label: 'Participants',
        data: scoreDistribution.map((d: any) => d.count),
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderRadius: 6,
        borderWidth: 0,
        hoverBackgroundColor: 'rgba(124, 58, 237, 1)',
      },
    ],
  };

  const submissionTrendData = {
    labels: submissionTrends.map((d: any) => {
      // Format date more nicely if it's a date
      if (d._id && d._id.includes('-')) {
        return new Date(d._id).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }
      return d._id;
    }),
    datasets: [
      {
        label: 'Submissions',
        data: submissionTrends.map((d: any) => d.count),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const questionStatsData = {
    labels: questionStats.map((_: any, idx: number) => `Q${idx + 1}`),
    datasets: [
      {
        label: 'Correctness Rate',
        data: questionStats.map((q: any) => (q.correctnessRate * 100).toFixed(1)),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 6,
        borderWidth: 0,
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">Quiz Analytics Dashboard</h1>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-medium">Total Submissions</h3>
            <Users className="text-purple-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalSubmissions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 font-medium">Average Score</h3>
            <Award className="text-indigo-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{averageScore.toFixed(1)}</p>
        </div>
        

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Score Distribution</h2>
          <div className="h-64">
            <Bar data={distributionChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Submission Trends</h2>
          <div className="h-64">
            <Line data={submissionTrendData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Question Performance Analysis</h2>
        <div className="h-72">
          <Bar data={questionStatsData} options={chartOptions} />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionStats.map((q: any, idx: number) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <p className="font-medium">Question {idx + 1}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  q.correctnessRate >= 0.7 ? 'bg-green-100 text-green-800' : 
                  q.correctnessRate >= 0.4 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {(q.correctnessRate * 100).toFixed(1)}% correct
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;