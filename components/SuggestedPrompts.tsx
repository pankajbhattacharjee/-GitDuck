"use client";

import styles from "./SuggestedPrompts.module.css";

const PROMPTS = [
  {
    icon: "💥",
    label: "I force-pushed to main",
    prompt: "I accidentally force-pushed to main and overwrote my teammate's commits. How do I fix this without getting fired?",
  },
  {
    icon: "🌿",
    label: "Rebase vs Merge",
    prompt: "What's the actual difference between git rebase and git merge? When should I use each?",
  },
  {
    icon: "🔍",
    label: "Find a deleted file",
    prompt: "I deleted a file 3 commits ago and I need it back. How do I find and recover it?",
  },
  {
    icon: "📝",
    label: "Write better commits",
    prompt: "What does a great git commit message look like? Give me the rules and examples.",
  },
  {
    icon: "🔀",
    label: "Resolve merge conflicts",
    prompt: "I have a nasty merge conflict and I don't understand what I'm looking at. Walk me through resolving it.",
  },
  {
    icon: "🧹",
    label: "Clean up branch history",
    prompt: "My feature branch has 30 messy WIP commits. How do I squash them into something respectable before merging?",
  },
];

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className={styles.grid}>
      {PROMPTS.map((p) => (
        <button
          key={p.label}
          className={styles.chip}
          onClick={() => onSelect(p.prompt)}
          type="button"
        >
          <span className={styles.chipIcon}>{p.icon}</span>
          <span className={styles.chipLabel}>{p.label}</span>
        </button>
      ))}
    </div>
  );
}
