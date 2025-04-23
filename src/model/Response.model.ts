import mongoose, { Schema, Document, Types } from "mongoose";

export interface Response extends Document {
  formId: Types.ObjectId;
  responses: {
    questionId: Types.ObjectId;
    responseValue: any;
    isCorrect?: boolean;
    marks?: number;
  }[];
  totalScore?: number;
  submittedAt: Date;
  username?:string;
  email?: string;
}

const ResponseSchema: Schema<Response> = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  responses: [
    {
      questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      responseValue: { type: Schema.Types.Mixed, required: true },
      isCorrect: { type: Boolean, default: false },
      marks: { type: Number, default: 0 },
    },
  ],
  totalScore: { type: Number, default: -1 },
  submittedAt: { type: Date, default: Date.now },
  username: { type: String },
  email: { type: String },
});

const ResponseModel =
  (mongoose.models.Response as mongoose.Model<Response>) ||
  mongoose.model<Response>("Response", ResponseSchema);

export default ResponseModel;
