/* ============================================================
   موجّه الصفحات + العرض
   ============================================================ */
import {
  getPage, getDepartments, getNews, getPost,
  cleanContent, stripTags, arDate, PAGE_IDS, SOURCE
} from "./api.js";

const app = document.getElementById("app");
const HERO_IMG = SOURCE + "/wp-content/uploads/2024/02/slideb1.jpg";
const ABOUT_IMG = SOURCE + "/wp-content/uploads/2023/12/bgHos.jpg";

/* بيانات ثابتة مستخرجة من الموقع الأساسي (لا تتوفر عبر الواجهة) */
const HOURS = [
  { k: "الطوارئ العامة", v: "24 / 7", em: true },
  { k: "الطوارئ التوليدية", v: "24 / 7", em: true },
  { k: "العيادات صباحًا", v: "8:00 – 13:00" },
  { k: "العيادات مساءً", v: "16:00 – 20:00" }
];
const SOCIALS = {
  facebook: "https://www.facebook.com/sbabakerhos",
  twitter: "https://twitter.com/babakerhos",
  instagram: "https://instagram.com/salehhos1",
  youtube: "https://www.youtube.com/@user-wq8wn2bn5y/videos"
};
const CONTACT = {
  email: "media@babakerhospital.org",
  place: "مديرية وادي العين وحورة — محافظة حضرموت، الجمهورية اليمنية",
  founded: "1999"
};
const DEPT_ICONS = ["🩺", "🏥", "👶", "🔬", "🛏️", "🚑", "💊", "❤️"];

/* ---------- أدوات عرض ---------- */
const loading = (msg = "جارٍ تحميل المحتوى من الموقع الأساسي…") =>
  `<div class="loading"><div class="spinner"></div>${msg}</div>`;

const errorBox = (e) => `
  <div class="wrap section">
    <div class="loading">
      تعذّر جلب البيانات من الموقع الأساسي حاليًا.<br>
      <small style="opacity:.7">${e ? e.message : ""}</small><br><br>
      <a class="btn btn--ghost" href="#/">العودة للرئيسية</a>
    </div>
  </div>`;

function excerpt(html, n = 150) {
  const t = stripTags(cleanContent(html)).replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n).trim() + "…" : t;
}

function setActiveNav(route) {
  document.querySelectorAll(".nav a").forEach(a => {
    a.classList.toggle("is-active", a.getAttribute("href") === route);
  });
}

function observeReveal() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .08, rootMargin: "0px 0px -5% 0px" });
  els.forEach(el => io.observe(el));
  // شبكة أمان: أظهر كل شيء بعد مهلة قصيرة مهما حدث
  setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(el => el.classList.add("in")), 1400);
}

/* ============================================================
   الصفحات
   ============================================================ */

async function viewHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="wrap">
        <div>
          <span class="kicker">خدمة متميّزة بأسعار رمزية</span>
          <h1>رعاية صحية إنسانية<br>على أعلى مستوى</h1>
          <p class="lead">مستشفى صالح بابكر الخيري — صرحٌ طبي خيري تأسّس عام ${CONTACT.founded}
          في وادي العين وحورة بحضرموت، يقدّم خدمات تشخيصية وعلاجية متطوّرة على مدار الساعة.</p>
          <div class="hero__cta">
            <a class="btn" href="#/departments">تصفّح الأقسام</a>
            <a class="btn btn--ghost" href="#/contact">احجز موعدًا</a>
          </div>
        </div>
        <div class="hero__figure reveal">
          <img src="${HERO_IMG}" alt="مستشفى صالح بابكر الخيري" loading="eager"
               onerror="this.style.display='none'">
          <div class="hero__badge">
            <strong>+37</strong><span>مخيمًا طبيًا مجانيًا لجراحة الأنف والأذن والحنجرة</span>
          </div>
        </div>
      </div>
      <div class="stats">
        <div class="wrap">
          <div class="stat reveal"><b>1999</b><span>سنة التأسيس</span></div>
          <div class="stat reveal"><b>+200 ألف</b><span>مستفيد من الخدمات</span></div>
          <div class="stat reveal"><b>24/7</b><span>طوارئ وإحالة</span></div>
          <div class="stat reveal"><b>6</b><span>أقسام رئيسية</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section__head reveal">
          <span class="kicker">أقسام المستشفى</span>
          <h2>تخصصات تغطي احتياج المريض كاملًا</h2>
          <p>من العيادات المتخصصة والطوارئ إلى العناية المركّزة والعمليات والوحدة التشخيصية.</p>
        </div>
        <div id="home-depts" class="grid grid--3">${loading()}</div>
        <div style="margin-top:2rem"><a class="card__more" href="#/departments">عرض كل الأقسام</a></div>
      </div>
    </section>

    <section class="section section--paper2">
      <div class="wrap">
        <div class="section__head reveal">
          <span class="kicker">المركز الإعلامي</span>
          <h2>أحدث أخبار المستشفى</h2>
          <p>تُجلب مباشرةً من الموقع الرسمي لحظة نشرها.</p>
        </div>
        <div id="home-news">${loading()}</div>
        <div style="margin-top:2rem"><a class="card__more" href="#/news">كل الأخبار</a></div>
      </div>
    </section>

    <section class="section section--ink">
      <div class="wrap contact-grid">
        <div class="reveal">
          <span class="kicker">مواعيد العمل</span>
          <h2>نستقبلكم على مدار الأسبوع</h2>
          <ul class="hours" style="margin-top:1.5rem">
            ${HOURS.map(h => `<li class="${h.em ? "emergency" : ""}"><span>${h.k}</span><b>${h.v}</b></li>`).join("")}
          </ul>
        </div>
        <div class="reveal">
          <span class="kicker">المشروع الخيري</span>
          <h2>المخيمات الطبية</h2>
          <p style="color:#a8c6c8;margin-top:1rem">مشروع نوعي تُجرى خلاله عمليات جراحية مجانية في جراحة
          الأنف والأذن والحنجرة، والعيون، والتجميل، والمسالك البولية، لخدمة الأسر الأشد حاجة.</p>
          <a class="btn btn--gold" style="margin-top:1.5rem" href="#/about">تعرّف على المستشفى</a>
        </div>
      </div>
    </section>`;

  observeReveal();

  try {
    const depts = await getDepartments();
    document.getElementById("home-depts").innerHTML = depts.slice(0, 6).map((d, i) => `
      <a class="card reveal" href="#/department/${d.id}">
        <span class="card__no">${DEPT_ICONS[i % DEPT_ICONS.length]} قسم ${String(i + 1).padStart(2, "0")}</span>
        <h3>${stripTags(d.title.rendered)}</h3>
        <p>${excerpt(d.content.rendered, 120)}</p>
        <span class="card__more">التفاصيل</span>
      </a>`).join("");
    observeReveal();
  } catch (e) { document.getElementById("home-depts").innerHTML = errorBox(e); }

  try {
    const { items } = await getNews(1, 4);
    document.getElementById("home-news").innerHTML = items.map(p => `
      <a class="news-item" href="#/news/${p.id}">
        <div class="news-item__thumb">
          ${p.jetpack_featured_media_url
            ? `<img src="${p.jetpack_featured_media_url}" alt="" loading="lazy" onerror="this.parentNode.style.display='none'">`
            : ""}
        </div>
        <div>
          <time>${arDate(p.date)}</time>
          <h3>${stripTags(p.title.rendered)}</h3>
          <p>${excerpt(p.excerpt.rendered || p.content?.rendered, 180)}</p>
        </div>
      </a>`).join("");
  } catch (e) { document.getElementById("home-news").innerHTML = errorBox(e); }
}

async function viewAbout() {
  app.innerHTML = `
    <div class="page-hero"><div class="wrap">
      <div class="breadcrumb"><a href="#/">الرئيسية</a> ← من نحن</div>
      <h1>من نحن</h1><p>نبذة عن مستشفى صالح بابكر الخيري ورؤيته ورسالته.</p>
    </div></div>
    <section class="section"><div class="wrap"><div id="about-body" class="prose">${loading()}</div></div></section>`;
  try {
    const page = await getPage(PAGE_IDS.about);
    document.getElementById("about-body").innerHTML = cleanContent(page.content.rendered);
  } catch (e) { document.getElementById("about-body").innerHTML = errorBox(e); }
}

async function viewDepartments() {
  app.innerHTML = `
    <div class="page-hero"><div class="wrap">
      <div class="breadcrumb"><a href="#/">الرئيسية</a> ← الأقسام</div>
      <h1>أقسام المستشفى</h1><p>ستّة أقسام رئيسية تعمل بكوادر مؤهلة وأجهزة حديثة.</p>
    </div></div>
    <section class="section"><div class="wrap">
      <div id="depts" class="grid grid--3">${loading()}</div>
    </div></section>`;
  try {
    const depts = await getDepartments();
    document.getElementById("depts").innerHTML = depts.map((d, i) => `
      <a class="card reveal" href="#/department/${d.id}">
        <span class="card__no">${DEPT_ICONS[i % DEPT_ICONS.length]} قسم ${String(i + 1).padStart(2, "0")}</span>
        <h3>${stripTags(d.title.rendered)}</h3>
        <p>${excerpt(d.content.rendered, 160)}</p>
        <span class="card__more">التفاصيل</span>
      </a>`).join("");
    observeReveal();
  } catch (e) { document.getElementById("depts").innerHTML = errorBox(e); }
}

async function viewDepartment(id) {
  app.innerHTML = `<section class="section"><div class="wrap"><div id="dept" class="prose">${loading()}</div></div></section>`;
  try {
    const page = await getPage(id);
    app.innerHTML = `
      <div class="page-hero"><div class="wrap">
        <div class="breadcrumb"><a href="#/">الرئيسية</a> ← <a href="#/departments">الأقسام</a> ← ${stripTags(page.title.rendered)}</div>
        <h1>${stripTags(page.title.rendered)}</h1>
      </div></div>
      <section class="section"><div class="wrap">
        <div class="prose">${cleanContent(page.content.rendered)}</div>
        <div style="text-align:center;margin-top:2rem"><a class="btn btn--ghost" href="#/departments">→ كل الأقسام</a></div>
      </div></section>`;
  } catch (e) { document.getElementById("dept").innerHTML = errorBox(e); }
}

let newsPage = 1;
async function viewNews() {
  app.innerHTML = `
    <div class="page-hero"><div class="wrap">
      <div class="breadcrumb"><a href="#/">الرئيسية</a> ← المركز الإعلامي</div>
      <h1>المركز الإعلامي</h1><p>أخبار وفعاليات المستشفى — محدّثة مباشرة من الموقع الرسمي.</p>
    </div></div>
    <section class="section"><div class="wrap">
      <div id="news-list">${loading()}</div>
      <div id="news-pager" class="pager"></div>
    </div></section>`;
  await loadNewsPage();
}

async function loadNewsPage() {
  const list = document.getElementById("news-list");
  list.innerHTML = loading();
  try {
    const { items, totalPages } = await getNews(newsPage, 9);
    list.innerHTML = `<div class="grid grid--3">` + items.map(p => `
      <a class="card reveal" href="#/news/${p.id}">
        ${p.jetpack_featured_media_url
          ? `<div class="news-item__thumb" style="margin:-1.8rem -1.8rem 0"><img src="${p.jetpack_featured_media_url}" alt="" loading="lazy" onerror="this.parentNode.remove()"></div>`
          : ""}
        <time style="font-family:'Reem Kufi';color:var(--gold);font-size:.8rem">${arDate(p.date)}</time>
        <h3 style="font-size:1.1rem">${stripTags(p.title.rendered)}</h3>
        <p>${excerpt(p.excerpt.rendered || p.content?.rendered, 140)}</p>
        <span class="card__more">اقرأ الخبر</span>
      </a>`).join("") + `</div>`;
    document.getElementById("news-pager").innerHTML = `
      <button ${newsPage <= 1 ? "disabled" : ""} data-dir="-1">→ الأحدث</button>
      <span style="align-self:center;font-family:'Reem Kufi'">صفحة ${newsPage} من ${totalPages}</span>
      <button ${newsPage >= totalPages ? "disabled" : ""} data-dir="1">الأقدم ←</button>`;
    document.querySelectorAll("#news-pager button").forEach(b =>
      b.addEventListener("click", () => {
        newsPage += parseInt(b.dataset.dir, 10);
        window.scrollTo({ top: 0, behavior: "smooth" });
        loadNewsPage();
      }));
    observeReveal();
  } catch (e) { list.innerHTML = errorBox(e); }
}

async function viewPost(id) {
  app.innerHTML = `<section class="section"><div class="wrap"><div class="prose">${loading()}</div></div></section>`;
  try {
    const p = await getPost(id);
    app.innerHTML = `
      <div class="page-hero"><div class="wrap">
        <div class="breadcrumb"><a href="#/">الرئيسية</a> ← <a href="#/news">المركز الإعلامي</a></div>
        <h1>${stripTags(p.title.rendered)}</h1>
        <p>${arDate(p.date)}</p>
      </div></div>
      <section class="section"><div class="wrap">
        <article class="prose">
          ${p.jetpack_featured_media_url ? `<img src="${p.jetpack_featured_media_url}" alt="">` : ""}
          ${cleanContent(p.content.rendered)}
        </article>
        <div style="text-align:center;margin-top:2.5rem">
          <a class="btn btn--ghost" href="#/news">→ كل الأخبار</a>
        </div>
      </div></section>`;
  } catch (e) { app.innerHTML = errorBox(e); }
}

function viewContact() {
  app.innerHTML = `
    <div class="page-hero"><div class="wrap">
      <div class="breadcrumb"><a href="#/">الرئيسية</a> ← تواصل معنا</div>
      <h1>تواصل معنا</h1><p>يسرّنا تواصلكم واستفساراتكم على مدار الساعة.</p>
    </div></div>
    <section class="section"><div class="wrap contact-grid">
      <div>
        <form class="reveal" action="https://formsubmit.co/${CONTACT.email}" method="POST">
          <div class="field"><label>الاسم</label><input type="text" name="name" required></div>
          <div class="field"><label>البريد الإلكتروني</label><input type="email" name="email" required></div>
          <div class="field"><label>رقم الجوال</label><input type="tel" name="mobile"></div>
          <div class="field"><label>رسالتك</label><textarea name="message" rows="5" required></textarea></div>
          <input type="hidden" name="_subject" value="رسالة من موقع المستشفى">
          <button class="btn" type="submit">أرسل الرسالة</button>
        </form>
      </div>
      <div>
        <div class="contact-card reveal"><h4>الموقع</h4><p>${CONTACT.place}</p></div>
        <div class="contact-card reveal"><h4>البريد الإلكتروني</h4>
          <p><a href="mailto:${CONTACT.email}" style="color:var(--teal)">${CONTACT.email}</a></p></div>
        <div class="contact-card reveal"><h4>مواعيد العمل</h4>
          <p>${HOURS.map(h => `${h.k}: ${h.v}`).join("<br>")}</p></div>
        <div class="contact-card reveal"><h4>تابعنا</h4>
          <p>${Object.entries(SOCIALS).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener" style="color:var(--teal)">${k}</a>`).join(" · ")}</p>
        </div>
      </div>
    </div></section>`;
  observeReveal();
}

/* ============================================================
   التوجيه
   ============================================================ */
function router() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [, seg, param] = hash.split("/");
  setActiveNav("#/" + (seg || ""));
  document.querySelector(".nav")?.classList.remove("open");
  window.scrollTo(0, 0);

  switch (seg) {
    case "": case undefined: viewHome(); break;
    case "about": viewAbout(); break;
    case "departments": viewDepartments(); break;
    case "department": viewDepartment(param); break;
    case "news": param ? viewPost(param) : (newsPage = 1, viewNews()); break;
    case "contact": viewContact(); break;
    default: viewHome();
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

/* قائمة الجوال */
document.getElementById("navToggle")?.addEventListener("click", () => {
  document.querySelector(".nav").classList.toggle("open");
});
