import { useState, useEffect, useRef } from "react";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { getCategories, askAssistant, getHistory } from "../../api/assistant.api";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getHistory()
      .then((hist) => setMessages(hist))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { _id: `temp-${Date.now()}`, role: "user", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const res = await askAssistant(trimmed);
      setMessages((prev) => [...prev, { _id: res.messageId, role: "assistant", text: res.response, matched: res.matched, suggestedFollowUps: res.suggestedFollowUps }]);
    } catch (err) {
      setMessages((prev) => [...prev, { _id: `err-${Date.now()}`, role: "assistant", text: "Something went wrong reaching the assistant. Try again." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 128px)" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)", marginBottom: 16 }}>
          <Bot size={22} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>AI Career Assistant</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.6 }}>
          Ask about resume tips, interview prep, or role roadmaps. This matches your question against a curated
          knowledge base by keyword — it's not a generative AI model, so it works best with the kinds of
          questions in the prompts below.
        </p>
      </div>

      {/* Quick prompts */}
      {messages.length === 0 && !loadingHistory && categories.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Try asking:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.flatMap((c) => c.examples.slice(0, 1)).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{
                  fontSize: 12.5, fontWeight: 600, color: "var(--brand-700)", background: "#eaf1fd",
                  border: "1px solid #dbe7fb", borderRadius: 999, padding: "8px 14px", cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message list */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, marginBottom: 16, paddingRight: 4 }}>
        {messages.map((m) => (
          <MessageBubble key={m._id} message={m} onFollowUp={send} />
        ))}
        {sending && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 13 }}>
            <Loader2 size={14} className="hf-spin" /> Thinking...
          </div>
        )}
        <div ref={scrollRef} />
      </div>
      <style>{`.hf-spin { animation: hf-spin-anim 0.8s linear infinite; } @keyframes hf-spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 16 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about resumes, interviews, or a career roadmap..."
          style={{
            flex: 1, background: "#f2f4f7", border: "1px solid transparent", borderRadius: 999,
            padding: "12px 18px", fontSize: 13.5, color: "var(--text-primary)", outline: "none", fontFamily: "var(--font-body)",
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", background: "var(--brand-gradient)", border: "none",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            opacity: !input.trim() ? 0.5 : 1, flexShrink: 0,
          }}
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ message, onFollowUp }) {
  const isUser = message.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 10 }}>
      {!isUser && (
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)", flexShrink: 0 }}>
          <Bot size={15} />
        </div>
      )}
      <div style={{ maxWidth: "72%" }}>
        <div
          style={{
            background: isUser ? "var(--brand-gradient)" : "var(--surface)",
            color: isUser ? "#fff" : "var(--text-primary)",
            border: isUser ? "none" : "1px solid var(--border)",
            borderRadius: 16,
            borderTopRightRadius: isUser ? 4 : 16,
            borderTopLeftRadius: isUser ? 16 : 4,
            padding: "12px 16px",
            fontSize: 13.5,
            lineHeight: 1.6,
          }}
        >
          {message.text}
        </div>
        {!isUser && message.suggestedFollowUps?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {message.suggestedFollowUps.map((q) => (
              <button
                key={q}
                onClick={() => onFollowUp(q)}
                style={{ fontSize: 11.5, fontWeight: 600, color: "var(--brand-700)", background: "#eaf1fd", border: "1px solid #dbe7fb", borderRadius: 999, padding: "5px 11px", cursor: "pointer" }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--brand-gradient)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
          <User size={14} />
        </div>
      )}
    </div>
  );
}
