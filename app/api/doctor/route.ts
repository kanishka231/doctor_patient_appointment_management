import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectdb";
import User from "@/models/User";
export async function GET(req: NextRequest) {
  try {
    await connectDB();  // Ensure this resolves with a valid DB connection
    let doctors = await User.find({ role:"Doctor" });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}