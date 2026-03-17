import { createClient } from "@/lib/supabase/server";

export default async function ProgettiPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="bg-zinc-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Progetti</p>
          <h1 className="text-4xl font-bold md:text-5xl">Tutti i nostri lavori</h1>
          <p className="mt-4 max-w-2xl text-zinc-300">
            Una selezione dei progetti realizzati da ImpreEdil &amp; Project S.r.l., tra ristrutturazioni, nuove costruzioni e interventi edili.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {projects && projects.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <a key={project.id} href={`/progetti/${project.slug}`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1">
                  {project.cover_image ? (
                    <img src={project.cover_image} alt={project.title} className="h-64 w-full object-cover" />
                  ) : (
                    <div className="h-64 bg-zinc-200" />
                  )}

                  <div className="p-6">
                    <p className="mb-2 text-sm text-red-600">{project.category} • {project.location}</p>
                    <h2 className="mb-3 text-2xl font-semibold">{project.title}</h2>
                    <p className="text-sm text-zinc-600">{project.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">
              <h2 className="text-2xl font-semibold">Nessun progetto disponibile</h2>
              <p className="mt-3 text-zinc-600">I progetti pubblicati compariranno qui.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
