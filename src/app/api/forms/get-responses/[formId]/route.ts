import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ResponseModel from "@/model/Response.model";
import { FormModel } from "@/model/Form.model";

export async function GET(req: Request, { params }: { params: { formId: string } }) {
  try {
    await dbConnect();

    const form = await FormModel.findById(params.formId).lean();
    if (!form) {
      return NextResponse.json({ success: false, message: "Form not found" }, { status: 404 });
    }

    const responses = await ResponseModel.find({ formId: params.formId }).lean();

    // Map question IDs to their respective question text
    const questionMap = new Map(
      form.questions.map((q) => [q._id.toString(), q.questionText])
    );

    // Replace questionId with the actual question text
    const formattedResponses = responses.map((response) => ({
      ...response,
      responses: response.responses.map((resp) => ({
        questionText: questionMap.get(resp.questionId.toString()) || "Unknown Question",
        responseValue: resp.responseValue,
      })),
    }));

    return NextResponse.json({ success: true, data: formattedResponses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
