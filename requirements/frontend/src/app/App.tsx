import { Outlet } from "react-router-dom";

export default function App() {
  return (
	// <main className="min-h-screen grid place-items-center bg-gray-900 text-white">
  //     <div className="p-6 rounded-2xl bg-gray-800 shadow">
  //       <h1 className="text-3xl font-bold">You draw me crazy</h1>
  //       <p className="mt-2 text-gray-300">App in progress...</p>
  //     </div>
  //   </main>
  
    <div className="min-h-screen">
    <Outlet />
    </div>
  );
}