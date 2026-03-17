import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "../_components/logout-button";
import SettingsForm from "./settings-form";

export default async function AdminSettingsPage() {
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

  if (profile?.role !== "super_admin") {
    redirect("/admin");
  }

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
              Super Admin
            </p>
            <h1 className="text-4xl font-bold">Impostazioni sito</h1>
          </div>

          <LogoutButton />
        </div>

        <SettingsForm
          initialValues={{
            id: settings?.id ?? "",
            hero_title: settings?.hero_title ?? "",
            hero_subtitle: settings?.hero_subtitle ?? "",
            hero_location_text: settings?.hero_location_text ?? "",
            company_intro_title: settings?.company_intro_title ?? "",
            company_intro_text: settings?.company_intro_text ?? "",
            cta_title: settings?.cta_title ?? "",
            cta_text: settings?.cta_text ?? "",
            email: settings?.email ?? "",
            phone_giuseppe: settings?.phone_giuseppe ?? "",
            phone_marco: settings?.phone_marco ?? "",
            legal_address: settings?.legal_address ?? "",
          }}
        />
      </div>
    </main>
  );
}
