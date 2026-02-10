import type { ReactNode } from "react";
import ParticipantsList from "../components/room/participantsList";

interface RoomLayoutProps {
  children: ReactNode;
}

export function RoomLayout({ children }: RoomLayoutProps) {
  return (
    <div className="bg-gray-50 p-4 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left sidebar - Participants */}
          <div className="lg:col-span-1">
            <ParticipantsList />
          </div>

          {/* Center - Main content area */}
          <div className="lg:col-span-3 relative flex flex-col max-h-[calc(100vh-200px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
