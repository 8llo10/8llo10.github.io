'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, Bot, Braces, Code2, Database, ExternalLink, Linkedin, MessageCircle, Send } from 'lucide-react';
import './services.css';

const services = [
  { icon: <Code2 />, title: 'تنفيذ مشروع جديد', text: 'من الفكرة إلى نسخة جاهزة للتجربة.' },
  { icon: <Braces />, title: 'تطوير مشروع قائم', text: 'إكماله، إصلاحه أو إضافة خصائص جديدة.' },
  { icon: <Database />, title: 'أنظمة ومنصات وتطبيقات', text: 'واجهة، Backend، قاعدة بيانات وصلاحيات.' },
  { icon: <Bot />, title: 'AI وربط الخدمات', text: 'ذكاء اصطناعي وAPIs وأتمتة عند حاجة المشروع.' },
];

export default function ServicesPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');

  function sendTelegramRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = [
      'مرحباً، عندي طلب مشروع من صفحة الخدمات:',
      '',
      `الاسم: ${name}`,
      `نوع المشروع: ${type}`,
      `فكرة المشروع / المطلوب: ${details}`,
      `الموعد المطلوب: ${deadline}`,
      `الميزانية التقريبية: ${budget || 'غير محددة'}`,
    ].join('\n');

    window.open(`https://t.me/O8llo10?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="servicePage" dir="rtl">
      <nav className="serviceNav">
        <a className="serviceMark" href="/">G.</a>
        <div className="serviceNavLinks">
          <a href="#services">الخدمات</a>
          <a href="#request">طلب مشروع</a>
        </div>
        <a className="portfolioBtn" href="/">البورتفوليو <ArrowUpRight size={15}/></a>
      </nav>

      <section className="serviceHero">
        <div className="serviceNoise" />
        <div className="serviceTopline"><span>SOFTWARE · FULL-STACK · SYSTEMS</span><span>01 / SERVICES</span></div>
        <div className="heroGrid">
          <div className="heroCopy">
            <span className="eyebrowAr">تنفيذ وتطوير المشاريع البرمجية</span>
            <h1>عندك فكرة؟<br/><i>نحوّلها إلى مشروع.</i></h1>
            <p>تنفيذ كامل، تطوير مشروع قائم، أو مساهمة تقنية معك — بشكل واضح ومن غير تعقيد.</p>
            <div className="heroActions">
              <a className="primaryCta" href="#request">أرسل طلبك <Send size={18}/></a>
              <a className="secondaryCta" href="#services">وش أقدر أنفذ؟</a>
            </div>
          </div>

          <div className="heroBoard" aria-hidden="true">
            <div className="boardHead"><span/><span/><span/><b>PROJECT / BUILD</b></div>
            <div className="boardBody">
              <div className="boardStatus"><small>STATUS</small><strong>READY TO BUILD</strong></div>
              <div className="boardFlow"><span>IDEA</span><b>→</b><span>SCOPE</span><b>→</b><span>BUILD</span><b>→</b><span>SHIP</span></div>
            </div>
          </div>
        </div>
        <div className="serviceRibbon"><span>موقع</span><b>✦</b><span>منصة</span><b>✦</b><span>تطبيق</span><b>✦</b><span>نظام</span><b>✦</b><span>ذكاء اصطناعي</span></div>
      </section>

      <section id="services" className="servicesSection">
        <div className="sectionMeta"><span>02 / WHAT I BUILD</span><p>الخدمات</p></div>
        <div className="sectionTitleRow">
          <h2>أرسل الفكرة.<br/><i>والباقي نرتبه.</i></h2>
          <p>مو لازم تعرف المصطلحات التقنية. وضّح لي وش تبغى المشروع يسوي وأنا أحدد معك المطلوب.</p>
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
        <div className="quickProcess">
          <span><b>01</b> ترسل الفكرة</span>
          <span><b>02</b> نحدد المطلوب والسعر والمدة</span>
          <span><b>03</b> نبدأ التنفيذ</span>
        </div>
      </section>

      <section id="request" className="requestSection">
        <div className="requestCopy">
          <span>03 / PROJECT REQUEST</span>
          <h2>اطلب مشروعك</h2>
          <p>عبّ البيانات الأساسية، وبعدها يفتح لك تيليجرام برسالة جاهزة على محادثتي مباشرة.</p>
          <a className="telegramDirect" href="https://t.me/O8llo10" target="_blank" rel="noreferrer"><Send size={17}/> @O8llo10</a>
        </div>

        <form className="requestForm" onSubmit={sendTelegramRequest}>
          <label>
            <span>الاسم</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="اسمك أو اسم الجهة" required />
          </label>
          <label>
            <span>نوع المشروع</span>
            <select value={type} onChange={e => setType(e.target.value)} required>
              <option value="">اختر النوع</option>
              <option>موقع</option>
              <option>منصة</option>
              <option>تطبيق</option>
              <option>نظام داخلي</option>
              <option>ذكاء اصطناعي</option>
              <option>مشروع تخرج / مسابقة / هاكثون</option>
              <option>تطوير أو إصلاح مشروع قائم</option>
              <option>غير ذلك</option>
            </select>
          </label>
          <label className="wideField">
            <span>فكرة المشروع أو المطلوب</span>
            <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="اشرح باختصار وش تبغى المشروع يسوي" rows={4} required />
          </label>
          <label>
            <span>الموعد المطلوب</span>
            <input value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="مثال: خلال أسبوعين" required />
          </label>
          <label>
            <span>الميزانية التقريبية <small>اختياري</small></span>
            <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="مثال: 1500 - 2500 ريال" />
          </label>
          <button className="sendRequestBtn" type="submit">فتح المحادثة وإرسال الطلب <Send size={18}/></button>
        </form>
      </section>

      <section id="contact" className="contactSection">
        <div className="contactKicker">04 / CONTACT</div>
        <div className="contactHeader">
          <h2>طرق التواصل</h2>
          <p>إذا ما تبغى تعبي الفورم، تقدر تتواصل مباشرة.</p>
        </div>
        <div className="contactCards">
          <a className="contactCard telegram" href="https://t.me/O8llo10" target="_blank" rel="noreferrer"><Send/><div><small>@O8llo10</small><strong>Telegram</strong></div><ArrowUpRight/></a>
          <a className="contactCard whatsapp" href="https://wa.me/966560602239?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%B9%D9%86%D8%AF%D9%8A%20%D9%81%D9%83%D8%B1%D8%A9%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9" target="_blank" rel="noreferrer"><MessageCircle/><div><small>تواصل مباشر</small><strong>WhatsApp</strong></div><ArrowUpRight/></a>
          <a className="contactCard" href="https://www.linkedin.com/in/ghala-abdullah-alameer-541733373" target="_blank" rel="noreferrer"><Linkedin/><div><small>الملف المهني</small><strong>LinkedIn</strong></div><ArrowUpRight/></a>
          <a className="contactCard" href="https://8llo10.github.io/" target="_blank" rel="noreferrer"><ExternalLink/><div><small>الأعمال السابقة</small><strong>Portfolio</strong></div><ArrowUpRight/></a>
        </div>
        <div className="contactFooter"><span>BUILD SOMETHING USEFUL.</span><span>© 2026</span></div>
      </section>
    </main>
  );
}
