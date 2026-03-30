import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, removeFriend } from "../api/auth";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { useSessionStore } from "../state/sessionStore";

type UserProfileDto = {
  id: number;
  nickname: string;
  email: string;
  friends: string[];
};

export const ProfilePage = () => {
  const userId = useSessionStore((s) => s.user?.id);

  const [profile, setProfile] = useState<UserProfileDto | null>(null);
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
        if (!cancelled) {
          setProfile(data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load profile");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, navigate]);

async function handleRemoveFriend(friendNickname: string) {
  if (!userId) return;

  try {
    await removeFriend({ userId, friendNickname });

    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        friends: prev.friends.filter((friend) => friend !== friendNickname),
      };
    });
  } catch {
    setError("Failed to remove friend");
  }
}

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="text-textMuted">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">My Profile</h1>
          <p className="text-sm text-textMuted">
            Overview of your account and friends
          </p>
        </div>

        <Button onClick={() => navigate("/play")}>To the Game Room</Button>
      </div>

      {/* Top section */}
      <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-lg border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-textPrimary">
              Account Info
            </h2>
            <p className="text-sm text-textMuted">
              Your account details
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-textMuted">
                Nickname
              </div>
              <div className="mt-1 text-xl font-semibold text-textPrimary">
                {profile.nickname}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-textMuted">
                Email
              </div>
              <div className="mt-1 text-base text-textPrimary">
                {profile.email}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-textPrimary">Friends</h2>
            <p className="text-sm text-textMuted">
              Users you currently follow
            </p>
          </div>

          <div className="rounded-md bg-gray-50 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-textMuted">
              Total
            </div>
            <div className="mt-1 text-3xl font-bold text-textPrimary">
              {profile.friends.length}
            </div>
          </div>
        </Card>
      </div>

      {/* Friend list */}
      <Card className="rounded-lg border border-gray-200 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-textPrimary">
            Friend List
          </h2>
          <p className="text-sm text-textMuted">
            Manage the users you follow
          </p>
        </div>

        {profile.friends.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-textMuted">
            You don’t have any friends yet.
          </div>
        ) : (
          <div className="space-y-2">
            {profile.friends.map((friend) => (
              <div
                key={friend}
                className="group flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm" title="Friend">
                    ⭐
                  </span>
                  <div>
                    <div className="text-base font-semibold text-textPrimary">
                      {friend}
                    </div>
                    <div className="text-xs text-textMuted">Friend</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFriend(friend)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Remove friend"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};