# 🦆 GitDuck — Your Snarky Git Companion

> A purpose-built chatbot for Git and GitHub. It's like a rubber duck debugger, except it actually talks back — and has opinions.

**[Live Demo →](https://your-vercel-url.vercel.app)**

---

## What I Built

GitDuck is a chatbot trained specifically on Git and GitHub — commands, workflows, branch strategies, disaster recovery, and best practices. It has a distinct personality: a senior engineer who has seen every Git catastrophe imaginable and isn't afraid to roast you for it, but always with genuine help attached.

## Why This Topic

Git is something every developer uses daily but few master. The official docs are dry. Stack Overflow answers are scattered. I wanted a single place where you could ask "I force-pushed to main, what do I do" and get a real, immediate, opinionated answer — not a list of links.

The topic also gave me clear UI constraints: terminal aesthetic, monospace fonts, code blocks that look good, a persona that feels consistent throughout.

## Design Decisions

**Empty state** — Six suggested prompts cover the most common Git disasters and questions. They're specific (not "ask me anything") to lower the activation energy of a first message.

**Streaming** — Responses stream token by token via SSE so the UI never feels frozen, even for long answers.

**Typography** — JetBrains Mono for all code/chat content (the right font for a terminal-adjacent tool), Syne for display text (gives the header personality without clashing).

**Persona consistency** — The system prompt defines not just knowledge but character: the Duck Scale™, when to roast, when to celebrate, what never to recommend without caveats (`--force` without `--force-with-lease`).

**Error states** — The error message is in-character: _"Something went sideways. Even GitDuck has bad days."_ Small thing, but it keeps the experience coherent.

## Tech Stack

- **Next.js 15** (App Router)
- **Anthropic Claude** via `/api/chat` route (server-side, key never exposed)
- **Streaming** via Server-Sent Events
- **react-markdown + remark-gfm** for rendering code blocks, tables, and lists
- **CSS Modules** — no Tailwind, intentional: more control over the terminal aesthetic
- Deployed on **Vercel**

## Running Locally

```bash
git clone https://github.com/yourusername/gitduck
cd gitduck
npm install

# Add your Anthropic API key
cp .env.local.example .env.local
# Edit .env.local and set GEMINI_API_KEY=AIza...

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

```bash
npx vercel
```

Set `GEMINI_API_KEY` in your Vercel project's Environment Variables.

---

Built for the Thinkly Labs Software Engineering assignment.
