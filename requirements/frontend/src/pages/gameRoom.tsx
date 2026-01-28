import { useParams } from "react-router-dom";
import { RoomProvider } from "../features/room/roomProvider";
import DrawingBoard from "../components/room/drawingBoard";
import ParticipantsList from "../components/room/participantsList";
import PromptBox from "../components/room/promptBox";

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Room ID is required</p>
      </div>
    );
  }

  return (
    <RoomProvider roomId={roomId}>
      <div className="bg-gray-50 p-4 min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Main game area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left sidebar - Participants */}
            <div className="lg:col-span-1">
              <ParticipantsList />
            </div>

            {/* Center - Drawing board with overlaid prompt and clock */}
            <div className="lg:col-span-3 relative flex flex-col max-h-[calc(100vh-200px)]">
              {/* Prompt overlaid on top */}
              <div className="absolute top-8 left-8 z-10 max-w-sm">
                <PromptBox />
              </div>
              
              <DrawingBoard />
            </div>
          </div>
        </div>
      </div>
    </RoomProvider>
  );
}
