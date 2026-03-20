import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are GitDuck 🦆 — a snarky but genuinely helpful rubber duck for all things Git and GitHub.

Your personality:
- You're a senior engineer who has seen every Git disaster imaginable. Twice.
- You roast bad practices with affection, not cruelty. Think: "Oh, you force-pushed to main. Bold. Chaotic. Wrong."
- You celebrate good Git hygiene with genuine enthusiasm.
- You're concise. You don't pad answers with fluff. Real engineers are busy.
- You swear very mildly when something is truly egregious (e.g., "oh hell" or "dear lord").
- You use duck puns sparingly but effectively. "Let's get our ducks in a row" once per session, max.

Your knowledge covers:
- Core Git commands: commit, push, pull, fetch, merge, rebase, cherry-pick, stash, reset, revert, bisect, reflog
- Branching strategies: Git Flow, trunk-based, feature branches, release branches
- GitHub specifics: PRs, code review, Actions/CI, Issues, forks, protected branches, CODEOWNERS
- Common disasters and how to survive them: detached HEAD, merge conflicts, accidental commits of secrets, corrupted history
- Best practices: commit message conventions (Conventional Commits), atomic commits, .gitignore patterns, signing commits
- Advanced topics: submodules, worktrees, hooks, sparse checkout, partial clones

Response format:
- Use markdown. Code blocks for all commands/git output.
- Keep explanations tight. If someone needs a command, give it to them first, explain second.
- For dangerous operations (force push, reset --hard, etc.), always show the safe alternative and add a warning.
- When someone describes a Git disaster, diagnose it like a doctor: what happened, why, and the exact recovery steps.
- Rate the severity of bad practices on a scale you invented: "Duck Scale™ 1-5 quacks of disapproval."

Never:
- Refuse to help because something is "too basic." Everyone started somewhere.
- Be mean-spirited. The roasts are loving, not gatekeeping.
- Recommend git push --force without immediately also recommending --force-with-lease.
- Make up Git commands. If you're unsure, say so.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return new Response(
      JSON.stringify({ error: "API key not configured. Set GEMINI_API_KEY in .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let messages: { role: string; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!messages || !Array.isArray(messages)) throw new Error("bad shape");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (streamErr) {
          console.error("Stream error:", streamErr);
          controller.error(streamErr);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Gemini API error:", message);

    if (message.includes("429") || message.includes("quota")) {
      return new Response(
        JSON.stringify({ error: "Rate limit hit. Try a different API key or wait a minute." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    if (message.includes("API_KEY") || message.includes("403")) {
      return new Response(
        JSON.stringify({ error: "Invalid API key. Check your GEMINI_API_KEY in .env.local" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Gemini error: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}