export default function ParticipantsList() {
  // Mock participants data
  const participants = [
    { id: "1", name: "Alice", score: 250, role: "drawer", status: "connected" },
    { id: "2", name: "Bob", score: 180, role: "guesser", status: "connected" },
    { id: "3", name: "Charlie", score: 150, role: "guesser", status: "disconnected" },
    { id: "4", name: "Diana", score: 200, role: "guesser", status: "connected" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Players ({participants.length})</h2>
      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className={`p-3 border rounded-lg ${
              participant.status === "disconnected" ? "opacity-50" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{participant.name}</div>
                <div className="text-xs text-gray-500">
                  {participant.role === "drawer" ? "Drawing" : "Guessing"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{participant.score}</div>
                <div className="text-xs text-gray-500">pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}