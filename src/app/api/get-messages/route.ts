import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 },
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const messagesResult = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      {
        $project: {
          messages: {
            $filter: {
              input: "$messages",
              as: "m",
              cond: { $ne: ["$$m", null] },
            },
          },
        },
      },
    ]);

    if (!messagesResult || messagesResult.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, messages: messagesResult[0].messages },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to retrieve messages", error);
    return Response.json(
      { success: false, message: "Failed to retrieve messages" },
      { status: 500 },
    );
  }
}