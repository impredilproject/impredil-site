import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProgettoDettaglioPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) {
    notFound();
  }

  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="bg-zinc-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">{project.category}</p>
          <h1 className="text-4xl font-bold md:text-5xl">{project.title}</h1>
          <p className="mt-4 text-zinc-300">
            {project.location}
            {project.year ? ` • ${project.year}` : ""}
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          {project.cover_image ? (
            <img src={project.cover_image} alt={project.title} className="mb-10 h-[420px] w-full rounded-2xl object-cover" />
          ) : (
            <div className="mb-10 h-[420px] w-full rounded-2xl bg-zinc-200" />
          )}

          <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Descrizione del progetto</h2>
              <p className="whitespace-pre-line leading-8 text-zinc-700">{project.description}</p>
            </div>

            <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <h3 className="mb-4 text-xl font-semibold">Informazioni</h3>
              <div className="space-y-3 text-sm text-zinc-700">
                <p><span className="font-semibold">Categoria:</span> {project.category}</p>
                <p><span className="font-semibold">Località:</span> {project.location}</p>
                {project.year && <p><span className="font-semibold">Anno:</span> {project.year}</p>}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {images && images.length > 0 && (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-2xl font-semibold">Galleria progetto</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {images.map((image) => (
                <img key={image.id} src={image.image_url} alt={project.title} className="h-80 w-full rounded-2xl object-cover" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Hai un lavoro da realizzare o ristrutturare?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-zinc-300">Contatta ImpreEdil &amp; Project S.r.l. per informazioni, sopralluoghi e preventivi.</p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="https://wa.me/393395730158" className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Contatta Giuseppe</a>
            <a href="https://wa.me/393925332034" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20">Contatta Marco</a>
            <a href="mailto:impredilproject@gmail.com" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">Scrivi via email</a>
          </div>
        </div>
      </section>
    </main>
  );
}
