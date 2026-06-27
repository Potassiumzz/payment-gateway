import { Link, Outlet } from "react-router-dom";

export function CheckoutLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="relative z-40">
        <div className="flex items-center justify-center px-8 py-5">
          <Link 
            to="/" 
            className="font-mono text-sm tracking-widest text-zinc-500 uppercase hover:text-zinc-300 transition-colors"
            viewTransition
            >
            ntay
          </Link>
        </div>
      </nav>
      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}
