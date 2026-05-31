import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, courtName, courtAddress, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const submission = await createSubmission({ name, email, courtName, courtAddress, message });
    return NextResponse.json({ success: true, id: submission.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
