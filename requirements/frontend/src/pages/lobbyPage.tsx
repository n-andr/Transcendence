import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Button } from "../components/button";

export default function LobbyPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleStartGame = () => {
    // Auto-generate a mock room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome{auth ? `, ${auth.user.email}` : ""}
        </h1>
        <p className="text-xl text-gray-600">You are all set</p>
      </div>

      <Button
        onClick={handleStartGame}
        variant="primary"
        className="px-4 py-2 text-md"
      >
        Play!
      </Button>
    </div>
  );
}