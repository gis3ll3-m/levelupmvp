import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://zenquotes.io/api/random");
        const data = await res.json();

        return NextResponse.json({
            quote: data[0].q,
            author: data[0].a
        });

    } catch (err) {
        return NextResponse.json(
            { quote: "Keep going. You're doing fine.", author: "System" },
            { status: 500 }
        );
    }
}