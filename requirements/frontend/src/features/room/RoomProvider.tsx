import { useState } from "react";
import type { ReactNode } from "react";
import { RoomContext } from "./RoomContext";
import { mockRoomState } from "./room.mock";
import type { RoomState } from "./room.types";

interface RoomProviderProps {
  roomId: string;
  children: ReactNode;
}

export function RoomProvider({ roomId, children }: RoomProviderProps) {
  const [room, setRoom] = useState<RoomState>({
    ...mockRoomState,
    roomId,
  });

  return (
    <RoomContext.Provider value={room}>
      {children}
    </RoomContext.Provider>
  );
}