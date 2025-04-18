"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface ResponseData {
  _id: string;
  responses: {
    questionText: string;
    responseValue: any;
  }[];
  submittedAt: string;
}

const Responses = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`/api/forms/get-responses/${formId}`);
        setResponses(response.data.data);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  // Extract unique question texts for table headers
  const uniqueQuestions = Array.from(
    new Set(responses.flatMap((res) => res.responses.map((r) => r.questionText)))
  );

  // Function to format response value
  const formatResponseValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(", "); // Convert array to comma-separated string
    }
    return value;
  };

  // Function to download responses as an Excel file
  const downloadExcel = () => {
    // Create a structured data array for Excel
    const excelData = responses.map((response) => {
      const row: Record<string, any> = {};

      // Fill in answers for each question
      uniqueQuestions.forEach((question) => {
        const foundResponse = response.responses.find((r) => r.questionText === question);
        row[question] = foundResponse ? formatResponseValue(foundResponse.responseValue) : "";
      });

      // Add submission date
      row["Submitted At"] = new Date(response.submittedAt).toLocaleString();

      return row;
    });

    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `form_responses_${formId}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Form Responses</h1>
        {responses.length > 0 && (
          <button
            onClick={downloadExcel}
            className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Excel
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                {uniqueQuestions.map((question, index) => (
                  <th key={index} className="px-4 py-2 border border-gray-600 text-left">
                    {question}
                  </th>
                ))}
                <th className="px-4 py-2 border border-gray-600 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => {
                const responseMap = new Map(
                  response.responses.map((resp) => [resp.questionText, formatResponseValue(resp.responseValue)])
                );

                return (
                  <tr key={response._id} className="border border-gray-700">
                    {uniqueQuestions.map((question, idx) => (
                      <td key={idx} className="px-4 py-2 border border-gray-600">
                        {responseMap.get(question) || ""}
                      </td>
                    ))}
                    <td className="px-4 py-2 border border-gray-600">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Responses;
