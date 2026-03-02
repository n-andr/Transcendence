type Props = {
  color: string;
  onColorChange: (next: string) => void;
  onUndo: () => void;
  onClear: () => void;
};

export function DrawerPanel({ color, onColorChange, onUndo, onClear }: Props) {
  return (
    <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow-sm p-2 flex items-center gap-2">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-gray-700">Color</span>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-8 w-10 cursor-pointer bg-transparent"
          aria-label="Pick drawing color"
        />
      </label>

      <button
        type="button"
        onClick={onUndo}
        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
      >
        Undo
      </button>

      <button
        type="button"
        onClick={onClear}
        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
      >
        Clear
      </button>
    </div>
  );
}
