import React from "react";

interface PromptBoxProps {
  prompt: string | null;
  title?: string;
  isDrawer?: boolean;
}

const PromptBox: React.FC<PromptBoxProps> = ({ prompt, title = "Your prompt", isDrawer = false }) => {
  const drawerTitle = isDrawer ? "You're Drawing" : title;
  
  return (
    <div className={`bg-surface rounded-lg p-4 border ${
      isDrawer ? "border-yellow-500 border-2" : "border-surface"
    }`}>
      <div>
        <div className={`text-xs mb-2 ${
          isDrawer ? "text-yellow-600 font-bold" : "text-textMuted"
        }`}>{drawerTitle}</div>
        <div className="text-lg font-semibold text-textPrimary">{prompt ?? "..."}</div>
      </div>
    </div>
  );
};

export default PromptBox;