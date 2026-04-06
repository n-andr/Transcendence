// move this to the shared folder later!
export type ChatMessage = {
  id: string;
  userId: number;
  username: string;
  text: string;
  timestamp: number;
  isCorrectGuess?: boolean;
  type: "guess" | "system" | "chat" | "presence";
  presenceAction?: "join" | "leave";
};

type ChatMessageProps = {
  message: ChatMessage;
  isOwn?: boolean;
};

function formatTimestamp(ts: number) {
  const minutes = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (minutes === 0) return "now";
  if (minutes === 1) return "1m";
  return `${minutes}m`;
}

export function ChatMessageRow({ message, isOwn }: ChatMessageProps) {
  if (message.type === "system" || message.type === "presence") {
    const fallback = message.presenceAction
      ? `${message.username} ${message.presenceAction}ed the room`
      : message.text;
    return (
      <div className="text-center text-xs text-gray-500 italic">
        {message.text || fallback}
      </div>
    );
  }

  const isCorrect = Boolean(message.isCorrectGuess);

  return (
    <div
      className={`flex items-start gap-2 rounded-md px-2 py-1.5 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`max-w-[75%] min-w-0 ${isOwn ? "text-right" : "text-left"}`}>
        <div className="flex items-center gap-2">
          {!isOwn && (
            <span className="text-xs font-semibold text-gray-700">
              {message.username}
            </span>
          )}
          {isOwn && (
            <span className="text-xs font-semibold text-gray-700 ml-auto">
              You
            </span>
          )}
          <span className="text-[10px] text-gray-400">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div
          className={`mt-0.5 rounded-lg px-2.5 py-1.5 text-sm flex items-center gap-2 flex-wrap ${
            isOwn
              ? "bg-amber-200/60 text-amber-900 border border-amber-200"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <span className={`min-w-0 whitespace-pre-wrap break-words break-all ${isCorrect ? "blur-sm" : ""}`}>
            {message.text}
          </span>
          {isCorrect && (
            <span
            className="text-xs font-bold bg-orange-300 text-white border border-orange-400 px-1.5 py-0.5 rounded-full whitespace-nowrap" >
              Correct!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
