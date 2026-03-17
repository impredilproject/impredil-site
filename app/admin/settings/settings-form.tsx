"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SettingsValues = {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_location_text: string;
  company_intro_title: string;
  company_intro_text: string;
  cta_title: string;
  cta_text: string;
  email: string;
  phone_giuseppe: string;
  phone_marco: string;
  legal_address: string;
};

export default function SettingsForm({
  initialValues,
}: {
  initialValues: SettingsValues;
}) {
  const supabase = createClient();

  const [form, setForm] = useState<SettingsValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      hero_title: form.hero_title,
      hero_subtitle: form.hero_subtitle,
      hero_location_text: form.hero_location_text,
      company_intro_title: form.company_intro_title,
      company_intro_text: form.company_intro_text,
      cta_title: form.cta_title,
      cta_text: form.cta_text,
      email: form.email,
      phone_giuseppe: form.phone_giuseppe,
      phone_marco: form.phone_marco,
      legal_address: form.legal_address,
    };

    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", form.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Impostazioni salvate correttamente.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Titolo hero</label>
          <input
            value={form.hero_title}
            onChange={(e) => updateField("hero_title", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Sottotitolo hero</label>
          <textarea
            rows={3}
            value={form.hero_subtitle}
            onChange={(e) => updateField("hero_subtitle", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Testo localizzazione hero</label>
          <input
            value={form.hero_location_text}
            onChange={(e) => updateField("hero_location_text", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Titolo introduzione azienda</label>
          <input
            value={form.company_intro_title}
            onChange={(e) => updateField("company_intro_title", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Testo introduzione azienda</label>
          <textarea
            rows={5}
            value={form.company_intro_text}
            onChange={(e) => updateField("company_intro_text", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Titolo call to action</label>
          <input
            value={form.cta_title}
            onChange={(e) => updateField("cta_title", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Testo call to action</label>
          <textarea
            rows={4}
            value={form.cta_text}
            onChange={(e) => updateField("cta_text", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Sede legale</label>
          <input
            value={form.legal_address}
            onChange={(e) => updateField("legal_address", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Telefono Giuseppe</label>
          <input
            value={form.phone_giuseppe}
            onChange={(e) => updateField("phone_giuseppe", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Telefono Marco</label>
          <input
            value={form.phone_marco}
            onChange={(e) => updateField("phone_marco", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>
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

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Salvataggio..." : "Salva impostazioni"}
      </button>
    </form>
  );
}
