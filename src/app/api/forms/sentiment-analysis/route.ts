import { NextRequest, NextResponse } from "next/server";
import ResponseModel from "@/model/Response.model";
import { FormModel } from "@/model/Form.model";

export async function GET(req: NextRequest) {
  try {
    console.log("api called")
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const formId = searchParams.get("formId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const query: any = { ownerId: userId, category: "Feedback" };
    if (formId) query._id = formId;

    const feedbackForms = await FormModel.find(query).select("_id");
    if (!feedbackForms.length) {
      return NextResponse.json({ positive: 0, negative: 0, neutral: 0 });
    }

    const responses = await ResponseModel.find({
      formId: { $in: feedbackForms.map((f) => f._id) },
    });

    // Extract and clean text responses
    const textResponses: string[] = [];
    responses.forEach((response) => {
      response.responses.forEach(({ responseValue }) => {
        if (typeof responseValue === "string") {
          textResponses.push(responseValue.trim());
        }
      });
    });

    const cleanedResponses = textResponses
      .filter((r) => isNaN(Number(r)))
      .filter((r, i, arr) => arr.indexOf(r) === i);

    if (!cleanedResponses.length) {
      return NextResponse.json({ positive: 0, negative: 0, neutral: 0 });
    }

    console.log("cleanedResponses:", cleanedResponses)

    // Call FastAPI sentiment analysis endpoint
    const fastApiUrl = "https://sentiment-analysis-model-17oa.onrender.com/api/sentiment";
    const apiResponse = await fetch(fastApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: cleanedResponses }),
    });

    let sentimentData = await apiResponse.json();

    // Ensure all three keys exist
    sentimentData = {
      positive: sentimentData.positive || 0,
      negative: sentimentData.negative || 0,
      neutral: sentimentData.neutral || 0, // Always add neutral = 0
    };

    console.log("sentimentData:", sentimentData)

    const total = sentimentData.positive + sentimentData.negative + sentimentData.neutral || 1; // Avoid div by 0
    const positivePercent = ((sentimentData.positive / total) * 100).toFixed(2) + "%";
    const negativePercent = ((sentimentData.negative / total) * 100).toFixed(2) + "%";
    const neutralPercent = ((sentimentData.neutral / total) * 100).toFixed(2) + "%";

    return NextResponse.json(
      {
        positive: positivePercent,
        negative: negativePercent,
        neutral: neutralPercent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sentiment analysis API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
