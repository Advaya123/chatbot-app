import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function MainComponent({ darkMode, messages, setMessages }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setPrompt("");

    try {
      const assistantMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      const res = await fetch(`${API_BASE}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partial = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = JSON.parse(line.replace("data: ", ""));

          if (data.token) {
            partial += data.token;
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].content = partial;
              return newMessages;
            });
          }
          if (data.done) {
            setLoading(false);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Streaming error, please try again." },
      ]);
      setLoading(false);
    }
  };

  const handleDeleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 chat-container">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="relative group">
            <div
              className={`prose prose-sm max-w-none p-4 rounded-2xl shadow-md transition relative
                ${msg.role === "user" ? "user-bubble ml-auto" : "assistant-bubble"}`}
            >
              {/* Edit user message */}
              {msg.role === "user" && editingIndex === index ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newMessage = e.target.elements[0].value; // textarea value
                    setEditingIndex(null);

                    // Replace old user message
                    setMessages((prev) => {
                      const updated = [...prev];
                      updated[index] = { role: "user", content: newMessage };
                      return updated;
                    });

                    // Immediately send to backend
                    (async () => {
                      const res = await fetch(`${API_BASE}/api/chat/stream`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: newMessage }),
                      });

                      if (!res.ok) {
                        setMessages((prev) => [
                          ...prev,
                          { role: "assistant", content: "⚠️ Resend failed, please try again." },
                        ]);
                        return;
                      }

                      const reader = res.body.getReader();
                      const decoder = new TextDecoder();
                      let partial = "";

                      // Add new assistant bubble
                      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

                      while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split("\n\n");

                        for (const line of lines) {
                          if (!line.startsWith("data:")) continue;
                          const data = JSON.parse(line.replace("data: ", ""));

                          if (data.token) {
                            partial += data.token;
                            setMessages((prev) => {
                              const updated = [...prev];
                              updated[updated.length - 1].content = partial;
                              return updated;
                            });
                          }
                        }
                      }
                    })();
                  }}
                >
                  <textarea
                    className="w-full p-2 bg-gray-200 rounded text-black"
                    defaultValue={msg.content}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-green-600 text-black rounded hover:bg-green-700"
                    >
                      🔄 Resend
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="px-3 py-1 bg-red-400 text-black rounded hover:bg-red-500"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="relative group/code">
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                String(children).replace(/\n$/, "")
                              )
                            }
                            className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover/code:opacity-100 transition"
                          >
                            Copy
                          </button>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-2"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="inline-code" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}

              {/* Actions: edit (user) + delete (all) */}
              <div className="absolute -top-3 right-1 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                {msg.role === "user" && (
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="text-xs px-2 py-0.5 bg-gray-200 rounded"
                  >
                    ✏️
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMessage(index)}
                  className="text-xs px-2 py-0.5 bg-red-500 text-white rounded"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="assistant-bubble p-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 dot"></div>
              <div className="w-2 h-2 dot delay-150"></div>
              <div className="w-2 h-2 dot delay-300"></div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-6 input-bar">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto flex items-center rounded-lg p-2 input-form"
        >
          <textarea
            className="w-full p-2 bg-transparent focus:outline-none resize-none input-text"
            placeholder="Enter your prompt here..."
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !loading) {
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 send-btn"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}



