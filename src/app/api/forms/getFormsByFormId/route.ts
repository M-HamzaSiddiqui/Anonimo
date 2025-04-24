import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { FormModel } from "@/model/Form.model";
import UserModel from "@/model/User.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formId } = params;

  if (!mongoose.isValidObjectId(formId)) {
    return NextResponse.json({ error: "Invalid Form ID" }, { status: 400 });
  }

  try {
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const form = await FormModel.findOne({
      _id: new mongoose.Types.ObjectId(formId),
      ownerId: user._id,
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error("Fetch form by ID error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
