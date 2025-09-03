import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("trading_journal");
    const trades = await db.collection("trades").find({}).toArray();
    return NextResponse.json(trades);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("trading_journal");
    const result = await db.collection("trades").insertOne(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "Failed to add trade", e }, { status: 500 });
  }
}
