import UserModel from "@/src/models/User";
import dbConnect from "@/src/lib/dbConnect";

import{Message} from "@/src/models/User";

export async function POST(request: Request) {
    dbConnect();

    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 },
            );
        }

        // is the user accepting messages?
        if(!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 },
            );
        }

        const newMessage = {
            content,
            createdAt: new Date(),
        };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to send message", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 },
        );
    }
}