import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FormModel } from "@/model/Form.model";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const { userId } = params;

    console.log(userId)

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userForms = await FormModel.find({ ownerId: userId }).sort({
      createdAt: -1,
    });

    // console.log(userForms)

    return NextResponse.json(
      { success: true, data: userForms },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user forms:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
