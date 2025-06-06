import { nanoid } from "ai";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Question {
  _id: Types.ObjectId;
  questionText: string;
  questionType: "text" | "number" | "multiple-choice" | "checkbox" | "dropdown";
  options?: { text: string }[];
  order: number;
  marks?: number;
  correctAnswer?: string | number | string[] | number[];
}

export interface Form extends Document {
  title: string;
  description?: string;
  category: string; // ✅ Added category field
  questions: Question[];
  totalMarks?: number;
  createdAt: Date;
  ownerId: Types.ObjectId;
  slug: string;
}

const FormSchema: Schema<Form> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: [
      "Survey",
      "Feedback",
      "Registration",
      "Quiz",
      "Poll",
      "Application",
      "Assessment",
      "Order Form",
      "Others",
    ], // ✅ Predefined categories
    required: true,
  },
  questions: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      questionText: { type: String, required: true },
      questionType: {
        type: String,
        enum: ["text", "number", "multiple-choice", "checkbox", "dropdown"],
        required: true,
      },
      options: {
        type: [{ text: String }],
        default: [],
      },
      order: { type: Number, required: true },
      marks: {type: Number},
      correctAnswer: {
        type: Schema.Types.Mixed
      },
    },
  ],
  totalMarks: { type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slug: { type: String, unique: true, required: true, default: () => nanoid(10) },
});

FormSchema.pre("save", function(next) {
  if (this.category === "Quiz") {
    this.totalMarks = this.questions.reduce((sum, question) => {
      return sum + (question.marks || 0);  // Ensure marks is treated as a number
    }, 0);
  }
  next();
});

const FormModel =
  (mongoose.models.Form as mongoose.Model<Form>) ||
  mongoose.model<Form>("Form", FormSchema);

export { FormModel };
