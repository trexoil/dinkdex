import { NextResponse } from "next/server";
import { createLead } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, type, message } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const lead = await createLead({ email, name, type, message });
    return NextResponse.json({ success: true, id: lead.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
