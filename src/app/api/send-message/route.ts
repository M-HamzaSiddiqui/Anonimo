import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";
import { pusher } from "@/lib/pusherClient";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if(!user) {
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            {status: 404}
        )
    }
    // is user accepting the messages

    if(!user.isAcceptingMessage) {
        return Response.json(
            {
                success: false,
                message: "User is not accepting messages currently."
            },
            {status: 403}
        )
    }

    const newMessage = {
        content, 
        createdAt: new Date()
    }

    // after successful validation trigger the event
    await pusher.trigger("message-channel", "send-message", newMessage)

    user.messages.push(newMessage as Message)
    await user.save()

    return Response.json( 
        {
            success: true,
            message: "Message send successfully"
        },
        {status: 200}
    )
    
  } catch (error) {
    console.log("Error adding messages", error)
    return Response.json(
        {
            success: false,
            message: "Internal Server Error"
        },
        {status: 500}
    )
  }
}
