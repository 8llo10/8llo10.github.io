import PortfolioClient from "@/components/PortfolioClient";
import { getProjects, getSections, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, projects, settings] = await Promise.all([getSections(), getProjects(), getSettings()]);
  return <PortfolioClient sections={sections} projects={projects} settings={settings} />;
}
