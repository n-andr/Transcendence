import { Button } from "../button";
import { Input } from "../input";
import { useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../../api/socket";
import { ChatMessageRow, type ChatMessage } from "./chatMessageRow";
import { mockMessages } from "./chat.mock";
// import SvgBoard from "../../features/drawing/SvgBoard";
import DrawerPanel from "./DrawerPanel";
import GuesserPanel from "./GuesserPanel";
import { useSessionStore } from "../../state/sessionStore";

type Props = {
  onGuessCorrect?: (userId: number) => void;
};


//we nned to rename it or bring chat into an separate component
export default function DrawingBoard({ onGuessCorrect }: Props) {
	const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useSessionStore((s: any) => s.userId)
  const roomId = useSessionStore((s:any) => s.roomId)

  const [color, setColor] = useState("#111111");
  const role = useSessionStore((s:any) => s.role);

  const isDrawer = role === "drawer"; //get role from storage, update storage from socket

  //const isDrawer = true; 

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages]
  );

  function send() {
		const trimmed = text.trim();
		if (!trimmed) return;
		if (trimmed.length > 100) return;

		// input-only: just emit, no chat rendering yet
		// socket.emit("chat:send", { roomId, text: trimmed });
		// console.log("[ws] chat:send", { roomId, text: trimmed });


		// Input-only test: server logs it and replies with "youAre"
    socket.emit("whoAmI", { text: trimmed });

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        userId: currentUserId,
        username: "You",
        text: trimmed,
        timestamp: Date.now(),
        type: "chat",
      },
    ]);
		setText("");
	}

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  useEffect(() => {
    const handleGuessUpdate = (data: { guesser: { Nickname: string; User_ID: number }; correct: boolean; Score: number; guess: string | null }) => {
      if (data.correct) {
        // Notify parent component to highlight the player
        if (onGuessCorrect) {
          onGuessCorrect(data.guesser.User_ID);
        }
      }
    };

    socket.on("guess_update", handleGuessUpdate);
    return () => {
      socket.off("guess_update", handleGuessUpdate);
    };
  }, [onGuessCorrect]);

  const session = useSessionStore();
	console.log(session);
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { clientWidth, clientHeight } = container;
      setCanvasSize({
        width: Math.max(1, clientWidth),
        height: Math.max(1, clientHeight),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Canvas area */}
      <div className="relative bg-surface border border-gray-400 rounded-lg flex-1 min-h-[280px] lg:min-h-0">
		{/* drawing tools panel */}
        {/* {isDrawer ? <DrawerPanel />} */}
		<DrawingCanvas isDrawer={isDrawer} color={color} />

		{isDrawer && (
			<DrawerPanel
			color={color}
			onColorChange={setColor}
			onUndo={() => socket.emit("canvas:undo")}
			onClear={() => socket.emit("canvas:clear")}
			/>
		)}
      </div>


      {/* Chat/Guesses section */}
      <div className="w-full lg:w-64 xl:w-72 flex flex-col min-h-0 bg-surface border border-gray-200 rounded-lg p-3">
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
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <Button variant="primary" onClick={send}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}