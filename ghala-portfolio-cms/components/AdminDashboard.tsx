"use client";

import { useMemo, useState } from "react";
import { Plus, Save, LogOut, ChevronUp, ChevronDown, Trash2, ImagePlus, ExternalLink } from "lucide-react";
import type { Project, Section, SiteSettings, SectionLayout, SectionType } from "@/lib/types";

type Props = { projects: Project[]; sections: Section[]; settings: SiteSettings; dbReady: boolean };

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

export default function AdminDashboard({ projects: initialProjects, sections: initialSections, settings: initialSettings, dbReady }: Props) {
  const [tab, setTab] = useState<"projects"|"sections"|"settings">("projects");
  const [projects, setProjects] = useState(initialProjects);
  const [sections, setSections] = useState(initialSections.sort((a,b)=>a.sort_order-b.sort_order));
  const [settings, setSettings] = useState(initialSettings);
  const [status, setStatus] = useState("");

  const nextOrder = useMemo(() => Math.max(0, ...sections.map(s=>s.sort_order)) + 1, [sections]);

  const saveProject = async (p: Project, i: number) => {
    try { setStatus("Saving project…"); const data = await postJSON("/api/admin/projects", { action: "upsert", project: p }); const copy=[...projects]; copy[i]=data.project; setProjects(copy); setStatus("Project saved ✓"); }
    catch(e){ setStatus((e as Error).message); }
  };
  const deleteProject = async (p: Project, i: number) => {
    if (!confirm(`Delete ${p.title}?`)) return;
    try { setStatus("Deleting…"); await postJSON("/api/admin/projects", { action:"delete", id:p.id, slug:p.slug }); setProjects(projects.filter((_,idx)=>idx!==i)); setStatus("Project deleted ✓"); }
    catch(e){ setStatus((e as Error).message); }
  };
  const addProject = () => setProjects([...projects, { slug:`project-${Date.now()}`, title:"New Project", subtitle:"", description:"Describe what you built and why it matters.", image_url:"", project_url:"", github_url:"", tags:["Next.js"], featured:true, sort_order:projects.length+1 }]);

  const saveSection = async (s: Section, i:number) => {
    try { setStatus("Saving section…"); const data = await postJSON("/api/admin/sections", { action:"upsert", section:s }); const copy=[...sections]; copy[i]=data.section; setSections(copy); setStatus("Section saved ✓"); }
    catch(e){ setStatus((e as Error).message); }
  };
  const addSection = () => setSections([...sections, { key:`custom-${Date.now()}`, type:"custom", title:"New section", eyebrow:"NEW SECTION", body:"Add the content you want visitors to see.", image_url:"", layout:"bento", sort_order:nextOrder, enabled:true, config:{ imageHint:"OPTIONAL SECTION IMAGE" } }]);
  const deleteSection = async (s:Section, i:number) => {
    if (!confirm(`Delete section ${s.title}?`)) return;
    try { setStatus("Deleting…"); await postJSON("/api/admin/sections", { action:"delete", id:s.id, key:s.key }); setSections(sections.filter((_,idx)=>idx!==i)); setStatus("Section deleted ✓"); }
    catch(e){ setStatus((e as Error).message); }
  };
  const moveSection = (i:number, delta:number) => {
    const j=i+delta; if(j<0||j>=sections.length) return;
    const copy=[...sections]; [copy[i],copy[j]]=[copy[j],copy[i]]; copy.forEach((s,idx)=>s.sort_order=idx+1); setSections(copy);
  };
  const saveSettings = async () => {
    try { setStatus("Saving settings…"); await postJSON("/api/admin/site-settings", settings); setStatus("Settings saved ✓"); }
    catch(e){ setStatus((e as Error).message); }
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>G</span><div><strong>Portfolio CMS</strong><small>Owner mode</small></div></div>
        <button className={tab==="projects"?"active":""} onClick={()=>setTab("projects")}>Projects</button>
        <button className={tab==="sections"?"active":""} onClick={()=>setTab("sections")}>Sections</button>
        <button className={tab==="settings"?"active":""} onClick={()=>setTab("settings")}>Site settings</button>
        <a href="/" target="_blank">Open portfolio <ExternalLink size={15}/></a>
        <form action="/api/admin/logout" method="post"><button className="logout"><LogOut size={15}/> Log out</button></form>
      </aside>
      <section className="admin-main">
        <div className="admin-top"><div><p>OWNER DASHBOARD</p><h1>Edit without touching code.</h1></div><div className={`db-pill ${dbReady?"ok":"warn"}`}>{dbReady?"Database connected":"Demo mode — connect Supabase to save"}</div></div>
        {status && <div className="admin-status">{status}</div>}

        {tab==="projects" && <>
          <div className="admin-section-title"><div><h2>Projects</h2><p>Add an image, demo/GitHub link, tags and description directly here.</p></div><button className="admin-primary" onClick={addProject}><Plus size={16}/> Add project</button></div>
          <div className="admin-cards">{projects.map((p,i)=><div className="admin-card" key={`${p.slug}-${i}`}>
            <div className="admin-card-head"><strong>{String(i+1).padStart(2,"0")} · {p.title}</strong><button className="icon-danger" onClick={()=>deleteProject(p,i)}><Trash2 size={16}/></button></div>
            <div className="form-grid">
              <label>Project title<input value={p.title} onChange={e=>{const c=[...projects]; c[i]={...p,title:e.target.value}; setProjects(c)}}/></label>
              <label>Slug<input value={p.slug} onChange={e=>{const c=[...projects]; c[i]={...p,slug:e.target.value}; setProjects(c)}}/></label>
              <label>Subtitle<input value={p.subtitle||""} onChange={e=>{const c=[...projects]; c[i]={...p,subtitle:e.target.value}; setProjects(c)}}/></label>
              <label>Project / Live URL<input value={p.project_url||""} placeholder="https://..." onChange={e=>{const c=[...projects]; c[i]={...p,project_url:e.target.value}; setProjects(c)}}/></label>
              <label>GitHub URL<input value={p.github_url||""} placeholder="https://github.com/..." onChange={e=>{const c=[...projects]; c[i]={...p,github_url:e.target.value}; setProjects(c)}}/></label>
              <label>Tags — comma separated<input value={p.tags.join(", ")} onChange={e=>{const c=[...projects]; c[i]={...p,tags:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)}; setProjects(c)}}/></label>
              <label className="wide">Description<textarea value={p.description} onChange={e=>{const c=[...projects]; c[i]={...p,description:e.target.value}; setProjects(c)}}/></label>
              <label className="wide">Project image URL<input value={p.image_url||""} placeholder="Paste a URL or upload below" onChange={e=>{const c=[...projects]; c[i]={...p,image_url:e.target.value}; setProjects(c)}}/></label>
              <label className="upload-field"><ImagePlus size={16}/> Upload project image<input type="file" accept="image/*" onChange={async e=>{const f=e.target.files?.[0]; if(!f)return; try{setStatus("Uploading image…"); const url=await uploadImage(f); const c=[...projects]; c[i]={...p,image_url:url}; setProjects(c); setStatus("Image uploaded ✓")}catch(err){setStatus((err as Error).message)}}}/></label>
            </div>
            <button className="admin-primary" onClick={()=>saveProject(p,i)}><Save size={16}/> Save project</button>
          </div>)}</div>
        </>}

        {tab==="sections" && <>
          <div className="admin-section-title"><div><h2>Page sections</h2><p>Choose the section type, its visual layout and exact order on the page.</p></div><button className="admin-primary" onClick={addSection}><Plus size={16}/> Add section</button></div>
          <div className="admin-cards">{sections.map((s,i)=><div className="admin-card" key={`${s.key}-${i}`}>
            <div className="admin-card-head"><strong>{String(i+1).padStart(2,"0")} · {s.title}</strong><div className="reorder"><button onClick={()=>moveSection(i,-1)}><ChevronUp size={16}/></button><button onClick={()=>moveSection(i,1)}><ChevronDown size={16}/></button><button className="icon-danger" onClick={()=>deleteSection(s,i)}><Trash2 size={16}/></button></div></div>
            <div className="form-grid">
              <label>Section title<input value={s.title} onChange={e=>{const c=[...sections]; c[i]={...s,title:e.target.value}; setSections(c)}}/></label>
              <label>Eyebrow<input value={s.eyebrow||""} onChange={e=>{const c=[...sections]; c[i]={...s,eyebrow:e.target.value}; setSections(c)}}/></label>
              <label>Type<select value={s.type} onChange={e=>{const c=[...sections]; c[i]={...s,type:e.target.value as SectionType}; setSections(c)}}><option value="hero">Hero</option><option value="projects">Projects</option><option value="about">About</option><option value="experience">Experience</option><option value="skills">Skills</option><option value="contact">Contact</option><option value="custom">Custom</option></select></label>
              <label>Layout<select value={s.layout} onChange={e=>{const c=[...sections]; c[i]={...s,layout:e.target.value as SectionLayout}; setSections(c)}}><option value="split">Split</option><option value="bento">Bento</option><option value="editorial">Editorial</option><option value="grid">Grid</option><option value="full">Full width</option></select></label>
              <label>Position<input type="number" min="1" value={s.sort_order} onChange={e=>{const c=[...sections]; c[i]={...s,sort_order:Number(e.target.value)}; setSections(c)}}/></label>
              <label className="check-label"><input type="checkbox" checked={s.enabled} onChange={e=>{const c=[...sections]; c[i]={...s,enabled:e.target.checked}; setSections(c)}}/> Visible to visitors</label>
              <label className="wide">Body / content<textarea value={s.body||""} onChange={e=>{const c=[...sections]; c[i]={...s,body:e.target.value}; setSections(c)}}/></label>
              <label className="wide">Image URL<input value={s.image_url||""} placeholder="Optional" onChange={e=>{const c=[...sections]; c[i]={...s,image_url:e.target.value}; setSections(c)}}/></label>
              <label className="upload-field"><ImagePlus size={16}/> Upload section image<input type="file" accept="image/*" onChange={async e=>{const f=e.target.files?.[0]; if(!f)return; try{setStatus("Uploading image…"); const url=await uploadImage(f); const c=[...sections]; c[i]={...s,image_url:url}; setSections(c); setStatus("Image uploaded ✓")}catch(err){setStatus((err as Error).message)}}}/></label>
            </div>
            <button className="admin-primary" onClick={()=>saveSection(s,i)}><Save size={16}/> Save section</button>
          </div>)}</div>
        </>}

        {tab==="settings" && <>
          <div className="admin-section-title"><div><h2>Site settings</h2><p>Links and identity details used throughout the public portfolio.</p></div></div>
          <div className="admin-card"><div className="form-grid">
            {([['name','Name'],['role','Role'],['location','Location'],['email','Email'],['linkedin_url','LinkedIn URL'],['github_url','GitHub URL'],['cv_url','CV URL'],['availability','Availability text']] as [keyof SiteSettings,string][]).map(([k,label])=><label key={k} className={k==='availability'?"wide":""}>{label}<input value={settings[k]} onChange={e=>setSettings({...settings,[k]:e.target.value})}/></label>)}
          </div><button className="admin-primary" onClick={saveSettings}><Save size={16}/> Save settings</button></div>
        </>}
      </section>
    </main>
  );
}
