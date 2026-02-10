import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Button } from "../components/button";
import { Card } from "../components/card";

export default function HomePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleStartGame = () => {
    // Auto-generate a mock room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex items-center justify-center px-6 py-16">
      <Card>
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">
              Welcome{auth ? `, ${auth.user.email}` : ""}
            </h1>
            <p className="text-sm text-gray-600">You are all set</p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Button
              onClick={handleStartGame}
              variant="primary"
            >
              Play!
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}