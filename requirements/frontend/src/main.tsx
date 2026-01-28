//import { StrictMode } from 'react'
import React from 'react'
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom'
import { router } from './app/routes.tsx'
import { AuthProvider } from './features/auth/AuthContext.tsx'; //to track if user is loged in
//import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './app/App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
	<AuthProvider>
		 <RouterProvider router={router} />
	</AuthProvider>
   
  </React.StrictMode>
);