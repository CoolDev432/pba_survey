import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
    const age = url.searchParams.get("age");
    const answersRaw = url.searchParams.get("answers");
    const answers = answersRaw ? JSON.parse(decodeURIComponent(answersRaw)) : null;

    const { data, error } = await supabase
      .from("entries")
      .insert([{ name, age, answers }])
      .select(); // returns the inserted row

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Survey saved successfully",
      saved: data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error saving survey", error: error.message },
      { status: 500 }
    );
  }
}
