import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";

export async function DELETE(
  request: Request,
  {params} : {params: {questionId: string}}
) {
    console.log("hello", params.questionId)
  await dbConnect();
  const session = await getServerSession(authOptions);
  const questionId = params.questionId;
  try {
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const username = session.user?.username;

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

    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { questions: { _id: questionId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message:
            "Unable to delete because either the question doesn't exists or already deleted.",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Question removed successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in delete question route", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
