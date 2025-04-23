"use client";

import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useParams, useRouter } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`/api/forms/${slug}`);
        setForm(data.form);
      } catch {
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
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const t = process.env.NODE_ENV === "production"
  ? process.env.RECAPTCHA_PROD_SITE_KEY!
  : process.env.NEXT_PUBLIC_RECAPTCHA_DEV_SITE_KEY!

  console.log("t", typeof(t))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!recaptchaToken) {
      toast({
        title: "reCAPTCHA Failed",
        description: "Please verify that you're not a robot.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (form.category === "Quiz" && (!username || !email)) {
      toast({
        title: "Missing Fields",
        description: "Please provide your name and email to submit the quiz.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      formId: form._id,
      responses: Object.entries(responses).map(
        ([questionId, responseValue]) => ({
          questionId,
          responseValue,
        })
      ),
      ...(form.category === "Quiz" && { username, email }),
      recaptchatoken:recaptchaToken,
    };

    try {
      await axios.post(
        form.category === "Quiz"
          ? "/api/forms/response/submit-quiz-response"
          : "/api/forms/response",
        payload
      );

      toast({
        title: "Success!",
        description: "Your response has been recorded successfully",
      });

      router.push("/thank-you");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";

      if (
        error?.response?.status === 400 &&
        errorMessage ===
          "This email has already submitted a response for this quiz."
      ) {
        toast({
          title: "Already Submitted",
          description: "You have already submitted a response with this email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 text-center mb-2">
              {form.title}
            </h1>
            <p className="text-gray-300 text-md text-center mt-2 max-w-2xl mx-auto">
              {form.description}
            </p>
          </motion.div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {form.category === "Quiz" && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div>
                  <Label className="block text-lg text-gray-200 mb-1">
                    Your Name
                  </Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-gray-700/70 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <Label className="block text-lg text-gray-200 mb-1">
                    Your Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-gray-700/70 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    required
                  />
                </div>
              </motion.div>
            )}

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
                    placeholder="Your answer"
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    className="w-full bg-gray-700/70 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                  />
                )}

                {q.questionType === "number" && (
                  <Input
                    type="number"
                    placeholder="0"
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    className="w-full bg-gray-700/70 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
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
                              const current: string[] = Array.isArray(
                                prev[q._id]
                              )
                                ? (prev[q._id] as string[])
                                : prev[q._id]
                                ? [prev[q._id] as string]
                                : [];

                              return {
                                ...prev,
                                [q._id]: checked
                                  ? [...current, optText]
                                  : current.filter((v) => v !== optText),
                              };
                            });
                          }}
                        />
                        <span>{opt.text || opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={
                process.env.NODE_ENV === "production"
                  ? process.env.NEXT_PUBLIC_RECAPTCHA_PROD_SITE_KEY!
                  : process.env.NEXT_PUBLIC_RECAPTCHA_DEV_SITE_KEY!
              } // Dev key
              onChange={(token) => setRecaptchaToken(token)}
              className="my-4"
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : null}
              Submit Response
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResponseForm;
