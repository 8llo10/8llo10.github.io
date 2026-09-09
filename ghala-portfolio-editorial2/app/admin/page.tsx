import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { isAdmin } from "@/lib/auth";
import { getProjects, getSections, getSettings } from "@/lib/data";
import { hasDatabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage(){
  if(!(await isAdmin())) return <AdminLogin/>;
  const [projects,sections,settings]=await Promise.all([getProjects(),getSections(),getSettings()]);
  return <AdminDashboard projects={projects} sections={sections} settings={settings} dbReady={hasDatabase()}/>;
}
