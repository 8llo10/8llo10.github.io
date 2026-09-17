'use client';

import { ArrowLeft, ArrowUpRight, Bot, Braces, Check, Code2, Database, ExternalLink, Layers3, Linkedin, MessageCircle, Send, Sparkles, Workflow } from 'lucide-react';
import './services.css';

const services = [
  { icon: <Code2 />, title: 'تنفيذ مشروع جديد', text: 'نحوّل الفكرة إلى مشروع فعلي من التخطيط إلى النسخة الجاهزة للتجربة.' },
  { icon: <Layers3 />, title: 'تطوير مشروع قائم', text: 'إكمال مشروع متوقف، إضافة خصائص جديدة أو إعادة ترتيب الأجزاء التقنية.' },
  { icon: <Braces />, title: 'مواقع ومنصات وتطبيقات', text: 'واجهات وتجارب استخدام مرتبطة بخدمات خلفية تعمل فعليًا.' },
  { icon: <Database />, title: 'Backend وقواعد بيانات', text: 'منطق النظام، APIs، قواعد البيانات، تسجيل الدخول والصلاحيات.' },
  { icon: <Bot />, title: 'خصائص ذكاء اصطناعي', text: 'إضافة AI عندما يكون له دور حقيقي داخل المنتج وليس كميزة شكلية.' },
  { icon: <Workflow />, title: 'ربط وأتمتة الأنظمة', text: 'ربط خدمات وأنظمة مختلفة وبناء تدفقات عمل تقلل الخطوات اليدوية.' },
];

const process = [
  ['01', 'الفكرة', 'ترسل الفكرة حتى لو كانت غير مرتبة بالكامل.'],
  ['02', 'تحديد المطلوب', 'نحوّلها إلى نطاق واضح وميزات أساسية وأولويات.'],
  ['03', 'التنفيذ', 'تنفيذ كامل أو مساهمة تقنية معك خطوة بخطوة.'],
  ['04', 'التجربة والتسليم', 'نسخة قابلة للتجربة مع شرح واضح لما تم بناؤه.'],
];

export default function ServicesPage() {
  return (
    <main className="servicePage" dir="rtl">
      <nav className="serviceNav">
        <a className="serviceMark" href="/">G.</a>
        <div className="serviceNavLinks">
          <a href="#services">الخدمات</a>
          <a href="#process">طريقة العمل</a>
          <a href="#contact">تواصل</a>
        </div>
        <a className="portfolioBtn" href="/" target="_self">البورتفوليو <ArrowUpRight size={15}/></a>
      </nav>

      <section className="serviceHero">
        <div className="serviceNoise" />
        <div className="serviceTopline"><span>SOFTWARE · FULL-STACK · SYSTEMS</span><span>01 / SERVICES</span></div>
        <div className="heroGrid">
          <div className="heroCopy">
            <span className="eyebrowAr">تنفيذ وتطوير المشاريع البرمجية</span>
            <h1>عندك فكرة؟<br/><i>نحوّلها إلى مشروع.</i></h1>
            <p>سواء عندك فكرة من الصفر، مشروع متوقف، أو تحتاج شخص تقني يشتغل معك على التنفيذ — أقدر أساعدك بشكل واضح وعملي من البداية للنهاية.</p>
            <div className="heroActions">
              <a className="primaryCta" href="https://wa.me/966560602239?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%B9%D9%86%D8%AF%D9%8A%20%D9%81%D9%83%D8%B1%D8%A9%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D9%88%D8%A3%D8%A8%D8%BA%D9%89%20%D8%A3%D8%B9%D8%B1%D9%81%20%D8%A5%D9%85%D9%83%D8%A7%D9%86%D9%8A%D8%A9%20%D8%AA%D9%86%D9%81%D9%8A%D8%B0%D9%87%D8%A7" target="_blank" rel="noreferrer">أرسل فكرتك على واتساب <MessageCircle size={18}/></a>
              <a className="secondaryCta" href="#services">شوف الخدمات <ArrowLeft size={17}/></a>
            </div>
          </div>

          <div className="heroBoard" aria-hidden="true">
            <div className="boardHead"><span/><span/><span/><b>PROJECT / BUILD</b></div>
            <div className="boardBody">
              <div className="boardStatus"><small>STATUS</small><strong>READY TO BUILD</strong></div>
              <div className="boardLine"><span>Idea</span><i className="active"/></div>
              <div className="boardLine"><span>Scope</span><i className="active"/></div>
              <div className="boardLine"><span>Build</span><i/></div>
              <div className="boardLine"><span>Launch</span><i/></div>
              <div className="miniCode"><code>idea → scope → build → ship</code></div>
            </div>
          </div>
        </div>
        <div className="serviceRibbon"><span>موقع</span><b>✦</b><span>منصة</span><b>✦</b><span>تطبيق</span><b>✦</b><span>نظام داخلي</span><b>✦</b><span>ذكاء اصطناعي</span><b>✦</b><span>أتمتة</span></div>
      </section>

      <section id="services" className="servicesSection">
        <div className="sectionMeta"><span>02 / WHAT I BUILD</span><p>الخدمات</p></div>
        <div className="sectionTitleRow">
          <h2>مو لازم تعرف<br/><i>المصطلحات التقنية.</i></h2>
          <p>يكفي ترسل لي فكرتك والمشكلة اللي تبغى تحلها. أحدد معك وش يحتاج المشروع فعلًا، بدون تعقيد أو حشو تقني.</p>
        </div>
        <div className="serviceCards">
          {services.map((item, index) => (
            <article className="serviceCard" key={item.title}>
              <div className="serviceCardTop"><span>{String(index + 1).padStart(2,'0')}</span>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="processSection">
        <div className="sectionMeta light"><span>03 / PROCESS</span><p>طريقة العمل</p></div>
        <div className="processIntro"><h2>من أول رسالة<br/>إلى نسخة <i>تشتغل.</i></h2><p>تقدر تطلب تنفيذ كامل، جزء محدد، أو مساهمة تقنية مستمرة معك في المشروع.</p></div>
        <div className="processList">
          {process.map(([num,title,text]) => <div className="processItem" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p><Check size={22}/></div>)}
        </div>
      </section>

      <section className="fitSection">
        <div className="fitLabel"><Sparkles size={17}/> مناسب لك إذا...</div>
        <div className="fitGrid">
          <p>عندك فكرة وما تعرف من وين تبدأ</p>
          <p>مشروعك موجود لكنه متوقف أو فيه مشاكل</p>
          <p>تحتاج مطور ينفذ جزء تقني محدد</p>
          <p>تبغى شخص يشتغل معك كمساهم تقني</p>
          <p>عندك مسابقة أو هاكثون وتحتاج نموذج أولي</p>
          <p>تحتاج مشروع مرتب وقابل للتجربة والعرض</p>
        </div>
      </section>

      <section id="contact" className="contactSection">
        <div className="contactKicker">04 / START A PROJECT</div>
        <h2>أرسل الفكرة.<br/><i>ونبدأ من هناك.</i></h2>
        <p className="contactLead">أرسل فكرة المشروع + المطلوب + الموعد المتوقع، وأعطيك تصور واضح عن إمكانية التنفيذ والخطوة التالية.</p>
        <div className="contactCards">
          <a className="contactCard whatsapp" href="https://wa.me/966560602239?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%B9%D9%86%D8%AF%D9%8A%20%D9%81%D9%83%D8%B1%D8%A9%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9" target="_blank" rel="noreferrer"><MessageCircle/><div><small>الأسرع للتواصل</small><strong>WhatsApp</strong></div><ArrowUpRight/></a>
          <a className="contactCard" href="https://www.linkedin.com/in/ghala-abdullah-alameer-541733373" target="_blank" rel="noreferrer"><Linkedin/><div><small>الملف المهني</small><strong>LinkedIn</strong></div><ArrowUpRight/></a>
          <a className="contactCard" href="https://8llo10.github.io/" target="_blank" rel="noreferrer"><ExternalLink/><div><small>الأعمال السابقة</small><strong>Portfolio</strong></div><ArrowUpRight/></a>
          <div className="contactCard disabled" aria-disabled="true"><Send/><div><small>أضيفي اسم المستخدم لتفعيله</small><strong>Telegram</strong></div><span className="pendingDot"/></div>
        </div>
        <div className="contactFooter"><span>BUILD SOMETHING USEFUL.</span><span>© 2026</span></div>
      </section>
    </main>
  );
}
