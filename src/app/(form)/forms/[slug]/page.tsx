"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ResponseForm = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [score, setScore] = useState<number | null>(null); // For quiz result

  useEffect(() => {
    if (!slug) return;

    const fetchForm = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/forms/${slug}`);
        setForm(data.form);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [slug, toast]);

  const handleChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedResponses = Object.entries(responses).map(
      ([questionId, responseValue]) => ({
        questionId,
        responseValue,
      })
    );

    const payload = { formId: form._id, responses: formattedResponses };
    console.log("payload", payload);

    try {
      const {data} = await axios.post("/api/forms/response", payload);
      console.log(data)
      console.log(form.category)

      if (form.category === "Quiz" && data.score !== undefined) {
        setScore(data.score);
        toast({
          title: `Your score: ${data.score}/${form.totalMarks}`,
          description: "Quiz submitted successfully!",
        });

        // Redirect to Thank You page with the score as query param
        // Redirect to Thank You page with the score as query param
        setTimeout(() => {
          const queryParams = new URLSearchParams({
            score: String(data.score),
            totalMarks: String(form.totalMarks),
          }).toString();

          router.push(`/thank-you?${queryParams}`);
        }, 3000); // Optional: Delay redirect for a smoother experience
        // Optional: Delay redirect for a smoother experience
      } else {
        toast({
          title: "Success!",
          description: "Your response has been recorded successfully",
        });
        router.push("/thank-you");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-400 text-lg">Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border border-gray-700">
        <p className="text-center text-red-400 text-lg">
          Form not found or unavailable
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700"
        >
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="backdrop-blur-sm bg-black/60 rounded-2xl shadow-xl overflow-hidden border border-gray-800"
      >
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-8 border-b border-gray-800">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 text-center mb-2">
              {form.title}
            </h1>
            <p className="text-gray-300 text-md text-center mt-2 max-w-2xl mx-auto">
              {form.description}
            </p>
          </motion.div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {form.questions.map((q: any, index: number) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300"
              >
                <Label className="block text-lg font-medium text-gray-200 mb-3">
                  {index + 1}. {q.questionText}
                  {form.category === "Quiz" && q.marks && (
                    <span className="ml-2 text-sm text-indigo-400">
                      ({q.marks} marks)
                    </span>
                  )}
                </Label>

                {q.questionType === "text" && (
                  <Input
                    type="text"
                    className="w-full bg-gray-700/70 text-white border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    placeholder="Your answer"
                  />
                )}

                {q.questionType === "number" && (
                  <Input
                    type="number"
                    className="w-full bg-gray-700/70 text-white border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    placeholder="0"
                  />
                )}

                {q.questionType === "multiple-choice" && (
                  <div className="space-y-2 mt-2">
                    {q.options.map((opt: any, i: number) => (
                      <label
                        key={i}
                        className="flex items-center space-x-3 text-gray-300 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer border border-gray-700 hover:border-indigo-500/50"
                      >
                        <input
                          type="radio"
                          name={`question-${q._id}`}
                          value={opt.text || opt}
                          className="w-5 h-5 accent-indigo-500"
                          onChange={(e) => handleChange(q._id, e.target.value)}
                        />
                        <span>{opt.text || opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.questionType === "checkbox" && (
                  <div className="space-y-2 mt-2">
                    {q.options.map((opt: any, i: number) => (
                      <label
                        key={i}
                        className="flex items-center space-x-3 text-gray-300 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer border border-gray-700 hover:border-indigo-500/50"
                      >
                        <Checkbox
                          className="border-gray-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                          onCheckedChange={(checked) => {
                            const optText = opt.text || opt;
                            setResponses((prev) => {
                              const currentValues: string[] = Array.isArray(
                                prev[q._id]
                              )
                                ? (prev[q._id] as string[])
                                : prev[q._id]
                                ? [prev[q._id] as string]
                                : [];

                              return {
                                ...prev,
                                [q._id]: checked
                                  ? [...currentValues, optText]
                                  : currentValues.filter((v) => v !== optText),
                              };
                            });
                          }}
                        />
                        <span>{opt.text || opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.questionType === "dropdown" && (
                  <Select onValueChange={(value) => handleChange(q._id, value)}>
                    <SelectTrigger className="w-full bg-gray-700/70 border-gray-600 text-white hover:border-indigo-500/70 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {q.options.map((opt: any, i: number) => (
                        <SelectItem
                          key={i}
                          value={opt.text || opt}
                          className="focus:bg-indigo-900/30 hover:bg-gray-700"
                        >
                          {opt.text || opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium p-6 h-auto rounded-xl shadow-lg shadow-indigo-900/20 transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Response"
                )}
              </Button>
            </motion.div>

            {score !== null && (
              <motion.div
                variants={itemVariants}
                className="mt-6 text-center text-xl text-indigo-400 font-semibold"
              >
                You scored: {score} / {form.totalMarks}
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResponseForm;
