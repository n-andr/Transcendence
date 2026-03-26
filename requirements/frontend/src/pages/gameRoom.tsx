// import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { RoomProvider } from "../features/room/RoomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";
import Lobby from "../components/room/lobby";
import type { TurnInfoPayload } from "../../shared/ws.payloads";
import { socket, joinRoom, onTurnInfo, onRoomFull, onResults, onStartGame } from "../api/socket";
import { useSessionStore } from "../state/sessionStore";
import rocketImage from "../assets/rocket.png";
import beeImage from "../assets/bee.png";
import cloudImage from "../assets/cloud.png";
import type { ChatMessage } from "../components/room/chatMessageRow";

type RoomPlayer = TurnInfoPayload["players"][number];

type TurnSummary = {
  solution: string;
  correctGuessersText: string;
  isRoundEnd: boolean;
  roundWinnerText: string;
  countdown: number;
};

function getJoinedAndLeftPlayers(previousMembers: RoomPlayer[], currentMembers: RoomPlayer[]) {
  const previousIds = new Set(previousMembers.map((member) => member.userId));
  const currentIds = new Set(currentMembers.map((member) => member.userId));

  const joined = currentMembers.filter((member) => !previousIds.has(member.userId));
  const left = previousMembers.filter((member) => !currentIds.has(member.userId));

  return { joined, left };
}

function createPresenceMessages(joined: RoomPlayer[], left: RoomPlayer[]): ChatMessage[] {
  if (joined.length === 0 && left.length === 0) {
    return [];
  }

  const timestamp = Date.now();
  const joinMessages: ChatMessage[] = joined.map((member, index) => ({
    id: `presence-join-${member.userId}-${timestamp}-${index}`,
    userId: member.userId,
    username: member.nickname,
    text: `${member.nickname} joined the room`,
    timestamp: timestamp + index,
    type: "presence",
    presenceAction: "join",
  }));

  const leaveMessages: ChatMessage[] = left.map((member, index) => ({
    id: `presence-leave-${member.userId}-${timestamp}-${index}`,
    userId: member.userId,
    username: member.nickname,
    text: `${member.nickname} left the room`,
    timestamp: timestamp + joinMessages.length + index,
    type: "presence",
    presenceAction: "leave",
  }));

  return [...joinMessages, ...leaveMessages];
}

function formatNames(names: string[]): string {
  if (names.length === 0) return "No one";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export default function GamePage() {
  const navigate = useNavigate();
  // safety function to remove duplicate players from the list
  const dedupePlayers = (players: TurnInfoPayload["players"]) =>
    players.filter((player, index, list) =>
      list.findIndex((candidate) => candidate.userId === player.userId) === index
    );
  
  // 1. get userId from storage
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);
  const clearRoom = useSessionStore((s) => s.clearRoom);
  const userId = user?.id; // use user id from storage
  if (!userId) {
    return <div>No user found</div>; // handle an error
  }

  const [wsState, setWsState] = useState<"connecting" | "waiting" | "playing" | "full" | "finished" | "error">("connecting");  
  const [members, setMembers] = useState<TurnInfoPayload["players"]>([]);
  const [drawerId, setDrawerId] = useState<number>(-1);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentWordLength, setCurrentWordLength] = useState<number>(0);
  // const [room_id, setRoomId] = useState<number>(-1);
  const [recentlyCorrectGuesser, setRecentlyCorrectGuesser] = useState<number | null>(null);
  const [startCountdown, setStartCountdown] = useState<number | null>(null);
  const [systemMessages, setSystemMessages] = useState<ChatMessage[]>([]);
  const [clockRemainingMs, setClockRemainingMs] = useState<number>(0);
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [turnSummary, setTurnSummary] = useState<TurnSummary | null>(null);
  const prevWsStateRef = useRef<typeof wsState>("connecting");
  const prevMembersRef = useRef<TurnInfoPayload["players"]>([]);
  const membersInitializedRef = useRef(false);
  const turnRef = useRef<number>(0);
  const roundRef = useRef<number>(0);
  const membersRef = useRef<TurnInfoPayload["players"]>([]);
  const correctGuesserIdsRef = useRef<Set<number>>(new Set());

  const handleGuessCorrect = (guesserId: number) => {
    correctGuesserIdsRef.current.add(guesserId);
    setRecentlyCorrectGuesser(guesserId);
  };

  useEffect(() => {
    if (!membersInitializedRef.current) {
      prevMembersRef.current = members;
      membersInitializedRef.current = true;
      return;
    }

    const previousMembers = prevMembersRef.current;
    const { joined, left } = getJoinedAndLeftPlayers(previousMembers, members);
    const nextMessages = createPresenceMessages(joined, left);

    if (nextMessages.length > 0) {
      setSystemMessages((prev) => [...prev, ...nextMessages]);
    }

    prevMembersRef.current = members;
  }, [members]);

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

          const players = dedupePlayers(payload.players);
          setMembers(players);
          membersRef.current = players;
          roundRef.current = payload.round;
          turnRef.current = payload.turn;
          setDrawerId(payload.drawer);
          setCurrentWord(payload.word);
          setCurrentWordLength(payload.word_length ?? 0);
          setTurnSummary(null);
          setRecentlyCorrectGuesser(null);

          const turnDurationMs = (payload as TurnInfoPayload & { time_to_display?: number }).time_to_display ?? 0;
          if (payload.round > 0 && turnDurationMs > 0) {
            setClockRemainingMs(turnDurationMs);
            setClockRunning(true);
          } else {
            setClockRemainingMs(0);
            setClockRunning(false);
          }

          //round/turn 0 means waiting
          setWsState(payload.round === 0 ? "waiting" : "playing");
        });

        unsubStartGame = onStartGame((payload) => {
          console.log("[ws] start_game:", payload);
          clearConnectTimeout();
          const players = dedupePlayers(payload.members);
          setMembers(players);
          membersRef.current = players;
          roundRef.current = payload.round;
          turnRef.current = payload.turn;
          setCurrentWordLength(0);
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
          setClockRunning(false);
          setClockRemainingMs(0);

          const countdown = Math.max(1, Math.ceil(payload.time_to_display / 1000));
          const nicknameByUserId = new Map(
            membersRef.current.map((player) => [player.userId, player.nickname])
          );
          const correctGuesserIds = Array.from(correctGuesserIdsRef.current);
          const correctGuesserNames = correctGuesserIds
            .map((userId) => nicknameByUserId.get(userId))
            .filter((name): name is string => Boolean(name));
          correctGuesserIdsRef.current = new Set();
          const isRoundEnd =
            membersRef.current.length > 0 && turnRef.current === membersRef.current.length;

          const resultPlayers = (payload as typeof payload & { players?: TurnInfoPayload["players"] }).players;
          const scoringPlayers = resultPlayers ?? membersRef.current;
          const topScore =
            scoringPlayers.length > 0
              ? Math.max(...scoringPlayers.map((player) => player.score))
              : 0;
          const roundWinners = scoringPlayers
            .filter((player) => player.score === topScore)
            .map((player) => player.nickname);

          setTurnSummary({
            solution: payload.solution,
            correctGuessersText: formatNames(correctGuesserNames),
            isRoundEnd,
            roundWinnerText: formatNames(roundWinners),
            countdown,
          });

          if (payload.final) {
            clearRoom();
            socket.disconnect();
            navigate("/post-game", {
              replace: true,
              state: {
                summary: {
                  solution: payload.solution,
                  winnerText: formatNames(roundWinners),
                  winnerScore: topScore,
                },
              },
            });
            return;
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
  }, [userId, logout, navigate, clearRoom]);

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

  useEffect(() => {
    if (!clockRunning) return;

    const interval = window.setInterval(() => {
      setClockRemainingMs((prev) => {
        const next = Math.max(0, prev - 250);
        if (next === 0) {
          setClockRunning(false);
        }
        return next;
      });
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [clockRunning]);

  useEffect(() => {
    if (!turnSummary) return;

    const interval = window.setInterval(() => {
      setTurnSummary((previous) => {
        if (!previous) return null;
        const nextCountdown = previous.countdown - 1;
        if (nextCountdown <= 0) {
          return null;
        }
        return { ...previous, countdown: nextCountdown };
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [turnSummary]);

  return (
    <RoomLayout
      highlightedPlayerId={recentlyCorrectGuesser}
      players={members}
      drawerId={drawerId}
      clockRemainingMs={clockRemainingMs}
      clockRunning={clockRunning}
    >

		{/* Debugging stuff: feel free to delete or change */}
		{/* <div className="absolute top-50 left-50 z-10 max-w-sm bg-white/90 rounded p-3 text-xs space-y-2">
          <div className="font-semibold">Debugging information:</div>
          <div>wsState: {wsState}</div>
          <div>round: {round} turn: {turn}</div>
          <div>players: {members.length}</div>
		  <div>whoIam: id:{userId} name:{user?.username} </div>
          </div> */}

    {wsState === "connecting" && (
      <Lobby 
        title="Connecting..."
        message="Connecting to the game room..."
        icon = {cloudImage}
      />
    )}

    {wsState === "waiting" && (
      <Lobby 
        title="Waiting for Players"
        message="Not enough players in room"
      />
    )}

    {wsState === "full" && (
      <Lobby 
        title="Room Full"
        message="Room 2 is under construction. Please wait for a spot in Room 1 to become available."
      />
    )}

    {wsState === "error" && (
      <Lobby 
        title="Connection Error"
        message="Unable to connect to the game. Please refresh the page."
      />
    )}

      {wsState === "waiting" && (
        <DrawingBoard systemMessages={systemMessages} players={members} />
      )}

      {wsState === "playing" && (
        <>
          {(drawerId === userId || drawerId !== -1) && (
            <div className="absolute top-8 left-8 z-10 max-w-sm">
              <PromptBox
                title={drawerId === userId ? "Your prompt" : "Guess the word"}
                prompt={
                  drawerId === userId
                    ? currentWord
                    : currentWordLength > 0
                      ? "_ ".repeat(currentWordLength).trim()
                      : "..."
                }
              />
            </div>
          )}
          <DrawingBoard
            onGuessCorrect={handleGuessCorrect}
            systemMessages={systemMessages}
            players={members}
          />
        </>
      )}

      {wsState === "playing" && turnSummary !== null && (
        <Lobby
          title={turnSummary.isRoundEnd ? "Round Over" : "Turn Over"}
          message={
            turnSummary.isRoundEnd
              ? (
                  <>
                    <p>
                      The correct answer was: <strong>{turnSummary.solution}</strong>
                    </p>
                    <p>
                      <strong>{turnSummary.correctGuessersText}</strong> guessed correctly
                    </p>
                    <p>
                      <strong>{turnSummary.roundWinnerText}</strong> won this round!
                    </p>
                    <p>
                      The next round will start in: <strong>{turnSummary.countdown}</strong>
                    </p>
                  </>
                )
              : (
                  <>
                    <p>
                      The correct answer was: <strong>{turnSummary.solution}</strong>
                    </p>
                    <p>
                      <strong>{turnSummary.correctGuessersText}</strong> guessed correctly
                    </p>
                    <p>
                      The next turn will start in: <strong>{turnSummary.countdown}</strong>
                    </p>
                  </>
                )
          }
          icon={beeImage}
        />
      )}

      {wsState === "playing" && startCountdown !== null && (
        <Lobby 
          title="Get Ready" 
          message={`Game will start in: ${startCountdown}`} 
          icon={rocketImage}/>
      )}
    </RoomLayout>
  );
}