import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/appLayout";

import HomePage from "../pages/homePage";
import LegalPage from "../pages/static/legalPlaceholder";
//import LoginPage from "../pages/LoginPage";
//import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/notFoundPage";

export const router = createBrowserRouter(
	[
		{
			element: <AppLayout/>, //layout that wraps all child routes (will add header and footer) and render content into Outlet
			children: [
				{
					path: "/",
					element: <HomePage />,
				},
				{
					path: "/privacy",
					element: <LegalPage />,
				},
				{
					path: "/terms",
					element: <LegalPage />,
				},
				{
					path: "*",
					element: <NotFoundPage />,
  				},
			]
		},

		//any page in this section will not get wraped by  AppLayout
		// {
		// 	path: "*",
		// 	element: <NotFoundPage />,
  		// },
	]
)