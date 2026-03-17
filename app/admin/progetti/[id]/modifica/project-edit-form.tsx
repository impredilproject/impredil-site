"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

type FormValues = {
  id: string;
  title: string;
  category: string;
  location: string;
  excerpt: string;
  description: string;
  year: string;
  published: boolean;
  featured: boolean;
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

export default function EditProjectForm({
  initialValues,
}: {
  initialValues: FormValues;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState<FormValues>(initialValues);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    let imageUrl: string | null = null;

    if (image) {
      const sanitizedName = image.name.replace(/\s+/g, "-").toLowerCase();
      const fileName = `${Date.now()}-${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from("projects")
        .upload(fileName, image);

      if (uploadError) {
        setLoading(false);
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("projects").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const payload: any = {
      title: form.title,
      slug: slugify(form.title),
      category: form.category,
      location: form.location,
      excerpt: form.excerpt,
      description: form.description,
      year: form.year ? Number(form.year) : null,
      published: form.published,
      featured: form.featured,
    };

    if (imageUrl) {
      payload.cover_image = imageUrl;
    }

    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", form.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Progetto aggiornato correttamente.");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8"
    >
      <div>
        <label className="mb-2 block text-sm text-zinc-300">Titolo</label>
        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Categoria</label>
        <select
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        >
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Località</label>
        <input
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Descrizione breve</label>
        <input
          value={form.excerpt}
          onChange={(e) => updateField("excerpt", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Descrizione completa</label>
        <textarea
          rows={6}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Nuova copertina</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full text-sm text-zinc-300"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">Anno</label>
        <input
          type="number"
          value={form.year}
          onChange={(e) => updateField("year", e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => updateField("published", e.target.checked)}
          />
          Pubblicato
        </label>

        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
          />
          In evidenza
        </label>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Salvataggio..." : "Salva modifiche"}
        </button>

        <a
          href="/admin/progetti"
          className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
        >
          Torna ai progetti
        </a>
      </div>
    </form>
  );
}
