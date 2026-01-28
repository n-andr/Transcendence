import { createContext } from "react";
import type { RoomState } from "./room.types";

export const RoomContext = createContext<RoomState | undefined>(undefined);
