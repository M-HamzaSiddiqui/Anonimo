import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FormModel } from "@/model/Form.model";
import UserModel from "@/model/User.model";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // console.log(await req.json())

    const { title, description, category, questions, ownerId } = await req.json();

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

    const user = await UserModel.findById(ownerId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formattedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options?.map((opt: string) => ({ text: opt })) || [], 
        order: q.order,
      }));


      
      

      const newForm = await FormModel.create({
        title,
        description,
        category,  // <-- Include category here
        questions: formattedQuestions,
        ownerId,
        slug: nanoid(10)
      });
      

    user.forms.push(newForm._id);
    await user.save();

    return NextResponse.json({ form: newForm }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
