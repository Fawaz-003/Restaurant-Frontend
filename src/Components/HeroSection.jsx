const HeroSection = ({ data }) => (
  <section className="overflow-hidden rounded-3xl bg-slate-900 text-white">
    <div className="grid gap-10 px-6 py-12 sm:px-12 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <p className="text-xs uppercase tracking-[0.3rem] text-amber-200">
          {data.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          {data.heading}
        </h1>
        <p className="text-base text-slate-200">{data.subheading}</p>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-slate-900 transition hover:bg-amber-400">
            {data.ctaPrimary}
          </button>
          <button className="rounded-full border border-white/30 px-6 py-2 font-semibold text-white transition hover:border-white">
            {data.ctaSecondary}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 rounded-2xl border border-white/10"></div>
        <div className="relative h-full rounded-2xl bg-gradient-to-br from-amber-400/30 via-white/5 to-slate-900/0 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.4rem] text-white/70">
            curated today
          </p>
          <ul className="mt-6 space-y-4 text-sm text-white/80">
            <li>• Chef specials updated every hour</li>
            <li>• Transparent prep & delivery timelines</li>
            <li>• Favorites saved across devices</li>
            <li>• Live support for every order</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

