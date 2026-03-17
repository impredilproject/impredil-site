import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./_components/logout-button";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
              Dashboard
            </p>
            <h1 className="text-4xl font-bold">Area amministrazione</h1>
          </div>

          <LogoutButton />
        </div>

        <p className="mb-10 text-zinc-300">
          Accesso effettuato come{" "}
          <span className="font-semibold text-white">{user.email}</span>
          {profile?.role ? (
            <>
              {" "}
              — ruolo: <span className="font-semibold text-white">{profile.role}</span>
            </>
          ) : null}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <a
            href="/admin/progetti"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="mb-2 text-2xl font-semibold">Gestione progetti</h2>
            <p className="text-zinc-300">
              Visualizza i progetti esistenti e aggiungine di nuovi.
            </p>
          </a>

          <a
            href="/admin/settings"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <h2 className="mb-2 text-2xl font-semibold">Impostazioni sito</h2>
            <p className="text-zinc-300">
              Modifica testi, slogan e contatti del sito.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
