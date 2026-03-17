"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

export default function NewProjectPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const slug = slugify(title);

    const { data: project } = await supabase
      .from("projects")
      .insert({ title, slug, location, excerpt, description, created_by: user.id })
      .select()
      .single();

    if (images.length > 0 && project) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileName = `${Date.now()}-${i}-${file.name}`;

        await supabase.storage.from("projects").upload(fileName, file);

        const { data } = supabase.storage.from("projects").getPublicUrl(fileName);

        await supabase.from("project_images").insert({
          project_id: project.id,
          image_url: data.publicUrl,
          sort_order: i,
        });
      }
    }

    router.push("/admin/progetti");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Admin
        </p>
        <h1 className="mb-8 text-4xl font-bold">Nuovo progetto</h1>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Titolo</label>
            <input placeholder="Titolo" onChange={(e)=>setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Località</label>
            <input placeholder="Località" onChange={(e)=>setLocation(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Descrizione breve</label>
            <input placeholder="Descrizione breve" onChange={(e)=>setExcerpt(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Descrizione completa</label>
            <textarea placeholder="Descrizione" onChange={(e)=>setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none min-h-40" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Galleria immagini</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e)=>setImages(Array.from(e.target.files||[]))}
              className="w-full text-sm text-zinc-300"
            />
          </div>

          {error ? (
            <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
            Salva
          </button>
        </form>
      </div>
    </main>
  );
}
