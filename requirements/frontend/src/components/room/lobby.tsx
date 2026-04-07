import clockImage from "../../assets/clock.png";

interface LobbyProps {
  title?: string;
  message: React.ReactNode;
  // players?: Player[];
  icon?: string | null;
  actions?: React.ReactNode;
}

export default function Lobby({ 
  title, 
  message,
  // players,
  icon,
  actions 
}: LobbyProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-background/80">
      <div className="bg-surface border border-gray-700 rounded-xl p-12 max-w-2xl w-full text-center shadow-2xl">
        {/* Show icon div only if icon is provided */}
        {icon && (
          <div className="mb-8">
            <img
              src={icon}
              alt={title}
              className="w-auto h-auto max-w-32 max-h-32 object-contain mx-auto mb-6"
            />
          </div>
        )}
        
        {/* Show title only if provided */}
        {title && (
          <h2 className="text-3xl font-bold text-textPrimary mb-6">
            {title}
          </h2>
        )}
        
        <div className="text-lg text-textMuted mb-8 whitespace-pre-line">
          {message}
        </div>
        
        {actions && (
          <div className="mt-8 flex gap-4 justify-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
