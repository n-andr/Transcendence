export default function PromptBox() {
  // Mock prompt
  const prompt = "Igloo";
  const isDrawer = true; // Mock role

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        {isDrawer ? (
          <>
            <div className="text-sm text-gray-500 mb-2">Your prompt:</div>
            <div className="text-2xl font-bold text-blue-600">{prompt}</div>
          </>
        ) : (
          <>
            <div className="text-lg text-gray-500">Guess what is being drawn!</div>
            <div className="mt-4 flex gap-2 justify-center">
              {"_ _ _   _ _ _".split("").map((char, i) => (
                <span key={i} className="text-2xl font-mono font-bold">
                  {char}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}