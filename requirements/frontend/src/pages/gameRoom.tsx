// import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useBlocker, useLocation } from "react-router-dom";
// import { RoomProvider } from "../features/room/RoomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";
import Lobby from "../components/room/lobby";
import ConfirmLeaveDialog from "../components/room/confirmLeaveDialog";
import type { TurnInfoPayload } from "../../shared/ws.payloads";
import {
  socket,
  joinRoom,
  watchGame,
  onTurnInfo,
  onRoomFull,
  onResults,
  onStartGame,
  cancelScheduledSocketDisconnect,
  scheduleSocketDisconnect,
} from "../api/socket";
import { useSessionStore } from "../state/sessionStore";
import rocketImage from "../assets/rocket2.png";
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

// Checks which players joined or left by comparing the old and new lists
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

const START_COUNTDOWN_MS = 3000; // 3 second "Get Ready" popup

export default function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const roomMode = (location.state as { mode?: "play" | "watch" } | null)?.mode ?? "play";
  // safety function to remove duplicate players from the list
  const dedupePlayers = (players: TurnInfoPayload["players"]) =>
    players.filter((player, index, list) =>
      list.findIndex((candidate) => candidate.userId === player.userId) === index
    );

  // 1. get userId from storage
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);
  const clearRoom = useSessionStore((s) => s.clearRoom);
  const userId = user?.id; // Use the user ID from storage
  if (!userId) {
    return <div>No user found</div>; // handle an error
  }

  const [wsState, setWsState] = useState<"connecting" | "waiting" | "playing" | "full" | "finished" | "error">("connecting");
  const [members, setMembers] = useState<TurnInfoPayload["players"]>([]);
  const [spectators, setSpectators] = useState<TurnInfoPayload["spectators"]>([]);
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
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  // Store values that DON'T cause re-renders when changed (useful for tracking previous values)
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const isGameNavigatingRef = useRef(false);
  const prevWsStateRef = useRef<typeof wsState>("connecting");
  const prevMembersRef = useRef<TurnInfoPayload["players"]>([]);
  const membersInitializedRef = useRef(false);
  const turnRef = useRef<number>(0);
  const roundRef = useRef<number>(0);
  const membersRef = useRef<TurnInfoPayload["players"]>([]);
  const correctGuesserIdsRef = useRef<Set<number>>(new Set());
  const isSpectator = members.every((member) => member.userId !== userId);

  const handleGuessCorrect = (guesserId: number) => {
    correctGuesserIdsRef.current.add(guesserId);
    setRecentlyCorrectGuesser(guesserId);
  };

  // Clear highlight after delay
  useEffect(() => {
    if (recentlyCorrectGuesser !== null) {
      const timer = setTimeout(() => {
        setRecentlyCorrectGuesser(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [recentlyCorrectGuesser]);

  // Block navigation and show confirmation dialog when user tries to leave during game
  useBlocker(({ nextLocation }) => {
    if (isGameNavigatingRef.current) {
      return false;
    }
    if (wsState === "playing" && !showLeaveConfirm) {
      pendingNavigationRef.current = () => navigate(nextLocation.pathname);
      setShowLeaveConfirm(true);
      return true;
    }
    return false;
  });

  // Skip on first render, then track member changes to show join/leave messages
  useEffect(() => {
    if (!membersInitializedRef.current) {
      prevMembersRef.current = members;
      membersInitializedRef.current = true;
      return;
    }

    // Calculate new messages from member changes without storing separately
    const previousMembers = prevMembersRef.current;
    const { joined, left } = getJoinedAndLeftPlayers(previousMembers, members);
    const nextMessages = createPresenceMessages(joined, left);

    if (nextMessages.length > 0) {
      setSystemMessages((prev) => [...prev, ...nextMessages]);
    }

    prevMembersRef.current = members;
  }, [members]);

  // Main effect to handle WebSocket connection and events
  useEffect(() => {
    // Define cleanup functions for each event listener
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

    cancelScheduledSocketDisconnect();

    (async () => {
      try {
        setWsState("connecting");

        connectTimeout = window.setTimeout(() => {
          console.log("[wss] connect timeout -> clearing stale session");
          setWsState("error");
          socket.disconnect();
          logout();
        }, 8000);

        // Listen for game events from the server
        unsubTurnInfo = onTurnInfo((payload) => {
          console.log("[wss] turnInfo:", payload);
          clearConnectTimeout();

          if (payload.room_id === -1) {
            setWsState("full");
            return;
          }

          const previousRound = roundRef.current;
          const previousTurn = turnRef.current;

          const players = dedupePlayers(payload.players);
          const spectatorList = dedupePlayers(payload.spectators ?? []);
          setMembers(players);
          setSpectators(spectatorList);
          membersRef.current = players;
          roundRef.current = payload.round;
          turnRef.current = payload.turn;
          setDrawerId(payload.drawer);
          setCurrentWord(payload.word);
          setCurrentWordLength(payload.word_length ?? 0);
          setTurnSummary(null);
          
          const isNewTurn = payload.round !== previousRound || payload.turn !== previousTurn;
          
          if (isNewTurn) {
            setRecentlyCorrectGuesser(null);
          }

          const turnDurationMs = (payload as TurnInfoPayload & { time_to_display?: number }).time_to_display ?? 0;

          if (isNewTurn && payload.round > 0 && turnDurationMs > 0) {
            // Subtract popup duration so clock displays actual turn time (e.g., 20s not 23s)
            const displayDurationMs = Math.max(0, turnDurationMs - START_COUNTDOWN_MS);
            setClockRemainingMs(displayDurationMs);
            setClockRunning(true);
          } else if (!isNewTurn) {
            // Same turn update: keep timer as-is
          } else {
            setClockRemainingMs(0);
            setClockRunning(false);
          }

          //round/turn 0 means waiting
          setWsState(payload.round === 0 ? "waiting" : "playing");
        });

        unsubStartGame = onStartGame((payload) => {
          console.log("[wss] start_game:", payload);
          clearConnectTimeout();
          const players = dedupePlayers(payload.members);
          setMembers(players);
          setSpectators([]);
          membersRef.current = players;
          roundRef.current = payload.round;
          turnRef.current = payload.turn;
          setCurrentWordLength(0);
          setWsState("playing");
        });

        unsubRoomFull = onRoomFull(() => {
          console.log("[wss] room full");
          clearConnectTimeout();
          setWsState("full");
        });

        unsubResults = onResults((payload) => {
          console.log("[wss] results:", payload);
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
            isGameNavigatingRef.current = true;
            navigate("/post-game", {
              replace: true,
              state: {
                summary: {
                  solution: payload.solution,
                  winnerText: formatNames(roundWinners),
                  winnerScore: topScore,
                  players: scoringPlayers,
                },
              },
            });
            return;
          }
        });

        // 3. handle joinRoom
        if (roomMode === "watch") {
          await watchGame(userId);
          console.log("[gameRoom] watchGame successful");
        } else {
          await joinRoom(userId);
          console.log("[gameRoom] joinRoom successful");
        }
      } catch (e) {
        console.error(e);
        clearConnectTimeout();
        setWsState("error");
      }
    })();

    // Clean up: unsubscribe from events and disconnect when component leaves
    return () => {
      clearConnectTimeout();
      unsubTurnInfo();
      unsubRoomFull();
      unsubStartGame();
      unsubResults();
      scheduleSocketDisconnect();
    };
  }, [userId, logout, navigate, clearRoom, roomMode]);

  // countdown before play
  useEffect(() => {
    let countdownInterval: number | undefined;
    const prevState = prevWsStateRef.current;

    // Only start countdown when transitioning to playing state
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

// Calculate whether the clock should tick based on multiple conditions
const clockShouldTick = clockRunning && startCountdown === null && turnSummary === null;

// Update the timer every 250ms while the game is playing
useEffect(() => {
  if (!clockShouldTick) return;

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
  // Only re-run when clockShouldTick changes
}, [clockShouldTick]);

  // Update the turn summary countdown every second
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

  // Pass state values down to child components
  return (
    <RoomLayout
      highlightedPlayerId={recentlyCorrectGuesser}
      players={members}
      spectators={spectators}
      drawerId={drawerId}
      clockRemainingMs={clockRemainingMs}
      clockRunning={clockRunning}
    >

		{/* Show/hide components based on conditions (debugging section) */}
		{/* <div className="absolute top-50 left-50 z-10 max-w-sm bg-white/90 rounded p-3 text-xs space-y-2">
          <div className="font-semibold">Debugging information:</div>
          <div>wsState: {wsState}</div>
          <div>round: {round} turn: {turn}</div>
          <div>players: {members.length}</div>
		  <div>whoIam: id:{userId} name:{user?.username} </div>
          </div> */}

    {/* Show component only if the condition is true */}
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
        <DrawingBoard
          systemMessages={systemMessages}
          players={members}
          spectatorIntent={roomMode === "watch" ? "stay-spectator" : "join-player"}
        />
      )}

      {/* Fragment (<>) allows multiple elements without adding an extra div */}
      {wsState === "playing" && (
        <>
          {/* Show prompt only if there is a drawer assigned */}
          {(drawerId === userId || drawerId !== -1) && (
            <div className="absolute top-8 left-8 z-10 max-w-sm">
              {/* Show different content depending on whether user is the drawer or guesser */}
              <PromptBox
                isDrawer={drawerId === userId}
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
            spectatorIntent={roomMode === "watch" ? "stay-spectator" : "join-player"}
          />
        </>
      )}

      {/* Show overlay that blocks interaction until dismissed */}
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

      {/* Show countdown only if game is starting and user is playing (not spectating) */}
      {wsState === "playing" && startCountdown !== null && !isSpectator && (
        <Lobby
          title="Get Ready"
          message={`Game will start in: ${startCountdown}`}
          icon={rocketImage}/>
      )}

      {/* Pass function to child component to handle navigation confirmation */}
      {showLeaveConfirm && (
        <ConfirmLeaveDialog
          onConfirm={() => {
            setShowLeaveConfirm(false);
            pendingNavigationRef.current?.();
          }}
          onCancel={() => {
            setShowLeaveConfirm(false);
            pendingNavigationRef.current = null;
          }}
        />
      )}
    </RoomLayout>
  );
}
