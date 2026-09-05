import { NAVIGATION_ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import { META_INFO } from "@/pages/home/data/hero-data";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <section className="flex-1 flex flex-col justify-center px-6 md:px-16 max-w-3xl mx-auto w-full text-center md:text-start">

        <div className="mb-3">
          <span className="font-sans text-xs text-primary/90 tracking-widest uppercase">
            Developer Sandbox
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight tracking-tight mb-4">
          Payment Gateway
          <br />
          <span className="text-text-muted text-2xl md:text-5xl">Simulation Environment</span>
        </h1>

        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-10 md:max-w-lg">
          Test and simulate merchant payment flows end-to-end. No real transactions.
          No third-party dependencies. Just raw gateway behavior.
        </p>

        <div className="flex flex-col items-start sm:flex-row gap-3 mx-auto md:mx-0">
          <Link
            to={NAVIGATION_ROUTES.SIMULATE_MERCHANT_ROUTE}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-3 transition-colors duration-150"
            viewTransition
          >
            Simulate Merchant
          </Link>
        </div>
        <p className="text-text-muted text-xs mt-5 mx-auto md:mx-0 md:max-w-lg">
          First time here?{" "}
          <Link
            to={NAVIGATION_ROUTES.ACCOUNTS}
            className="text-primary hover:text-primary-hover underline underline-offset-2"
            viewTransition
          >
            Check available accounts
          </Link>{" "}
          to get account numbers before simulating a payment.
        </p>

        <div className="mt-8 md:mt-16 flex justify-center md:flex-row md:justify-start flex-wrap gap-x-8 gap-y-2">
          {META_INFO.map(({ key, value }) => (
            <div key={key} className="flex items-center gap-2 font-mono text-xs cursor-default">
              <span className="text-text-muted">{key}</span>
              <span className="text-text-secondary">{value}</span>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
