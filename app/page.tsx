import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: settings } = await supabase.from("site_settings").select("*").single();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="text-lg font-bold text-white">ImpreEdil &amp; Project</a>
          <nav className="hidden gap-6 md:flex">
            <a href="#servizi" className="text-sm text-white/90 hover:text-white">Servizi</a>
            <a href="#progetti" className="text-sm text-white/90 hover:text-white">Progetti</a>
            <a href="#chi-siamo" className="text-sm text-white/90 hover:text-white">Chi siamo</a>
            <a href="#contatti" className="text-sm text-white/90 hover:text-white">Contatti</a>
          </nav>
          <a href={`mailto:${settings?.email ?? "impredilproject@gmail.com"}`} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Richiedi preventivo
          </a>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-red-500">ImpreEdil &amp; Project S.r.l.</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">{settings?.hero_title ?? "Diamo forma ai tuoi progetti"}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-zinc-200 md:text-lg">
            {settings?.hero_subtitle ?? "Ristrutturazioni, costruzioni e interventi edili seguiti con serietà, precisione e attenzione ai dettagli."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`https://wa.me/39${settings?.phone_giuseppe ?? "3395730158"}`} className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700">Contatta Giuseppe</a>
            <a href={`https://wa.me/39${settings?.phone_marco ?? "3925332034"}`} className="rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20">Contatta Marco</a>
          </div>

          <p className="mt-8 text-sm text-zinc-300">
            {settings?.hero_location_text ?? "Sede legale a Sellia Marina, operativi in Calabria e disponibili anche fuori regione."}
          </p>
        </div>
      </section>

      <section id="chi-siamo" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">ImpreEdil &amp; Project S.r.l.</p>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">{settings?.company_intro_title ?? "Edilizia, ristrutturazione e lavori chiavi in mano"}</h2>
          </div>
          <div>
            <p className="mb-4 text-zinc-700">
              {settings?.company_intro_text ?? "ImpreEdil & Project S.r.l. è un’impresa specializzata in ristrutturazioni complete, nuove costruzioni e interventi edili per abitazioni, edifici e spazi da valorizzare."}
            </p>
            <p className="text-zinc-700">{settings?.legal_address ?? "Sellia Marina, Catanzaro, Calabria"}</p>
          </div>
        </div>
      </section>

      <section id="servizi" className="bg-zinc-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">I nostri servizi</p>
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">Soluzioni edilizie complete</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["Ristrutturazioni complete","Nuove costruzioni","Rifacimento facciate","Cappotto termico","Cartongesso","Impermeabilizzazioni","Tetti e coperture","Pavimentazioni","Bagni","Demolizioni","Manutenzioni edili","Chiavi in mano"].map((service) => (
              <div key={service} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="progetti" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Progetti recenti</p>
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">Alcuni lavori realizzati o in corso</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {projects && projects.length > 0 ? projects.map((project) => (
              <a key={project.id} href={`/progetti/${project.slug}`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1">
                {project.cover_image ? <img src={project.cover_image} alt={project.title} className="h-56 w-full object-cover" /> : <div className="h-56 bg-zinc-200" />}
                <div className="p-6">
                  <p className="mb-2 text-sm text-red-600">{project.category} • {project.location}</p>
                  <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                  <p className="text-sm text-zinc-600">{project.excerpt}</p>
                </div>
              </a>
            )) : [1,2,3].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="h-56 bg-zinc-200" />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">Progetto esempio {item}</h3>
                  <p className="text-sm text-zinc-600">Qui compariranno i progetti caricati dall’admin.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href="/progetti" className="inline-flex rounded-full bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-black">Vedi tutti i progetti</a>
          </div>
        </div>
      </section>

      <section id="contatti" className="bg-zinc-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Contatti</p>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">{settings?.cta_title ?? "Hai un lavoro da realizzare o ristrutturare?"}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-zinc-300">
            {settings?.cta_text ?? "Contatta ImpreEdil & Project S.r.l. per informazioni, sopralluoghi e preventivi."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`https://wa.me/39${settings?.phone_giuseppe ?? "3395730158"}`} className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Contatta Giuseppe</a>
            <a href={`https://wa.me/39${settings?.phone_marco ?? "3925332034"}`} className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20">Contatta Marco</a>
            <a href={`mailto:${settings?.email ?? "impredilproject@gmail.com"}`} className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">Scrivi via email</a>
          </div>
        </div>
      </section>
    </main>
  );
}
