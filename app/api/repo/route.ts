import { NextRequest, NextResponse } from "next/server";
import { generateGithubReadmeFile } from "@/app/config/ai-config";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { repo, languages, topics } = await request.json();

    console.log("Received Data:", { repo, languages, topics });

    if (!repo || !languages || !topics) {
      return NextResponse.json(
        { error: "Required fields are missing in the request" },
        { status: 400 }
      );
    }

    // Generate the README using AI
    const aiResponse = await generateGithubReadmeFile({
      repo,
      languages,
      topics,
    });

    return NextResponse.json({ markdown: aiResponse });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate README" },
      { status: 500 }
    );
  }
}
