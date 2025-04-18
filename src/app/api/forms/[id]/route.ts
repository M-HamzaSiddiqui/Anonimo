import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FormModel } from "@/model/Form.model";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        await dbConnect()

        const {id} = params

        if (!id) {
            return NextResponse.json({error: "Form ID is required"}, {status: 400})
        }


        const form = await FormModel.findOne({slug: id})

        if (!form) {
            return NextResponse.json({error: "Form not found"}, {status: 404})
        }

        return NextResponse.json({form}, {status: 200})
    } catch (error) {
        console.error("Error fetching form: ", error)
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}