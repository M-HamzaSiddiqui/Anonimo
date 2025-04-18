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

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  order: number;
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
  const [formCategory, setFormCategory] = useState(""); // ✅ Add category state
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    questions.forEach((q, index) => {
      setValue(`questions.${index}.questionText`, q.questionText);
      setValue(`questions.${index}.questionType`, q.questionType);
    });
  }, [questions, setValue]);

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

    const formData = {
      title: formTitle,
      description: formDescription,
      category: formCategory, // ✅ Include category in submission
      ownerId: session.user._id,
      questions: questions.map(({ id, ...q }) => q),
    };

    try {
      console.log("✅ Submitting form data:", formData);
      const response = await axios.post("/api/forms", formData);
      console.log("Form submitted successfully:", response.data);
      toast({ title: "Success", description: "Form created successfully!" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8"
      >
        <div className="mb-6">
          <Input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Untitled Form"
            className="text-3xl font-bold text-gray-900 w-full border-none focus:ring-0 bg-transparent p-2 rounded-md hover:bg-gray-100 transition"
          />

          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Form description (optional)"
            className="text-lg text-gray-600 w-full border-none focus:ring-0 bg-transparent p-2 rounded-md hover:bg-gray-100 transition resize-none mt-2"
            rows={2}
          />

          {/* ✅ Category Selection */}
          <Select value={formCategory} onValueChange={setFormCategory} required>
            <SelectTrigger className="w-full mt-4">
              <SelectValue placeholder="Select Form Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Questions Section */}
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="questions">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                {questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">
                              Question {index + 1}
                            </span>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() =>
                                setQuestions(
                                  questions.filter((q) => q.id !== question.id)
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
                            className="w-full text-lg font-medium text-gray-800"
                          />

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
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="multiple-choice">
                                Multiple Choice
                              </SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* Show options input only if the question type is multiple-choice, checkbox, or dropdown */}
                          {["multiple-choice", "checkbox", "dropdown"].includes(
                            question.questionType
                          ) && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-600">
                                Options:
                              </p>
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center space-x-2 mt-2"
                                >
                                  <Input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      setQuestions((prev) => {
                                        const newQ = [...prev];
                                        newQ[index].options[optIndex] =
                                          e.target.value;
                                        return newQ;
                                      });
                                    }}
                                    className="w-full"
                                  />
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      setQuestions((prev) => {
                                        const newQ = [...prev];
                                        newQ[index].options = newQ[
                                          index
                                        ].options.filter(
                                          (_, i) => i !== optIndex
                                        );
                                        return newQ;
                                      });
                                    }}
                                  >
                                    🗑️
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
                                className="mt-2"
                              >
                                ➕ Add Option
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
                    questionType: "text",
                    options: [],
                    order: questions.length + 1,
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
            className="w-full"
          >
            ➕ Add Question
          </Button>
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Create Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
