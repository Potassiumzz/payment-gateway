import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import { META_INFO } from "@/pages/home/data/hero-data";

export default function Home() {
  return (
    <main className="flex flex-col">
      <section className="flex-1 flex flex-col justify-center px-6 md:px-16 max-w-3xl mx-auto w-full py-8 xl:py-24">

        <div className="mb-3">
          <span className="font-sans text-xs text-primary/90 tracking-widest uppercase">
            Developer Sandbox
          </span>
        </div>

        <h1 className="font-mono text-4xl md:text-5xl font-bold text-text-primary leading-tight tracking-tight mb-4">
          Payment Gateway
          <br />
          <span className="text-text-muted text-2xl md:text-5xl">Simulation Environment</span>
        </h1>

        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-10 max-w-lg font-mono">
          Test and simulate merchant payment flows end-to-end. No real transactions.
          No third-party dependencies. Just raw gateway behavior.
        </p>

        <div className="flex flex-col items-start sm:flex-row gap-3 mx-auto md:mx-0">
          <Link
            to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-3 transition-colors duration-150"
          >
            Simulate Merchant
          </Link>
        </div>

        <div className="mt-8 md:mt-16 flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-2">
          {META_INFO.map(({ key, value }) => (
            <div key={key} className="flex items-center gap-2 font-mono text-xs cursor-default">
              <span className="text-text-muted">{key}</span>
              <span className="text-text-secondary">{value}</span>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}
