import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ResponseModel from "@/model/Response.model";
import { FormModel } from "@/model/Form.model";
import mongoose from "mongoose"; // Import the email helper
import { sendQuizScoreEmail } from "@/helpers/sendQuizScoreEmail";

// Function to validate email format
function isValidEmailFormat(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { formId, responses, username, email } = await req.json();

    // Check for missing data or invalid email format
    if (!formId || !responses || !Array.isArray(responses) || !username || !email) {
      return NextResponse.json({ error: "Invalid Request Data" }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmailFormat(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if the user has already submitted a response for this form
    const existingResponse = await ResponseModel.findOne({
      formId: new mongoose.Types.ObjectId(formId),
      email: email, // Check if the email already submitted
    });

    if (existingResponse) {
      return NextResponse.json({ error: "This email has already submitted a response for this quiz." }, { status: 400 });
    }

    const form = await FormModel.findById(formId);
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Only process quiz submissions
    if (form.category !== "Quiz") {
      return NextResponse.json({ error: "This is not a quiz form" }, { status: 400 });
    }

    let score = 0;
    let updatedResponses = [];

    // Process quiz responses and calculate score
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

    const savedResponse = await ResponseModel.create({
      formId: new mongoose.Types.ObjectId(formId),
      responses: updatedResponses,
      totalScore: score,
      username,
      email,
      submittedAt: new Date(),
    });

    const maxScore = form.questions.reduce((sum: number, q: any) => sum + (q.marks || 1), 0);

    // Send email with quiz score
    await sendQuizScoreEmail(email, username, score, maxScore);

    return NextResponse.json({ message: "Quiz response saved", score, maxScore });
  } catch (error) {
    console.error("Error submitting quiz response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
