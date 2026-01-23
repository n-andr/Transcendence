import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/appLayout";
import AuthLayout from "../layouts/authLayout.tsx";
import App from "./App";
import { ComponentSandbox } from "../pages/componentSandbox.tsx";
//import HomePage from "../pages/homePage";
import Terms from "../pages/static/terms";
import LoginPage from "../features/auth/loginPage.tsx";
//import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/notFoundPage";
import About from "../pages/static/about.tsx";
import Privacy from "../pages/static/privacy.tsx";
import WelcomePage from "../pages/welcomePage.tsx";

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
					path: "*",
					element: <NotFoundPage />,
  				},
			]
		},
		{
			element: <AuthLayout />, //layout that wraps all child routes (will only add footer) and render content into Outlet
			children: [
				{
					path: "/welcome",
					element: <WelcomePage />,
				},
				{
					path: "/login",
					element: <LoginPage />
				},
				// {
				//	path: "/register",
				//	element: <RegisterPage />
				// },
				{
					path: "*",
					element: <NotFoundPage />,
				},
			]
		},
	]
)