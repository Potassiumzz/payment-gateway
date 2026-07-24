import { Footer } from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { TitleUpdater } from "./components/TitleUpdater";
import { Outlet, ScrollRestoration } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TitleUpdater />
      <Navbar />
      <main className="flex-1 flex justify-center">
        <Outlet />
        <ScrollRestoration />
      </main>
      <Footer />
    </div>
  );
}
