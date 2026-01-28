import { useAuth } from "../features/auth/AuthContext";

export default function GamePage() {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Hi{auth ? `, ${auth.user.email}` : ""} 👋
      </h1>

      <p className="text-gray-600">
        Game room in progress, come back in one week
      </p>
    </div>
  );
}
