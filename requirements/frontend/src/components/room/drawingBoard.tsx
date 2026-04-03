import { Button } from "../button";
import { Input } from "../input";
import { useEffect, useMemo, useRef, useState } from "react";
import { onGuess, onGuessUpdate, socket } from "../../api/socket";
import { ChatMessageRow, type ChatMessage } from "./chatMessageRow";
import { DrawingCanvas } from "./DrawingCanvas";
import { DrawerPanel } from "./DrawerPanel";
import { useSessionStore } from "../../state/sessionStore";
import { emitCanvasClear, emitCanvasUndo } from "../../api/drawingSocket";
import { WS_EVENTS } from "../../../shared/ws.events";
import type { GuessPayload, GuessUpdatePayload, TurnInfoPayload } from "../../../shared/ws.payloads";

type Props = {
  onGuessCorrect?: (userId: number) => void;
  systemMessages?: ChatMessage[];
  players?: TurnInfoPayload["players"];
};

const MAX_CHAT_MESSAGE_LENGTH = 100;

// changed some small things here, because it improved performance
export default function DrawingBoard({ onGuessCorrect, systemMessages = [], players = [] }: Props) {
	const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const pendingOwnGuessesRef = useRef<string[]>([]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useSessionStore((s) => s.user?.id ?? -1);
  const roomId = useSessionStore((s) => s.roomId);
  const currentUsername = useSessionStore((s) => s.user?.username ?? "You");
  const [color, setColor] = useState<`#${string}`>("#111111"); // this to avoid that VSCode complains about unitiliazed types
  const role = useSessionStore((s) => s.role);
  const isDrawer = role === "drawer";
  const characterCount = text.length;
  const isOverCharacterLimit = characterCount > MAX_CHAT_MESSAGE_LENGTH;
  const canSendMessage =
    text.trim().length > 0 &&
    !isOverCharacterLimit &&
    roomId !== null &&
    currentUserId !== -1;

  const handleColorChange = (next: string) => {
    setColor(next as `#${string}`);
  };

  const sortedMessages = useMemo(
    () => [...systemMessages, ...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages, systemMessages]
  );

  const nicknameByUserId = useMemo(
    () => new Map(players.map((player) => [player.userId, player.nickname])),
    [players]
  );

function send() {
const trimmed = text.trim();
if (!trimmed || roomId === null || currentUserId === -1) return;
if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) return;

  if (!isDrawer) {
    pendingOwnGuessesRef.current.push(trimmed);
  }

  socket.emit(WS_EVENTS.GUESS, {
    guesser_id: currentUserId,
    guess: trimmed,
    room_id: roomId,
  });

	setText("");
	}

  useEffect(() => {
    // Scroll only the chat container to the bottom, not the entire page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [sortedMessages.length]);

  // this makes it possible for the drawer to send their own messages to the chat
  useEffect(() => {
    const handleDrawerChat = (data: GuessPayload) => {
      const messageText = data.guess?.trim();
      if (!messageText) return;

      setMessages((prev) => [
        ...prev,
        {
          id: `chat-${data.guesser_id}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          userId: data.guesser_id,
          username:
            data.guesser_id === currentUserId
              ? currentUsername
              : (nicknameByUserId.get(data.guesser_id) ?? `Player ${data.guesser_id}`),
          text: messageText,
          timestamp: Date.now(),
          type: "chat",
        },
      ]);
    };

    const unsubscribe = onGuess(handleDrawerChat);
    return () => {
      unsubscribe();
    };
  }, [currentUserId, currentUsername, nicknameByUserId]);

  useEffect(() => {
    const handleGuessUpdate = (data: GuessUpdatePayload) => {
      let resolvedText = data.guess ?? "";

      if (data.guesser_id === currentUserId) {
        const firstPending = pendingOwnGuessesRef.current.shift();
        if (data.correct && firstPending) {
          resolvedText = firstPending;
        }
      }

      const messageText = data.correct
        ? (resolvedText || "correct guess")
        : (resolvedText || "");

      if (messageText) {
        setMessages((prev) => [
          ...prev,
          {
            id: `guess-${data.guesser_id}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            userId: data.guesser_id,
            username:
              data.guesser_id === currentUserId
                ? currentUsername
                : (nicknameByUserId.get(data.guesser_id) ?? `Player ${data.guesser_id}`),
            text: messageText,
            timestamp: Date.now(),
            type: "guess",
            isCorrectGuess: data.correct,
          },
        ]);
      }

      if (data.correct) {
        if (onGuessCorrect) {
          onGuessCorrect(data.guesser_id);
        }
      }
    };

    const unsubscribe = onGuessUpdate(handleGuessUpdate);
    return () => {
      unsubscribe();
    };
  }, [currentUserId, currentUsername, nicknameByUserId, onGuessCorrect]);

// const session = useSessionStore();

return (
    <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem] gap-4 flex-1 min-h-0">
      {/* Canvas area */}
  <div className="relative bg-surface border border-gray-400 rounded-lg aspect-[3/2] min-h-[280px] overflow-hidden">
  <DrawingCanvas isDrawer={isDrawer} roomId={roomId ?? -1} drawerId={currentUserId} color={color} />

{isDrawer && (
  <DrawerPanel
  color={color}
  onColorChange={handleColorChange}
  onUndo={emitCanvasUndo}
    onClear={emitCanvasClear}
  />
)}
  </div>


      {/* Chat/Guesses section */}
      <div ref={chatContainerRef} className="w-full lg:w-[18rem] xl:w-[20rem] lg:shrink-0 flex flex-col min-h-0 bg-surface border border-gray-200 rounded-lg p-3">
        <div className="mb-3 flex-1 min-h-0 overflow-y-auto space-y-2">
          {sortedMessages.map((message) => (
            <ChatMessageRow
              key={message.id}
              message={message}
              isOwn={message.userId === currentUserId}
            />
          ))}
          <div ref={scrollAnchorRef} />
        </div>
        <div className="flex gap-2 border-t border-gray-200 pt-3">
          <Input
            placeholder="Type your guess..."
            className="flex-1"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSendMessage) send();
            }}
          />
          <Button variant="primary" onClick={send} disabled={!canSendMessage}>
            Send
          </Button>
        </div>
        <div className="mt-1 text-right text-xs">
          <span className={isOverCharacterLimit ? "text-red-500" : "text-gray-500"}>
            {characterCount}/{MAX_CHAT_MESSAGE_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}
