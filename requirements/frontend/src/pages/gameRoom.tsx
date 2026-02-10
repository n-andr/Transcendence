import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { RoomProvider } from "../features/room/RoomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";
import { socket } from "../api/socket";
import { initSocketWithIdentify } from "../api/socket";


export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();




  // IMPORTANT: replace with real user id
  const userId = 42;

    // maybe this check after attemoting connection??? no idea
  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Room ID is required</p>
      </div>
    );
  }

  useEffect(() => {
	initSocketWithIdentify(userId);
	return () => {
		 // disconnect when leaving room page
      socket.disconnect();
    };
  }, [userId, roomId]);

    

    // // connect once when entering the room page
    // socket.connect();

    // // join room after connection is established

	// // do i need to check smth else?? tbd
    // const onConnect = () => {
    //   socket.emit("room:join", { roomId });
    //   console.log("[ws] connected:", socket.id, "joined:", roomId); //delete
    // };

    // const onDisconnect = () => {
    //   console.log("[ws] disconnected"); //delete
    // };

    // socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);

    // // debug any server ack/eventm
    // socket.on("room:joined", (payload) => {
    //   console.log("[ws] room:joined", payload);  //delete the whole function 
    // });

//     return () => {
//       // leave listeners clean
//     //   socket.off("connect", onConnect);
//     //   socket.off("disconnect", onDisconnect);
//     //   socket.off("room:joined");

//       // disconnect when leaving room page ????
//       socket.disconnect();
//     };
//   }, [roomId]);

  return (
    <RoomProvider roomId={roomId}>
      <RoomLayout>
        {/* Prompt overlaid on top */}
        <div className="absolute top-8 left-8 z-10 max-w-sm">
          <PromptBox />
        </div>
        
        <DrawingBoard />
      </RoomLayout>
    </RoomProvider>
  );
}
