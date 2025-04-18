import mongoose, { Schema, Document, Types } from "mongoose";

export interface Response extends Document {
  formId: Types.ObjectId;
  responses: {
    questionId: Types.ObjectId;
    responseValue: any;
  }[];
  submittedAt: Date;
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
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

const ResponseModel =
  (mongoose.models.Response as mongoose.Model<Response>) ||
  mongoose.model<Response>("Response", ResponseSchema);

export default ResponseModel;
