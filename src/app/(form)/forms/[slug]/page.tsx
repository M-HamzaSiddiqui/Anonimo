"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { HeroHighlight } from "@/components/ui/hero-highlight";
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

const ResponseForm = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;

    const fetchForm = async () => {
      try {
        console.log(slug)
        const { data } = await axios.get(`/api/forms/${slug}`);
        setForm(data.form);
      } catch (error) {
        console.error("Error fetching form: ", error);
      }
    };

    fetchForm();
  }, [slug]);

  const handleChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedResponses = Object.entries(responses).map(
      ([questionId, responseValue]) => ({
        questionId,
        responseValue,
      })
    );

    const payload = { formId: form._id, responses: formattedResponses };

    try {
      await axios.post("/api/forms/response", payload);
      toast({
        title: "Response Submitted",
        description: "Your response has been recorded successfully",
        variant: "default",
      });
      router.push("/thank-you");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <HeroHighlight containerClassName="min-h-screen bg-black dark:bg-black">

      <div className="w-full max-w-6xl min-w-[500px] mx-auto p-12 lg:p-16 bg-black/90 dark:bg-gray-900 text-white shadow-xl rounded-xl">
        {form ? (
          <>
          <div className=" mb-8">

            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white text-center mt-[-20px] mb-3"
            >
              {form.title}
            </motion.h1>
            <p className="text-gray-300 text-lg text-center mt-[-5px]">
              {form.description}
            </p>
          </div>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {form.questions.map((q: any, index: number) => (
                <div key={index} className="mb-6 space-y-4">
                  <Label className="block font-semibold text-gray-300">
                    {q.questionText}
                  </Label>

                  {q.questionType === "text" && (
                    <Input
                      type="text"
                      className="w-full p-3 bg-gray-800 text-white border-gray-600 focus:ring-indigo-500 rounded-lg"
                      onChange={(e) => handleChange(q._id, e.target.value)}
                    />
                  )}

                  {q.questionType === "number" && (
                    <Input
                      type="number"
                      className="w-full p-3 bg-gray-800 text-white border-gray-600 focus:ring-indigo-500 rounded-lg"
                      onChange={(e) => handleChange(q._id, e.target.value)}
                    />
                  )}

                  {q.questionType === "multiple-choice" && (
                    <div className="space-y-3">
                      {q.options.map((opt: any, i: number) => (
                        <label
                          key={i}
                          className="block flex items-center space-x-3 text-gray-300 py-2"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={opt.text}
                            className="w-5 h-5 accent-indigo-500"
                            onChange={(e) =>
                              handleChange(q._id, e.target.value)
                            }
                          />
                          <span>{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.questionType === "checkbox" && (
                    <div className="space-y-3">
                      {q.options.map((opt: any, i: number) => (
                        <label
                          key={i}
                          className="block flex items-center space-x-3 text-gray-300 py-2"
                        >
                          <Checkbox
                            className="border-gray-500"
                            onCheckedChange={(checked) => {
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
                                    ? [...currentValues, opt.text]
                                    : currentValues.filter(
                                        (v) => v !== opt.text
                                      ),
                                };
                              });
                            }}
                          />
                          <span>{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.questionType === "dropdown" && (
                    <Select
                      onValueChange={(value) => handleChange(q._id, value)}
                    >
                      <SelectTrigger className="w-full p-3 bg-gray-800 border-gray-600 text-white rounded-lg">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 text-white rounded-lg">
                        {q.options.map((opt: any, i: number) => (
                          <SelectItem key={i} value={opt.text}>
                            {opt.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}

              <Button
                type="submit"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg"
              >
                Submit
              </Button>
            </form>
          </>
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </div>
    </HeroHighlight>
  );
};

export default ResponseForm;
