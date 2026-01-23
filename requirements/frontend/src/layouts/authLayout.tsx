import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer";

type AuthLayoutProps = {
  children?: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const content = children ?? <Outlet />; // allow direct children or nested routes via Outlet

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6">
        {content}
      </main>
      <Footer />
    </div>
  );
}