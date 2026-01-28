import { useParams } from "react-router-dom";
import { RoomProvider } from "../features/room/roomProvider";
import DrawingBoard from "../components/room/drawingBoard";
import ParticipantsList from "../components/room/participantsList";
import PromptBox from "../components/room/promptBox";
import Clock from "../components/room/clock";

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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Prompt and timer in one row */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 max-w-sm">
              <PromptBox />
            </div>
            <div className="flex items-center">
              <Clock />
            </div>
          </div>

          {/* Main game area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left sidebar - Participants */}
            <div className="lg:col-span-1">
              <ParticipantsList />
            </div>

            {/* Center - Drawing board */}
            <div className="lg:col-span-3">
              <DrawingBoard />
            </div>
          </div>
        </div>
      </div>
    </RoomProvider>
  );
}
