import { NextResponse, NextRequest } from "next/server";
import ResponseModel from "@/model/Response.model";
import { FormModel } from "@/model/Form.model";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId");

    // Fetch all registration forms
    const registrationForms = await FormModel.find({ category: "Registration" }).select("_id title");

    // Extract form IDs
    const registrationFormIds = registrationForms.map((form) => form._id);

    const matchCondition: any = formId
      ? { formId: new mongoose.Types.ObjectId(formId) } // Convert formId to ObjectId
      : { formId: { $in: registrationFormIds } };

    // Fetch submission trends
    const submissionTrends = await ResponseModel.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("submissionTrends", submissionTrends);

    return NextResponse.json(
      {
        trends: submissionTrends,
        forms: registrationForms, // Include forms in the response
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching submission trends", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
