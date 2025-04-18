import mongoose, { Schema, Document, Types } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface Question extends Document {
  question: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  questions: Question[];
  messages: Message[]; // <-- ✅ Add this
  forms: Types.ObjectId[];
}

const MessageSchema = new Schema<Message>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      default: true,
    },
    messages: {
      type: [MessageSchema], // <-- ✅ Add this
      default: [],
    },
    forms: [{ type: Schema.Types.ObjectId, ref: "Form", default: [] }],
  },
  {
    timestamps: true,
  }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
