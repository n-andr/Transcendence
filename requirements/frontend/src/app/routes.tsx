import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/appLayout";
import App from "./App";
import { ComponentSandbox } from "../pages/componentSandbox.tsx";
//import HomePage from "../pages/homePage";
import Terms from "../pages/static/terms";
//import LoginPage from "../pages/LoginPage";
//import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/notFoundPage";
import LoginForm from "../features/auth/loginPage";
import About from "../pages/static/about.tsx";
import Privacy from "../pages/static/privacy.tsx"

export const router = createBrowserRouter(
	[
		{
			element: <AppLayout/>, //layout that wraps all child routes (will add header and footer) and render content into Outlet
			children: [
				{
					path: "/",
					element: <App />,
					children: [
					{
						index: true,
						element: <ComponentSandbox />,
					},
					],
				},
				{
					path: "/privacy",
					element: <Privacy />,
				},
				{
					path: "/about", 
					element: <About />,
				},
				{
					path: "/terms",
					element: <Terms />,
				},
				{
					path: "/login",
					element: <LoginForm />,
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