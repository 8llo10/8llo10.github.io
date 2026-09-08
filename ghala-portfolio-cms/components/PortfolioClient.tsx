"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight, Download, MapPin, Sparkles } from "./Icons";
import ImagePlaceholder from "./ImagePlaceholder";
import type { Project, Section, SiteSettings } from "@/lib/types";

const reveal = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

function External({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const disabled = !href || href.startsWith("YOUR_");
  return disabled ? <span className={`${className} disabled-link`}>{children}</span> : <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>;
}

function SectionShell({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <motion.section id={id} className={className} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .15 }} transition={{ duration: .55, ease: [0.2, .8, .2, 1] }}>{children}</motion.section>;
}

function Hero({ section, settings }: { section: Section; settings: SiteSettings }) {
  const hint = String(section.config?.imageHint || "YOUR PHOTO — 4:5 portrait");
  return (
    <section className="hero-section" id="home">
      <div className="hero-copy">
        <div className="eyebrow"><span />{section.eyebrow}</div>
        <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>{section.title}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .6 }}>{section.body}</motion.p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">View my work <ArrowUpRight size={17}/></a>
          <External href={settings.cv_url} className="btn btn-ghost"><Download size={16}/> Download CV</External>
        </div>
        <div className="social-row">
          <External href={settings.github_url}><Github size={19}/></External>
          <External href={settings.linkedin_url}><Linkedin size={19}/></External>
          <External href={settings.email.startsWith("YOUR_") ? "" : `mailto:${settings.email}`}><Mail size={19}/></External>
        </div>
      </div>
      <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .75, delay: .08 }}>
        <div className="hero-word">PORTFOLIO</div>
        <div className="hero-image-frame">
          {section.image_url ? <img src={section.image_url} alt="Ghala" /> : <ImagePlaceholder hint={hint} ratio="4 / 5" />}
        </div>
        <div className="hero-note">Build.<br/>Solve.<br/><em>Ship.</em></div>
        <div className="hero-chip"><Sparkles size={14}/> {settings.availability}</div>
      </motion.div>
    </section>
  );
}

function Projects({ section, projects }: { section: Section; projects: Project[] }) {
  return (
    <SectionShell id="projects" className="section-block projects-section">
      <div className="section-head">
        <div><div className="eyebrow"><span />{section.eyebrow}</div><h2>{section.title}</h2></div>
        <p>{section.body}</p>
      </div>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <motion.article className={`project-card project-${(i%4)+1}`} key={p.slug} whileHover={{ y: -6 }} transition={{ duration: .2 }}>
            <div className="project-index">0{i+1}</div>
            <div className="project-media">
              {p.image_url ? <img src={p.image_url} alt={`${p.title} project`} /> : <ImagePlaceholder hint={`PROJECT COVER — ${p.title} · recommended 16:10 screenshot`} ratio="16 / 10"/>}
            </div>
            <div className="project-body">
              <div className="project-title-row"><div><h3>{p.title}</h3><span>{p.subtitle}</span></div><External href={p.project_url || p.github_url || ""} className="round-link"><ArrowUpRight size={18}/></External></div>
              <p>{p.description}</p>
              <div className="tag-row">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

function GenericSection({ section }: { section: Section }) {
  const hint = String(section.config?.imageHint || "OPTIONAL SECTION IMAGE");
  const chips = section.type === "skills" ? (section.body || "").split("·").map(s => s.trim()).filter(Boolean) : [];
  return (
    <SectionShell id={section.key} className={`section-block generic-section layout-${section.layout}`}>
      <div className="generic-copy">
        <div className="eyebrow"><span />{section.eyebrow}</div>
        <h2>{section.title}</h2>
        {section.type === "skills" ? <div className="skill-cloud">{chips.map(c => <span key={c}>{c}</span>)}</div> : <p>{section.body}</p>}
      </div>
      {(section.type === "about" || section.image_url) && (
        <div className="generic-media">
          {section.image_url ? <img src={section.image_url} alt={section.title}/> : <ImagePlaceholder hint={hint} ratio="4 / 3"/>}
        </div>
      )}
      {section.type === "experience" && <div className="experience-number">01</div>}
    </SectionShell>
  );
}

function Contact({ section, settings }: { section: Section; settings: SiteSettings }) {
  return (
    <SectionShell id="contact" className="contact-section">
      <div><div className="eyebrow inverse"><span />{section.eyebrow}</div><h2>{section.title}</h2><p>{section.body}</p></div>
      <div className="contact-actions">
        <External href={settings.email.startsWith("YOUR_") ? "" : `mailto:${settings.email}`} className="btn btn-light">Send me a message <ArrowUpRight size={17}/></External>
        <div className="contact-mini"><MapPin size={16}/>{settings.location}</div>
      </div>
    </SectionShell>
  );
}

export default function PortfolioClient({ sections, projects, settings }: { sections: Section[]; projects: Project[]; settings: SiteSettings }) {
  const active = sections.filter(s => s.enabled).sort((a,b) => a.sort_order - b.sort_order);
  const hero = active.find(s => s.type === "hero");
  return (
    <main className="site-shell">
      <nav className="top-nav">
        <a className="brand" href="#home"><span>G</span>{settings.name.split(" ")[0]}</a>
        <div className="nav-links"><a href="#projects">Projects</a><a href="#about">About</a><a href="#experience">Experience</a><a href="#skills">Skills</a></div>
        <a href="#contact" className="nav-cta">Let&apos;s talk <ArrowUpRight size={15}/></a>
      </nav>
      {hero && <Hero section={hero} settings={settings}/>}      
      <div className="stats-strip">
        <div><strong>6+</strong><span>Projects</span></div>
        <div><strong>307+</strong><span>GitHub contributions</span></div>
        <div><strong>B.Sc.</strong><span>Software Engineering</span></div>
        <div><strong>Makkah</strong><span>Saudi Arabia</span></div>
      </div>
      {active.filter(s => s.type !== "hero").map(section => {
        if (section.type === "projects") return <Projects key={section.key} section={section} projects={projects}/>;
        if (section.type === "contact") return <Contact key={section.key} section={section} settings={settings}/>;
        return <GenericSection key={section.key} section={section}/>;
      })}
      <footer><span>© {new Date().getFullYear()} {settings.name}</span><a href="/admin">Admin</a></footer>
    </main>
  );
}
