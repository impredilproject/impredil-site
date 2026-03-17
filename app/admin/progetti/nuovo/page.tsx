"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const categories = [
  "Ristrutturazioni complete",
  "Nuove costruzioni",
  "Rifacimento facciate",
  "Cappotto termico",
  "Cartongesso",
  "Impermeabilizzazioni",
  "Tetti e coperture",
  "Pavimentazioni",
  "Bagni",
  "Demolizioni",
  "Manutenzioni edili",
  "Chiavi in mano",
];

export default function NewProjectPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Utente non autenticato.");
      setLoading(false);
      return;
    }

    if (!title.trim()) {
      setError("Il titolo è obbligatorio.");
      setLoading(false);
      return;
    }

    if (!location.trim()) {
      setError("La località è obbligatoria.");
      setLoading(false);
      return;
    }

    const slug = slugify(title);

    let coverImageUrl: string | null = null;
    const galleryImageUrls: string[] = [];

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const sanitizedName = file.name.replace(/\s+/g, "-").toLowerCase();
        const fileName = `${Date.now()}-${i}-${sanitizedName}`;

        const { error: uploadError } = await supabase.storage
          .from("projects")
          .upload(fileName, file);

        if (uploadError) {
          setError(uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from("projects").getPublicUrl(fileName);
        galleryImageUrls.push(data.publicUrl);

        if (i === 0) {
          coverImageUrl = data.publicUrl;
        }
      }
    }

    const { data: createdProject, error } = await supabase
      .from("projects")
      .insert({
        title,
        slug,
        category,
        location,
        excerpt: excerpt.trim() || null,
        description: description.trim() || null,
        year: year ? Number(year) : null,
        published,
        featured,
        created_by: user.id,
        cover_image: coverImageUrl,
      })
      .select("id")
      .single();

    if (error || !createdProject) {
      setError(error?.message || "Errore durante il salvataggio del progetto.");
      setLoading(false);
      return;
    }

    if (galleryImageUrls.length > 0) {
      const rows = galleryImageUrls.map((imageUrl, index) => ({
        project_id: createdProject.id,
        image_url: imageUrl,
        sort_order: index,
      }));

      const { error: galleryError } = await supabase
        .from("project_images")
        .insert(rows);

      if (galleryError) {
        setError(galleryError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/admin/progetti");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Admin
        </p>
        <h1 className="mb-8 text-4xl font-bold">Nuovo progetto</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8"
        >
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Titolo *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              placeholder="Es. Ristrutturazione appartamento moderno"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Categoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Località *</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              placeholder="Es. Catanzaro"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Descrizione breve
            </label>
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              placeholder="Facoltativa"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Descrizione completa
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              placeholder="Facoltativa"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Anno</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              placeholder="Facoltativo"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Immagini progetto
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="w-full text-sm text-zinc-300"
            />
            <p className="mt-2 text-xs text-zinc-400">
              La prima immagine verrà usata come copertina del progetto.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              Pubblicato
            </label>

            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              In evidenza
            </label>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Salvataggio..." : "Salva progetto"}
          </button>
        </form>
      </div>
    </main>
  );
}
