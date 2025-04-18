import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FormModel } from "@/model/Form.model";
import ResponseModel from "@/model/Response.model";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId

        if (!userId) {
            return NextResponse.json({ error: "User ID missing" }, { status: 400 });
          }

        await dbConnect()

         // Fetch total forms created by user
        const totalForms = await FormModel.countDocuments({ownerId: userId})


        //Fetch all form IDs of the user
        const userForms = await FormModel.find({ownerId: userId}, "_id")

        console.log("userforms", userForms)

        const formIds = userForms.map((form) => form._id)

        let totalResponses = 0
        let mostActiveForm = null

        if(formIds.length > 0) {
            // Fetch total responses received for the user's forms
            totalResponses = await ResponseModel.countDocuments({formId: {$in: formIds}})
        }

        const mostActive = await ResponseModel.aggregate([
            {$match: {formId: {$in: formIds}}},
            {$group: {_id: "$formId", count: {$sum: 1}}},
            {$sort: {count: -1}},
            {$limit: 1}
        ])

        if (mostActive.length > 0) {
            const formDetails = await FormModel.findById(mostActive[0]._id, "title")
            mostActiveForm = {
                id: mostActive[0]._id,
                title: formDetails?.title || "Untitled Form",
                responseCount: mostActive[0].count
            }
        }

        return NextResponse.json({
            success: true,
            totalForms,
            totalResponses,
            mostActiveForm
        }, {status: 201})


    } catch (error) {
        console.error("Dashboard API metrics error", error)
        return NextResponse.json({success: false, message:  "Failed to fetch dashboard metrics"}, {status: 500})
    }
}