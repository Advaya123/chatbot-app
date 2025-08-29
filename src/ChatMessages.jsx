import React from "react";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message, sender }) {
  const isUser = sender === "user";

  return (
    <div
      className={`max-w-xl px-4 py-2 rounded-lg ${
        isUser
          ? "self-end bg-blue-600 text-white"
          : "self-start bg-gray-800 text-gray-100"
      }`}
    >
      {/* Render text as Markdown */}
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  );
}
