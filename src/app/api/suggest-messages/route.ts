import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "nodejs";

const fallbackPrompts = [
  "What's a piece of advice you'll never forget?||If you could travel anywhere tomorrow, where would you go?||What's a skill you've always wanted to learn?",
  "What's a movie or book that changed your perspective?||If you could master any musical instrument overnight, which one?||What's a small win you had recently?",
  "What's the best compliment you've ever received?||What is something that always brings a smile to your face?||What's a dream project you'd love to build?",
];

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: google("gemini-3.8-flash"),
      prompt,
      maxOutputTokens: 1000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Gemini suggestion error, falling back to curated prompts:", error);
    // Return curated prompts seamlessly if Gemini encounters temporary demand spikes
    const randomIndex = Math.floor(Math.random() * fallbackPrompts.length);
    const fallback = fallbackPrompts[randomIndex];
    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
