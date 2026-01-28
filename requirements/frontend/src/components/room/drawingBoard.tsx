import { Button } from "../button";
import { Input } from "../input";

export default function DrawingBoard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Canvas area */}
      <div className="relative bg-white border-2 border-gray-300 rounded" style={{ aspectRatio: "16/10" }}>
        <canvas
          className="w-full h-full rounded cursor-crosshair"
          width={1600}
          height={1000}
        />
      </div>

      {/* Chat/Guesses section */}
      <div className="mt-4">
        <div className="space-y-1 mb-3 h-24 overflow-y-auto text-sm">
          <div>Bob: is it a dog?</div>
          <div>Diana: maybe a cat?</div>
          <div className="text-gray-500">Bob is getting close!</div>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type your guess..."
            className="flex-1"
          />
          <Button variant="primary">Send</Button>
        </div>
      </div>
    </div>
  );
}