import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/auth";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { useSessionStore } from "../state/sessionStore";

type AnyProfile = Record<string, unknown>;

export const ProfilePage = () => {
  // Only using store for userId (you can replace this with any source)
  const userId = useSessionStore((s) => s.user?.id);

  const [profile, setProfile] = useState<AnyProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      navigate("/login");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile(userId);
        if (!cancelled) setProfile(data as AnyProfile);
      } catch {
        if (!cancelled) setError("Failed to load profile");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, navigate]);

  if (isLoading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <h1>{profile.nickname}</h1>
          <p className="profile-email">{profile.email}</p>
        </div>
		</Card>
		<Card className="profile-card">
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Friends</span>
            <span className="stat-value">{profile.friends.length}</span>
          </div>
        </div>
	   </Card>

        <div className="profile-actions">
          <Button onClick={() => navigate("/room")}>Back to Room</Button>
        </div>
      
    </div>
  );
};