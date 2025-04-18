import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel, { Question } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const { question } = await request.json();

  try {
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const username = session.user.username;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const newQuestion = {
      question,
      createdAt: new Date(),
    };

    user.questions.push(newQuestion as Question);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Question added successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding question", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
