import { useEffect, useState } from "react";
import { useMemo } from "react";
import Clock from "./clock";
import type { PlayerDto } from "../../../shared/player.dto";
import { emitAddFriend, emitRemoveFriend, friendList, socket } from "../../api/socket";
import type { FriendListPayload, AddFriendPayload, RemoveFriendPayload } from "../../../shared/ws.payloads";
import { useSessionStore } from "../../state/sessionStore";

interface ParticipantsListProps {
  highlightedPlayerId?: number | null;
  players: PlayerDto[];
  drawerId?: number;
  clockRemainingMs?: number;
  clockRunning?: boolean;
}

export default function ParticipantsList({ highlightedPlayerId, players, drawerId, clockRemainingMs = 0, clockRunning = false }: ParticipantsListProps) {

  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [friends, setFriends] = useState<string[]>([]);
  const roomId = useSessionStore((state) => state.roomId);
  const myUserId = useSessionStore((state) => state.user?.id);

  useEffect(() => {
    if (highlightedPlayerId !== null && highlightedPlayerId !== undefined) {
      setActiveHighlight(highlightedPlayerId);
      const timer = setTimeout(() => setActiveHighlight(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPlayerId]);

  // Listen for server updates to friend list
  useEffect(() => {
    const onFriendList = (payload: FriendListPayload) => {
      if (payload.room_id !== roomId) return;
      setFriends(payload.friends);
	  console.log("[wss] received friend list update:", payload.friends);
    };

    const off = friendList(onFriendList);
    return () => {
      off();
    };
  }, [roomId]);

  const friendSet = useMemo(() => new Set(friends), [friends]);
  function toggleFriend(targetNickname: string) {
    if (!roomId || !myUserId) return; // Guard: ensure roomId and myUserId exist
    
    const isFriend = friendSet.has(targetNickname);

    if (isFriend) {
      const payload: RemoveFriendPayload = {
        room_id: roomId,
        removeFriend: targetNickname,
        player: myUserId,
      };
      emitRemoveFriend(payload);

      // Optional optimistic UI:
      setFriends((prev) => prev.filter((n) => n !== targetNickname));
    } else {
      const payload: AddFriendPayload = {
        room_id: roomId,
        newFriend: targetNickname,
        player: myUserId,
      };
      emitAddFriend(payload);

      // Optional optimistic UI:
      setFriends((prev) => (prev.includes(targetNickname) ? prev : [...prev, targetNickname]));
    }
  }

  return (
    <div className="bg-surface rounded-lg p-3 border border-gray-200 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-textPrimary">
        Players ({players.length})
      </h2>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {players.map((participant) => {
		  const isFriend = friendSet.has(participant.nickname);
          const isMe = participant.userId === myUserId;
		 return (
		  
          <div
            key={participant.userId}
            className={`group px-2 py-1.5 rounded-md transition-colors duration-300 ${
              activeHighlight === participant.userId
                ? "bg-amber-200/60"
                : "bg-transparent"
            }`}
          >
            <div className="flex justify-between items-center">
				<div className="flex items-start gap-2">
					{/* Star marker */}
					{isFriend && (
						<span className="pt-1 text-sm" title="Friend">⭐</span>
					)}
					<div>
						<div
						className={`text-xl font-semibold transition-colors ${
							activeHighlight === participant.userId
							? "text-amber-900"
							: "text-textPrimary"
						}`}
						>
						{participant.nickname}
						</div>
						<div className="text-xs text-textMuted">
						{drawerId === participant.userId ? "Drawer" : "Guesser"}
						</div>
              	    </div>
				</div>

				<div className="flex items-center gap-3">
                  {/* Add/Remove button (hover) */}
                  {!isMe && (
                    <button
                      type="button"
                      onClick={() => toggleFriend(participant.nickname)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                      title={isFriend ? "Remove friend" : "Add friend"}
                    >
                      {isFriend ? "×" : "+"}
                    </button>
                  )}

					<div className="text-right">
						<div className="text-base font-semibold text-textPrimary">
						{participant.score}
						</div>
						<div className="text-[11px] text-textMuted">pts</div>
					</div>
				</div>
            </div>
          </div>
		 );
		})}
      </div>
      
      {/* Clock below participants */}
      <div className="mt-auto pt-3 flex justify-center">
        <Clock remainingMs={clockRemainingMs} isRunning={clockRunning} />
      </div>
    </div>
  );
}