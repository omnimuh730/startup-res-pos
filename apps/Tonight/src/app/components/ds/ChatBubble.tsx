import { type ReactNode } from "react";
import { Check, CheckCheck } from "lucide-react";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  avatar?: string;
  senderName?: string;
}

export interface ChatBubbleProps {
  message: ChatMessage;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  className?: string;
}

export function ChatBubble({
  message,
  showAvatar = true,
  showTimestamp = true,
  className = "",
}: ChatBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2 ${className}`}>
      {!isUser && showAvatar && (
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-auto">
          {message.avatar ? (
            <img src={message.avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-[0.5rem] text-muted-foreground">
              {message.senderName?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && message.senderName && (
          <p className="text-[0.625rem] text-muted-foreground mb-0.5 px-1">{message.senderName}</p>
        )}
        <div
          className={`
            px-3.5 py-2 text-[0.8125rem] leading-relaxed
            ${isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
              : "bg-secondary text-foreground rounded-2xl rounded-bl-md"
            }
          `}
        >
          {message.content}
        </div>
        {showTimestamp && (
          <div className={`flex items-center gap-1 mt-0.5 px-1 ${isUser ? "justify-end" : ""}`}>
            <span className="text-[0.5625rem] text-muted-foreground">{message.timestamp}</span>
            {isUser && message.status && (
              <>
                {message.status === "sent" && <Check className="w-3 h-3 text-muted-foreground" />}
                {message.status === "delivered" && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
                {message.status === "read" && <CheckCheck className="w-3 h-3 text-info" />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Chat Container ─────────────────────────────────────────
export interface ChatContainerProps {
  messages: ChatMessage[];
  className?: string;
}

export function ChatContainer({ messages, className = "" }: ChatContainerProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}

// ── Chat Input ─────────────────────────────────────────────
export interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  value = "",
  onChange,
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  className = "",
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSend?.(value.trim());
    }
  };

  return (
    <div className={`flex items-end gap-2 p-3 border-t border-border ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 px-3.5 py-2.5 text-[0.8125rem] bg-secondary rounded-xl outline-none resize-none max-h-24"
      />
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={() => value.trim() && onSend?.(value.trim())}
        className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-[0.8125rem] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        Send
      </button>
    </div>
  );
}
