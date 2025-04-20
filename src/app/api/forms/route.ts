// File: app/api/forms/route.ts (or wherever your form creation route is)

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FormModel } from "@/model/Form.model";
import UserModel from "@/model/User.model";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { title, description, category, questions, ownerId } = await req.json();

    // Basic validation
    if (!title || !ownerId) {
      return NextResponse.json(
        { error: "Title and ownerId are required" },
        { status: 400 }
      );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "At least one question is required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await UserModel.findById(ownerId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format and validate questions
    const formattedQuestions = questions.map((q: any) => ({
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options?.map((opt: string) => ({ text: opt })) || [],
      order: q.order,
      marks: q.marks ?? undefined,
      correctAnswer: q.correctAnswer ?? undefined,
    }));

    // Create form
    const newForm = await FormModel.create({
      title,
      description,
      category,
      questions: formattedQuestions,
      ownerId,
      slug: nanoid(10), // You can omit this if default in schema
    });

    // Add form reference to user
    user.forms.push(newForm._id);
    await user.save();

    return NextResponse.json({ form: newForm }, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
