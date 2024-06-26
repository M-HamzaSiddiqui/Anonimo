import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

const verifyQuerySchema = z.object({
  code: verifySchema,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    console.log(code)
    const queryParam = {
      code:{
        code
      }
    };
    const result = verifyQuerySchema.safeParse(queryParam);
    console.log(result)

    if (!result.success) {
      const codeErrors = result.error.format().code?._errors || [];
      console.log(codeErrors)
      return Response.json(
        {
          success: false,
          message:
            codeErrors?.length > 0 ? codeErrors.join(", ") : "Invalid code",
        },
        { status: 400 }
      );
    }

    console.log(result.data.code)
    const user = await UserModel.findOne({username})
    console.log(username)
    
    if(!user) {
        return Response.json({
            success: false,
            message: "User not found"
        }, {status: 500})
    }

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if(isCodeValid && isCodeNotExpired) {
        user.isVerified = true
        await user.save()
        return Response.json(
            {
                success: true,
                message: "Account verified successfully"
            },
            {status: 200}
        )
    } else if(!isCodeNotExpired) {
        return Response.json(
            {
                success: false,
                message: "Verification has expired, Please signup again to get a new code"
            },
            {status: 400}
        )
    } else {
        return Response.json(
            {
                success: false,
                message: "Incorrect verification code"
            }, 
            {status: 400}
        )
    }

  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
