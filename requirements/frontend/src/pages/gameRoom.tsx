// import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
// import { RoomProvider } from "../features/room/RoomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";
import Lobby from "../components/room/lobby";
import type { TurnInfoPayload } from "../../shared/ws.payloads";
import { socket, joinRoom, onTurnInfo, onRoomFull, onResults, onStartGame } from "../api/socket";
import { useSessionStore } from "../state/sessionStore";
import starImage from "../assets/star.png";

export default function GamePage() {
  // safety function to remove duplicate players from the list
  const dedupePlayers = (players: TurnInfoPayload["players"]) =>
    players.filter((player, index, list) =>
      list.findIndex((candidate) => candidate.userId === player.userId) === index
    );
  
  // 1. get userId from storage
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);
  const userId = user?.id; // use user id from storage
  if (!userId) {
    return <div>No user found</div>; // handle an error
  }

  const [wsState, setWsState] = useState<"connecting" | "waiting" | "playing" | "full" | "finished" | "error">("connecting");  
  const [members, setMembers] = useState<TurnInfoPayload["players"]>([]);
  const [round, setRound] = useState<number>(0);
  const [turn, setTurn] = useState<number>(0);
  const [drawerId, setDrawerId] = useState<number>(-1);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  // const [room_id, setRoomId] = useState<number>(-1);
  const [recentlyCorrectGuesser, setRecentlyCorrectGuesser] = useState<number | null>(null);
  const [showWaitingLobby, setShowWaitingLobby] = useState(false);
  const [startCountdown, setStartCountdown] = useState<number | null>(null);
  const prevWsStateRef = useRef<typeof wsState>("connecting");

  useEffect(() => {
    let unsubTurnInfo = () => {};
    let unsubRoomFull = () => {};
    let unsubStartGame = () => {};
    let unsubResults = () => {};
    let connectTimeout: number | undefined;

    const clearConnectTimeout = () => {
      if (connectTimeout) {
        window.clearTimeout(connectTimeout);
        connectTimeout = undefined;
      }
    };

    (async () => {
      try {
        setWsState("connecting");

        connectTimeout = window.setTimeout(() => {
          console.log("[ws] connect timeout -> clearing stale session");
          setWsState("error");
          socket.disconnect();
          logout();
        }, 8000);

        // 2. subscribe to BE pushes before joinRoom so we don't miss the first turnInfo event
        unsubTurnInfo = onTurnInfo((payload) => {
          console.log("[ws] turnInfo:", payload);
          clearConnectTimeout();

          if (payload.room_id === -1) {
            setWsState("full");
            return;
          }

          setMembers(dedupePlayers(payload.players));
          setRound(payload.round);
          setTurn(payload.turn);
          setDrawerId(payload.drawer);
          setCurrentWord(payload.word);

          //round/turn 0 means waiting
          setWsState(payload.round === 0 ? "waiting" : "playing");
        });

        unsubStartGame = onStartGame((payload) => {
          console.log("[ws] start_game:", payload);
          clearConnectTimeout();
          setMembers(dedupePlayers(payload.members));
          setRound(payload.round);
          setTurn(payload.turn);
          setWsState("playing");
        });

        unsubRoomFull = onRoomFull(() => {
          console.log("[ws] room full");
          clearConnectTimeout();
          setWsState("full");
        });

        unsubResults = onResults((payload) => {
          console.log("[ws] results:", payload);
          clearConnectTimeout();
          if (payload.final) {
            setWsState("finished");
          }
        });

        // 3. handle joinRoom
        await joinRoom(userId);
        console.log("[gameRoom] joinRoom successful");
      } catch (e) {
        console.error(e);
        clearConnectTimeout();
        setWsState("error");
      }
    })();

    return () => {
      clearConnectTimeout();
      unsubTurnInfo();
      unsubRoomFull();
      unsubStartGame();
      unsubResults();
      socket.disconnect();
    };
  }, [userId, logout]);

  // timer which makes sure the waiting panel disappears after three seconds
  useEffect(() => {
    let waitingTimer: number | undefined;

    if (wsState === "waiting") {
      setShowWaitingLobby(true);
      waitingTimer = window.setTimeout(() => {
        setShowWaitingLobby(false);
      }, 3000);
    }

    return () => {
      if (waitingTimer) {
        window.clearTimeout(waitingTimer);
      }
    };
  }, [wsState]);

  // countdown before play 
  useEffect(() => {
    let countdownInterval: number | undefined;
    const prevState = prevWsStateRef.current;

    if (wsState === "playing" && prevState !== "playing") {
      setStartCountdown(3);
      countdownInterval = window.setInterval(() => {
        setStartCountdown((value) => {
          if (value === null) return null;
          if (value <= 1) {
            if (countdownInterval) {
              window.clearInterval(countdownInterval);
            }
            return null;
          }
          return value - 1;
        });
      }, 1000);
    }

    if (wsState !== "playing") {
      setStartCountdown(null);
    }

    prevWsStateRef.current = wsState;

    return () => {
      if (countdownInterval) {
        window.clearInterval(countdownInterval);
      }
    };
  }, [wsState]);

  return (
    <RoomLayout
      highlightedPlayerId={recentlyCorrectGuesser}
      players={members}
      drawerId={drawerId}
    >

		{/* Debugging stuff: feel free to delete or change */}
		<div className="absolute top-50 left-50 z-10 max-w-sm bg-white/90 rounded p-3 text-xs space-y-2">
          <div className="font-semibold">Debugging information:</div>
          <div>wsState: {wsState}</div>
          <div>round: {round} turn: {turn}</div>
          <div>players: {members.length}</div>
		  <div>whoIam: id:{userId} name:{user?.username} </div>
          </div>

    {wsState === "connecting" && (
      <Lobby 
        title="Connecting..."
        message="Connecting to the game room..."
      />
    )}

    {wsState === "waiting" && showWaitingLobby && (
      <Lobby 
        title="Waiting for Players"
        message="Not enough players in room. For now, practice your drawing!"
      />
    )}

    {wsState === "full" && (
      <Lobby 
        title="Room Full"
        message="Room 2 is under construction. Please wait for a spot in Room 1 to become available."
      />
    )}

    {wsState === "finished" && (
      <Lobby 
        title="Game Finished!"
        message="Thanks for playing!" // change to rematch
        icon={starImage}
      />
    )}

    {wsState === "error" && (
      <Lobby 
        title="Connection Error"
        message="Unable to connect to the game. Please refresh the page."
      />
    )}

      {wsState === "waiting" && (
        <DrawingBoard />
      )}

      {wsState === "playing" && (
        <>
          {drawerId === userId && (
            <div className="absolute top-8 left-8 z-10 max-w-sm">
              <PromptBox prompt={currentWord} />
            </div>
          )}
          <DrawingBoard onGuessCorrect={setRecentlyCorrectGuesser} />
        </>
      )}

      {wsState === "playing" && startCountdown !== null && (
        <Lobby title="Get Ready" message={`Game will start in: ${startCountdown}`} />
      )}
    </RoomLayout>
  );
}