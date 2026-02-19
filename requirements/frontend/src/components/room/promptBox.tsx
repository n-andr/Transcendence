export default function PromptBox() {
  // Mock prompt
  const prompt = "Igloo";
  const isDrawer = true; // Mock role
  

  return (
    <div className="bg-surface rounded-lg p-4 border border-surface">
      {isDrawer ? (
        <div>
          <div className="text-xs text-textMuted mb-2">Your prompt</div>
          <div className="text-lg font-semibold text-textPrimary">{prompt}</div>
        </div>
      ) : (
        <div>
          <div className="text-xs text-textMuted mb-3">Guess what is being drawn!</div>
          <div className="flex gap-1">
            {"_ _ _   _ _ _".split("").map((char, i) => (
              <span key={i} className="text-base text-textPrimary font-mono">
                {char}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}