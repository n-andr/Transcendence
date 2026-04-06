import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { useSessionStore } from "../state/sessionStore";
import starImage from "../assets/star.png";
import type { PlayerDto } from "../../shared/player.dto";

type PostGameSummary = {
  solution: string;
  winnerText: string;
  winnerScore: number;
  players?: PlayerDto[];
};

type LocationState = {
  summary?: PostGameSummary;
};

export default function PostGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearRoom = useSessionStore((s) => s.clearRoom);
  const summary = (location.state as LocationState | null)?.summary;

  const joinRoom = () => {
    navigate("/room");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    clearRoom();
  }, [clearRoom]);

  const scoredPlayers = summary?.players ?? [];
  const sortedPlayers = [...scoredPlayers].sort((a, b) => b.score - a.score);

  console.log("[postGame] summary:", summary);
  console.log("[postGame] scoredPlayers:", scoredPlayers);

  return (
    <div className="flex items-center justify-center px-6 py-16">
      <Card className="max-w-2xl text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-2">
            <img
              src={starImage}
              alt="Game finished"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-3xl font-bold text-textPrimary">Game Finished</h1>
          </div>

          {summary ? (
            <div className="w-full space-y-6">
              {/* Winner section */}
              <div className="text-center">
                <p className="text-2xl text-textPrimary">
                  Congratulations to {summary.winnerText}!
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300"></div>

              {/* Scoreboard */}
              <div className="w-full">
                <h2 className="text-lg font-semibold mb-3 text-textPrimary">Scoreboard</h2>
                {sortedPlayers.length > 0 ? (
                  <div className="space-y-2">
                    {sortedPlayers.map((player, index) => (
                      <div
                        key={player.userId}
                        className={`px-4 py-2 rounded-md flex items-center justify-between ${
                          index === 0
                            ? "bg-amber-100 border border-amber-300"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg w-6">
                            {index + 1}.
                          </span>
                          <span className="text-textPrimary font-medium">
                            {player.nickname}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-textPrimary font-semibold">
                            {player.score}
                          </span>
                          {index === 0 && <span className="text-xl">👑</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-textMuted">No player data available</p>
                )}
              </div>

              {/* Last correct answer */}
              <div className="text-xs text-textMuted pt-2 border-t border-gray-200">
                <p>The last correct answer was: <strong>{summary.solution}</strong></p>
              </div>
            </div>
          ) : (
            <p className="text-lg text-textMuted">Game finished.</p>
          )}

          <div className="w-full max-w-sm mt-6 space-y-4">
            <Button className="w-full" onClick={joinRoom}>
              Play Again
            </Button>
            <Button className="w-full" variant="secondary" onClick={goToProfile}>
              Go to Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
