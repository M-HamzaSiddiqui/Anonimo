import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { FormModel } from "@/model/Form.model";
import UserModel from "@/model/User.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ResponseModel from "@/model/Response.model";

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
  console.log("formId", formId)

  if (!mongoose.isValidObjectId(formId)) {
    return NextResponse.json({ error: "Invalid Form ID" }, { status: 400 });
  }

  try {

    console.log("formId in try", formId)
    const formObjectId = new mongoose.Types.ObjectId(formId);

    const form = await FormModel.findById(formObjectId).lean();
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const user = await UserModel.findOne({ email: session.user.email });

    if (!user || !form.ownerId.equals(user._id)) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this form" },
        { status: 403 }
      );
    }

    const [
      totalSubmissions,
      averageScoreAgg,
      scoreDistribution,
      submissionTrends,
      questionStats,
    ] = await Promise.all([
      ResponseModel.countDocuments({ formId: formObjectId }),

      ResponseModel.aggregate([
        { $match: { formId: formObjectId } },
        {
          $group: { _id: null, averageScore: { $avg: "$totalScore" } },
        },
      ]),

      ResponseModel.aggregate([
        { $match: { formId: formObjectId } },

        {
          $bucket: {
            groupBy: "$totalScore",
            boundaries: [0, 5, 10, 15, 20, 25, 30, 35, 40],
            default: "40+",
            output: { count: { $sum: 1 } },
          },
        },
      ]),

      ResponseModel.aggregate([
        { $match: { formId: formObjectId } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      ResponseModel.aggregate([
        { $match: { formId: formObjectId } },
        { $unwind: "$responses" },
        {
          $group: {
            _id: "$responses.questionId",
            total: { $sum: 1 },
            correct: { $sum: { $cond: ["$responses.isCorrect", 1, 0] } },
          },
        },
        {
          $project: {
            questionId: "$_id",
            correctnessRate: { $divide: ["$correct", "$total"] },
          },
        },
      ]),
    ]);

    const averageScore = averageScoreAgg[0]?.averageScore || 0;

    return NextResponse.json(
      {
        totalSubmissions,
        averageScore,
        scoreDistribution,
        submissionTrends,
        questionStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz Analytics API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
