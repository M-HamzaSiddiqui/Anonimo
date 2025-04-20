"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  order: number;
  marks?: number;
  correctAnswer?: string | number | string[] | number[];
}

const CATEGORIES = [
  "Survey",
  "Feedback",
  "Registration",
  "Quiz",
  "Poll",
  "Application",
  "Assessment",
  "Order Form",
  "Others",
];

const QUESTION_TYPES = [
  { value: "text", label: "Text", icon: "✏️" },
  { value: "number", label: "Number", icon: "🔢" },
  { value: "multiple-choice", label: "Multiple Choice", icon: "⭕" },
  { value: "checkbox", label: "Checkbox", icon: "✅" },
  { value: "dropdown", label: "Dropdown", icon: "🔽" },
];

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState(
    "Form description (optional)"
  );
  const [formCategory, setFormCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    questions.forEach((q, index) => {
      setValue(`questions.${index}.questionText`, q.questionText);
      setValue(`questions.${index}.questionType`, q.questionType);
    });
  }, [questions, setValue]);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    const reordered = Array.from(questions);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    setQuestions(reordered);
  };

  const onSubmit = async () => {
    if (!session?.user?._id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a form.",
        variant: "destructive",
      });
      return;
    }

    if (!formCategory) {
      toast({
        title: "Missing Category",
        description: "Please select a category for your form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const totalMarks =
      formCategory === "Quiz"
        ? questions.reduce((sum, q) => sum + (q.marks || 0), 0)
        : undefined;

    const formData = {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      ownerId: session.user._id,
      questions: questions.map(({ id, ...q }) => q),
      ...(formCategory === "Quiz" && { totalMarks }),
    };

    try {
      const response = await axios.post("/api/forms", formData);
      toast({
        title: "Success",
        description: "Form created successfully!",
        variant: "default",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    return QUESTION_TYPES.find((t) => t.value === type)?.icon || "❓";
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
        >
          {/* Form Header */}
          <div className="border-b border-gray-700">
            <div className="px-8 py-6">
              <Input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Untitled Form"
                className="text-3xl font-bold text-gray-200 w-full border-none focus:ring-0 bg-transparent p-2 rounded-md hover:bg-gray-700/50 transition"
              />

              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Form description (optional)"
                className="text-lg text-gray-400 w-full border-none focus:ring-0 bg-transparent p-2 rounded-md hover:bg-gray-700/50 transition resize-none mt-2"
                rows={2}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-750">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Form Category
            </label>
            <Select
              value={formCategory}
              onValueChange={setFormCategory}
              required
            >
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-300">
                <SelectValue placeholder="Select Form Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-300">
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="focus:bg-gray-600 focus:text-gray-200"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Questions Section */}
          <div className="px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Questions
            </h2>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-6"
                  >
                    {questions.length === 0 && (
                      <div className="text-center py-12 bg-gray-750 rounded-lg border border-dashed border-gray-600">
                        <p className="text-gray-400">
                          No questions yet. Add your first question below.
                        </p>
                      </div>
                    )}

                    {questions.map((question, index) => (
                      <Draggable
                        key={question.id}
                        draggableId={question.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <li
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className={`p-6 bg-gray-750 border border-gray-700 rounded-lg transition-all ${
                              snapshot.isDragging
                                ? "shadow-lg ring-1 ring-blue-500/50"
                                : "hover:shadow-md hover:border-gray-600"
                            }`}
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab text-gray-500 hover:text-gray-300 p-1"
                                  >
                                    ⋮⋮
                                  </div>
                                  <span className="text-gray-300 text-sm font-medium bg-gray-700 px-2 py-1 rounded">
                                    Question {index + 1}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="text-gray-500 hover:text-red-400 hover:bg-gray-700 p-1 rounded-full transition-colors"
                                  onClick={() =>
                                    setQuestions(
                                      questions.filter(
                                        (q) => q.id !== question.id
                                      )
                                    )
                                  }
                                >
                                  🗑️
                                </button>
                              </div>

                              <Input
                                type="text"
                                placeholder="Question"
                                value={question.questionText}
                                onChange={(e) =>
                                  setQuestions((prev) => {
                                    const newQ = [...prev];
                                    newQ[index].questionText = e.target.value;
                                    return newQ;
                                  })
                                }
                                className="w-full text-lg font-medium text-gray-200 bg-gray-700 border-gray-600 focus:border-blue-500"
                              />

                              {formCategory === "Quiz" && (
                                <div>
                                  <label className="text-sm text-gray-300">
                                    Marks
                                  </label>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={question.marks || ""}
                                    onChange={(e) =>
                                      setQuestions((prev) => {
                                        const updated = [...prev];
                                        updated[index].marks =
                                          parseInt(e.target.value) || 0;
                                        return updated;
                                      })
                                    }
                                    className="w-32 bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 mt-1"
                                    placeholder="e.g. 5"
                                  />
                                </div>
                              )}

                              {formCategory !== "Quiz" && (
                                <Select
                                  value={question.questionType}
                                  onValueChange={(value) =>
                                    setQuestions((prev) => {
                                      const newQ = [...prev];
                                      newQ[index].questionType = value;
                                      return newQ;
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-300">
                                    <SelectValue placeholder="Select question type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-700 border-gray-600 text-gray-300">
                                    {QUESTION_TYPES.map((type) => (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                        className="focus:bg-gray-600 focus:text-gray-200"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span>{type.icon}</span>
                                          <span>{type.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}

                              {/* Show options input only if the question type is multiple-choice, checkbox, or dropdown */}
                              {formCategory == "Quiz" && (
                                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                  <p className="text-sm font-medium text-gray-300 mb-2">
                                    Options
                                  </p>

                                  {question.options.length === 0 && (
                                    <p className="text-sm text-gray-400 italic mb-2">
                                      Add your first option
                                    </p>
                                  )}

                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className="flex items-center space-x-2 mt-2 group"
                                    >
                                      <div className="w-6 text-center text-gray-400">
                                        {getQuestionTypeIcon(
                                          question.questionType
                                        )}
                                      </div>
                                      <input
                                        type="radio"
                                        name={`correct-${index}`} // Ensures only one correct option per question
                                        checked={
                                          question.correctAnswer === option
                                        }
                                        onChange={() => {
                                          setQuestions((prev) => {
                                            const newQ = [...prev];
                                            newQ[index].correctAnswer = option;
                                            return newQ;
                                          });
                                        }}
                                        className="accent-green-500"
                                      />
                                      <Input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                          setQuestions((prev) => {
                                            const newQ = [...prev];
                                            newQ[index].options[optIndex] =
                                              e.target.value;

                                            // Optional: if the updated option was marked correct, update correctAnswer too
                                            if (
                                              newQ[index].correctAnswer ===
                                              option
                                            ) {
                                              newQ[index].correctAnswer =
                                                e.target.value;
                                            }

                                            return newQ;
                                          });
                                        }}
                                        className="w-full bg-gray-600 border-gray-600 text-gray-200 focus:border-blue-500"
                                      />
                                      <button
                                        type="button"
                                        className="text-gray-500 group-hover:text-red-400 p-1 rounded"
                                        onClick={() => {
                                          setQuestions((prev) => {
                                            const newQ = [...prev];
                                            const removedOption =
                                              newQ[index].options[optIndex];

                                            newQ[index].options = newQ[
                                              index
                                            ].options.filter(
                                              (_, i) => i !== optIndex
                                            );

                                            // Remove correctAnswer if the selected one was deleted
                                            if (
                                              newQ[index].correctAnswer ===
                                              removedOption
                                            ) {
                                              newQ[index].correctAnswer = "";
                                            }

                                            return newQ;
                                          });
                                        }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}

                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setQuestions((prev) => {
                                        const newQ = [...prev];
                                        newQ[index].options.push("");
                                        return newQ;
                                      });
                                    }}
                                    variant="outline"
                                    className="mt-3 text-sm bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                                  >
                                    <span className="mr-1">+</span> Add Option
                                  </Button>
                                </div>
                              )}
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>

            <div className="mt-8">
              <Button
                type="button"
                onClick={() => {
                  if (questions.length < 10) {
                    setQuestions([
                      ...questions,
                      {
                        id: uuidv4(),
                        questionText: "",
                        questionType:
                          formCategory === "Quiz" ? "multiple-choice" : "text",
                        options: [],
                        order: questions.length + 1,
                        marks: formCategory === "Quiz" ? 1 : undefined,
                        correctAnswer: "",
                      },
                    ]);
                  } else {
                    toast({
                      title: "Limit Reached",
                      description: "You can only add up to 10 questions.",
                      variant: "destructive",
                    });
                  }
                }}
                variant="outline"
                className="w-full hover:bg-gray-700 border-dashed border-gray-600 text-gray-300"
              >
                <span className="mr-2">+</span> Add Question
              </Button>
            </div>
            {formCategory === "Quiz" && (
              <div className="mt-6 text-right text-lg text-green-400 font-semibold">
                Total Marks:{" "}
                {questions.reduce((acc, q) => acc + (Number(q.marks) || 0), 0)}
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="px-8 py-6 border-t border-gray-700 bg-gray-800 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {questions.length}/10 questions added
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Form"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
