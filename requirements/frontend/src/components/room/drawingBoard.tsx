import { Button } from "../button";
import { Input } from "../input";

export default function DrawingBoard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      {/* Canvas area */}
      <div className="relative bg-white border-2 border-gray-300 rounded flex-1 min-h-0">
        <canvas
          className="w-full h-full rounded cursor-crosshair"
          width={1600}
          height={1200}
        />
      </div>

      {/* Chat/Guesses section */}
      <div className="mt-4 flex-shrink-0">
        <div className="space-y-1 mb-3 h-20 overflow-y-auto text-sm">
          <div>Marc: Crystal ball</div>
          <div>Nick: Sphere? </div>
          <div>Steph: Axolotl! </div>
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