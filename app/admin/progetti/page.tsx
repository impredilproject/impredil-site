import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "../_components/logout-button";
import { deleteProject } from "./actions";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
              Admin
            </p>
            <h1 className="text-4xl font-bold">Gestione progetti</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin/progetti/nuovo"
              className="rounded-full bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Nuovo progetto
            </a>
            <LogoutButton />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full border-collapse text-left">
            <thead className="bg-white/5 text-sm text-zinc-300">
              <tr>
                <th className="px-6 py-4">Titolo</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Località</th>
                <th className="px-6 py-4">Pubblicato</th>
                <th className="px-6 py-4">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id} className="border-t border-white/10 align-top">
                    <td className="px-6 py-4">{project.title}</td>
                    <td className="px-6 py-4">{project.category}</td>
                    <td className="px-6 py-4">{project.location}</td>
                    <td className="px-6 py-4">
                      {project.published ? "Sì" : "No"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`/admin/progetti/${project.id}/modifica`}
                          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Modifica
                        </a>

                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <button
                            type="submit"
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Elimina
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-6 text-zinc-300" colSpan={5}>
                    Nessun progetto presente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
