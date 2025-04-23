import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ResponseModel from "@/model/Response.model";
import { FormModel } from "@/model/Form.model";
import mongoose from "mongoose";
import { verifyRecaptchaToken } from "@/lib/reCaptcha";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { formId, responses, recaptchatoken } = await req.json();

    if (!formId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Invalid Request Data" },
        { status: 400 }
      );
    }

    if (!recaptchatoken) {
      return NextResponse.json(
        { error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }

    const isHuman = await verifyRecaptchaToken(recaptchatoken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Failed recaptcha verfication" },
        { status: 400 }
      );
    }

    const form = await FormModel.findById(formId);
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    let score = 0;
    let updatedResponses = [];

    if (form.category === "Quiz") {
      for (const response of responses) {
        const question = form.questions.find(
          (q: any) => q._id.toString() === response.questionId
        );

        if (!question) continue;

        const userAnswer = response.responseValue;
        const correctAnswer = question.correctAnswer;
        const marks = question.marks || 1;

        let isCorrect = false;
        if (userAnswer === correctAnswer) isCorrect = true;

        if (isCorrect) score += marks;

        updatedResponses.push({
          ...response,
          isCorrect,
          marks: isCorrect ? marks : 0,
        });
      }
    } else {
      updatedResponses = responses;
    }

    console.log("Updated Responses:", updatedResponses);

    const savedResponse = await ResponseModel.create({
      formId: new mongoose.Types.ObjectId(formId),
      responses: updatedResponses,
      totalScore: form.category === "Quiz" ? score : -1,
    });

    if (form.category === "Quiz") {
      const maxScore = form.questions.reduce(
        (sum: number, q: any) => sum + (q.marks || 1),
        0
      );
      return NextResponse.json({ message: "Response saved", score, maxScore });
    }

    return NextResponse.json({ message: "Response saved" });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
