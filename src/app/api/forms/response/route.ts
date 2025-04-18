import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ResponseModel from "@/model/Response.model";
import { FormModel } from "@/model/Form.model";

export async function POST(req: NextRequest) {
    try {
        await dbConnect()

        const {formId, responses} = await req.json()

        if (!formId || !responses || !Array.isArray(responses)) {
            return NextResponse.json({error: "Invalid Request Data"}, {status: 400})
        }

        const formExists = await FormModel.findById(formId)

        if(!formExists) {
            return NextResponse.json({error: "Form not found"}, {status: 404})
        }

        const newResponse = await ResponseModel.create({formId, responses})

        return NextResponse.json(
            {message: "Response Submitted Successfully", response: newResponse},
            {status: 201}
        )
    } catch (error) {
        console.error("Error saving response", error)
        return NextResponse.json(
            {error: "Internal Server error"},
            {status: 500}
        )
    }
}