"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/app/page";
import styles from "./ChatMessage.module.css";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`${styles.row} ${isUser ? styles.userRow : styles.assistantRow} animate-in`}
    >
      {!isUser && (
        <div className={styles.avatar} aria-hidden="true">
          🦆
        </div>
      )}

      <div
        className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}
      >
        {isUser ? (
          <p className={styles.userText}>{message.content}</p>
        ) : (
          <div className="md-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || "▋"}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className={`${styles.avatar} ${styles.userAvatar}`} aria-hidden="true">
          ~
        </div>
      )}
    </div>
  );
}
