import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditProjectForm from "./project-edit-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
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

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    redirect("/admin/progetti");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Admin
        </p>
        <h1 className="mb-8 text-4xl font-bold">Modifica progetto</h1>

        <EditProjectForm
          initialValues={{
            id: project.id,
            title: project.title ?? "",
            category: project.category ?? "Ristrutturazioni complete",
            location: project.location ?? "",
            excerpt: project.excerpt ?? "",
            description: project.description ?? "",
            year: project.year ? String(project.year) : "",
            published: Boolean(project.published),
            featured: Boolean(project.featured),
          }}
        />
      </div>
    </main>
  );
}
