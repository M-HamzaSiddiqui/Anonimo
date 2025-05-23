import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FormModel } from "@/model/Form.model";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    console.log(id)

    if (!id) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    const form = await FormModel.findOne({ slug: id });
    console.log("form", form)

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    console.log(form)

    return NextResponse.json({ form }, { status: 200 });
  } catch (error) {
    console.error("Error fetching form: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    const deletedForm = await FormModel.findByIdAndDelete(id);

    if (!deletedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Form deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
