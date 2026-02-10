export default function PromptBox() {
  // Mock prompt
  const prompt = "Igloo";
  const isDrawer = true; // Mock role

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      {isDrawer ? (
        <div>
          <div className="text-xs text-gray-500 mb-2">Your prompt</div>
          <div className="text-lg font-semibold text-black">{prompt}</div>
        </div>
      ) : (
        <div>
          <div className="text-xs text-gray-500 mb-3">Guess what is being drawn!</div>
          <div className="flex gap-1">
            {"_ _ _   _ _ _".split("").map((char, i) => (
              <span key={i} className="text-base text-black font-mono">
                {char}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}