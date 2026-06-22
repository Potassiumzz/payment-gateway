import { Navbar } from "@/components/layout/Navbar";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
