export default function Clock() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-3xl font-mono font-bold">0:45</div>
        <div className="text-xs text-gray-500">Time left</div>
      </div>
    </div>
  );
}