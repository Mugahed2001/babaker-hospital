/* ============================================================
   موجّه الصفحات + العرض
   ============================================================ */
var getPage = BH.getPage, getDepartments = BH.getDepartments, getNews = BH.getNews,
    getPost = BH.getPost, cleanContent = BH.cleanContent, stripTags = BH.stripTags,
    arDate = BH.arDate, PAGE_IDS = BH.PAGE_IDS, SOURCE = BH.SOURCE;

var app = document.getElementById("app");

var IMG = {
  hero: SOURCE + "/wp-content/uploads/2024/02/slideb1.jpg",
  camps: SOURCE + "/wp-content/uploads/2024/02/slideb2.jpg",
  about: SOURCE + "/wp-content/uploads/2023/12/bgHos.jpg"
};

var HOURS = [
  { k: "الطوارئ العامة", v: "24 / 7", em: true },
  { k: "الطوارئ التوليدية", v: "24 / 7", em: true },
  { k: "العيادات صباحًا", v: "8:00 – 13:00" },
  { k: "العيادات مساءً", v: "16:00 – 20:00" }
];
var SOCIALS = {
  "فيسبوك": "https://www.facebook.com/sbabakerhos",
  "إكس (تويتر)": "https://twitter.com/babakerhos",
  "إنستغرام": "https://instagram.com/salehhos1",
  "يوتيوب": "https://www.youtube.com/@user-wq8wn2bn5y/videos"
};
var CONTACT = {
  email: "media@babakerhospital.org",
  place: "مديرية وادي العين وحورة — محافظة حضرموت، الجمهورية اليمنية",
  founded: "1999"
};

/* أيقونات خطية 1.7px — تُوزَّع على الأقسام بالترتيب */
var ICONS = [
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3v6a4 4 0 0 0 8 0V3M4 3h4M12 3h4M10 21a5 5 0 0 0 5-5v-3M18 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M9 12l-1 4h8l-1-4"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M8 3h8M8 14h8"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 8h13a4 4 0 0 1 4 4v6M3 4v14M3 18h18M7 12h5"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 12a8 8 0 1 1-8-8M12 6v6l4 2M18 4l2 2-2 2M20 6h-4"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21C7 17 3 13 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 13 17 17 12 21z"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 22V4a2 2 0 0 1 2-2h8l6 6v14M14 2v6h6M9 13h6M9 17h6"/></svg>'
];
var ARROW = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>';
var ARROW_INLINE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 6l-6 6 6 6"/></svg>';

/* ---------- أدوات عرض ---------- */
function loading(msg) {
  return '<div class="loading"><div class="spinner"></div>' + (msg || "جارٍ تحميل المحتوى من الموقع الأساسي…") + '</div>';
}
function errorBox(e) {
  return '<div class="wrap section"><div class="loading">تعذّر جلب البيانات من الموقع الأساسي حاليًا.<br>' +
    '<span style="font-weight:400;font-size:.85rem;opacity:.7">' + (e ? e.message : "") + '</span><br><br>' +
    '<a class="btn btn--outline" href="#/">العودة للرئيسية</a></div></div>';
}
function excerpt(html, n) {
  n = n || 150;
  var t = stripTags(cleanContent(html)).replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n).trim() + "…" : t;
}
function setActiveNav(route) {
  var links = document.querySelectorAll(".mainnav a");
  for (var i = 0; i < links.length; i++) {
    links[i].classList.toggle("is-active", links[i].getAttribute("href") === route);
  }
}
function observeReveal() {
  var els = document.querySelectorAll(".reveal:not(.in)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add("in");
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .08, rootMargin: "0px 0px -5% 0px" });
  els.forEach(function (el) { io.observe(el); });
  setTimeout(function () {
    var left = document.querySelectorAll(".reveal:not(.in)");
    for (var j = 0; j < left.length; j++) left[j].classList.add("in");
  }, 1400);
}

/* ============================================================
   الصفحة الرئيسية
   ============================================================ */
async function viewHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="wrap framed">
        <div class="hero__text">
          <span class="overline overline--red">مستشفى خيري · منذ ${CONTACT.founded}</span>
          <h1>رعاية صحية على<br><em>معايير عالمية</em><br>بروح إنسانية</h1>
          <p class="hero__lead">صرحٌ طبي خيري في وادي العين وحورة بحضرموت، يجمع بين الكفاءة
          العلمية والأجهزة الحديثة والخدمة بأسعار رمزية، على مدار الساعة.</p>
          <div class="hero__actions">
            <a class="btn btn--red" href="#/contact">احجز موعدًا</a>
            <a class="btn btn--outline" href="#/departments">الأقسام ومراكز التميّز</a>
          </div>
        </div>
        <div class="hero__media">
          <img src="${IMG.hero}" alt="مستشفى صالح بابكر الخيري" loading="eager" onerror="this.style.display='none'">
          <div class="hero__tag">
            <b>+37 مخيمًا طبيًا مجانيًا</b>
            <span>جراحة الأنف والأذن والحنجرة، العيون، التجميل، المسالك</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap framed">
        <div class="sec-head reveal">
          <span class="overline"><span class="idx">٠١</span> الأقسام ومراكز التميّز</span>
          <h2>تخصصات تغطي رحلة المريض كاملة</h2>
          <p>من العيادات المتخصصة والطوارئ إلى العناية المركّزة والعمليات والوحدة التشخيصية.</p>
        </div>
      </div>
      <div class="centers" id="home-centers">${loading()}</div>
      <div class="wrap framed" style="padding-top:2rem">
        <a class="link" href="#/departments">عرض كل الأقسام ${ARROW_INLINE}</a>
      </div>
    </section>

    <section class="section section--bone">
      <div class="wrap framed">
        <div class="sec-head reveal">
          <span class="overline"><span class="idx">٠٢</span> الجودة والأثر</span>
          <h2>أرقام تختصر مسيرتنا</h2>
        </div>
      </div>
      <div class="wrap framed" style="padding:0">
        <div class="outcomes">
          <div class="outcome reveal"><b>${CONTACT.founded}</b><span>سنة التأسيس</span><small>خدمة متواصلة منذ أكثر من ربع قرن</small></div>
          <div class="outcome reveal"><b>+200 ألف</b><span>مستفيد من الخدمات</span><small>سكان وادي العين وحورة والمناطق المجاورة</small></div>
          <div class="outcome reveal"><b>+37</b><span>مخيمًا طبيًا مجانيًا</span><small>عمليات جراحية نوعية ضمن المشروع الخيري</small></div>
          <div class="outcome reveal"><b>24/7</b><span>طوارئ وإحالة</span><small>طوارئ عامة وتوليدية وصيدلية على مدار الساعة</small></div>
        </div>
      </div>
    </section>

    <section class="section section--navy visitors">
      <div class="wrap framed">
        <div>
          <span class="overline overline--light"><span class="idx">٠٣</span> المرضى والزوّار</span>
          <h2 style="font:var(--f-h2)">مواعيد العمل</h2>
          <div class="hours" style="margin-top:1.6rem">
            ${HOURS.map(function (h) {
              return '<div class="' + (h.em ? "is-emergency" : "") + '"><span>' + h.k + '</span><span dir="ltr">' + h.v + '</span></div>';
            }).join("")}
          </div>
        </div>
        <div>
          <span class="overline overline--light">وصول سريع</span>
          <h2 style="font:var(--f-h2)">خدمات المرضى</h2>
          <div class="visitor-links">
            <a href="#/contact"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> حجز موعد</a>
            <a href="#/departments"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21C7 17 3 13 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 13 17 17 12 21z"/></svg> الطوارئ والإحالة</a>
            <a href="#/about"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg> عن المستشفى</a>
            <a href="mailto:${CONTACT.email}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> راسلنا</a>
            <a href="#/news"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/></svg> المركز الإعلامي</a>
            <a href="#/departments"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v18M3 12h18"/></svg> الأقسام ومراكز التميّز</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap framed">
        <div class="sec-head reveal">
          <span class="overline"><span class="idx">٠٤</span> المركز الإعلامي</span>
          <h2>أحدث الأخبار</h2>
          <p>تُجلب مباشرةً من الموقع الرسمي لحظة نشرها.</p>
        </div>
        <div id="home-news">${loading()}</div>
        <div style="padding-top:2rem"><a class="link" href="#/news">كل الأخبار ${ARROW_INLINE}</a></div>
      </div>
    </section>

    <section class="feature section--bone">
      <div class="wrap framed">
        <div class="feature__media">
          <img src="${IMG.camps}" alt="المخيمات الطبية" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="feature__body reveal">
          <span class="overline overline--red">المشروع الخيري</span>
          <h2>المخيمات الطبية المجانية</h2>
          <p>مشروع نوعي تُجرى خلاله عمليات جراحية مجانية في جراحة الأنف والأذن والحنجرة،
          والعيون، والتجميل، والمسالك البولية — لخدمة الأسر الأشدّ حاجة، بإشراف كوادر متخصصة.</p>
          <a class="link" href="#/about">تعرّف على المستشفى ${ARROW_INLINE}</a>
        </div>
      </div>
    </section>`;

  observeReveal();

  try {
    var depts = await getDepartments();
    document.getElementById("home-centers").innerHTML = depts.slice(0, 6).map(function (d, i) {
      return '<a class="center-row" href="#/department/' + d.id + '">' +
        '<span class="center-row__idx">' + toAr(i + 1) + '</span>' +
        '<span class="center-row__body"><h3>' + stripTags(d.title.rendered) + '</h3>' +
        '<p>' + excerpt(d.content.rendered, 110) + '</p></span>' +
        '<span class="center-row__icon">' + ICONS[i % ICONS.length] + '</span>' +
        '<span class="center-row__arrow">' + ARROW + '</span></a>';
    }).join("");
  } catch (e) { document.getElementById("home-centers").innerHTML = errorBox(e); }

  try {
    var res = await getNews(1, 3);
    document.getElementById("home-news").innerHTML =
      '<div class="news-grid">' + res.items.map(newsCard).join("") + '</div>';
  } catch (e2) { document.getElementById("home-news").innerHTML = errorBox(e2); }
}

function toAr(n) {
  return String(n).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; }).padStart(2, "٠");
}

function newsCard(p) {
  var img = p.jetpack_featured_media_url;
  return '<a class="news-card" href="#/news/' + p.id + '">' +
    (img ? '<div class="news-card__img"><img src="' + img + '" alt="" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></div>' : "") +
    '<time>' + arDate(p.date) + '</time>' +
    '<h3>' + stripTags(p.title.rendered) + '</h3>' +
    '<p>' + excerpt(p.excerpt && p.excerpt.rendered ? p.excerpt.rendered : (p.content && p.content.rendered), 130) + '</p>' +
    '<span class="link">اقرأ الخبر ' + ARROW_INLINE + '</span></a>';
}

/* ============================================================
   عن المستشفى
   ============================================================ */
async function viewAbout() {
  app.innerHTML = pagehead("عن المستشفى", "الرؤية والرسالة ونبذة عن مسيرة مستشفى صالح بابكر الخيري.", ["الرئيسية|#/", "عن المستشفى"]) +
    '<section class="section"><div class="wrap"><div id="about-body" class="prose">' + loading() + '</div></div></section>';
  try {
    var page = await getPage(PAGE_IDS.about);
    document.getElementById("about-body").innerHTML = cleanContent(page.content.rendered);
  } catch (e) { document.getElementById("about-body").innerHTML = errorBox(e); }
}

/* ============================================================
   الأقسام
   ============================================================ */
async function viewDepartments() {
  app.innerHTML = pagehead("الأقسام ومراكز التميّز", "أقسام رئيسية تعمل بكوادر مؤهلة وأجهزة حديثة.", ["الرئيسية|#/", "الأقسام"]) +
    '<section class="section"><div class="dept-list" id="depts">' + loading() + '</div></section>';
  try {
    var depts = await getDepartments();
    document.getElementById("depts").innerHTML = depts.map(function (d, i) {
      return '<a class="center-row" href="#/department/' + d.id + '">' +
        '<span class="center-row__idx">' + toAr(i + 1) + '</span>' +
        '<span class="center-row__body"><h3>' + stripTags(d.title.rendered) + '</h3>' +
        '<p>' + excerpt(d.content.rendered, 150) + '</p></span>' +
        '<span class="center-row__icon">' + ICONS[i % ICONS.length] + '</span>' +
        '<span class="center-row__arrow">' + ARROW + '</span></a>';
    }).join("");
  } catch (e) { document.getElementById("depts").innerHTML = errorBox(e); }
}

async function viewDepartment(id) {
  app.innerHTML = '<section class="section"><div class="wrap"><div id="dept" class="prose">' + loading() + '</div></div></section>';
  try {
    var page = await getPage(id);
    var title = stripTags(page.title.rendered);
    app.innerHTML = pagehead(title, "", ["الرئيسية|#/", "الأقسام|#/departments", title]) +
      '<section class="section"><div class="wrap"><div class="prose">' + cleanContent(page.content.rendered) + '</div>' +
      '<div style="max-width:74ch;margin:2.5rem auto 0"><a class="link" href="#/departments">' + ARROW_INLINE + ' كل الأقسام</a></div>' +
      '</div></section>';
  } catch (e) { document.getElementById("dept").innerHTML = errorBox(e); }
}

/* ============================================================
   المركز الإعلامي
   ============================================================ */
var newsPage = 1;
async function viewNews() {
  app.innerHTML = pagehead("المركز الإعلامي", "أخبار وفعاليات المستشفى — محدّثة مباشرة من الموقع الرسمي.", ["الرئيسية|#/", "المركز الإعلامي"]) +
    '<section class="section"><div class="wrap"><div id="news-list">' + loading() + '</div><div id="news-pager" class="pager"></div></div></section>';
  await loadNewsPage();
}
async function loadNewsPage() {
  var list = document.getElementById("news-list");
  list.innerHTML = loading();
  try {
    var res = await getNews(newsPage, 9);
    list.innerHTML = '<div class="newslist">' + res.items.map(newsCard).join("") + '</div>';
    document.getElementById("news-pager").innerHTML =
      '<button ' + (newsPage <= 1 ? "disabled" : "") + ' data-dir="-1">' + ARROW_INLINE + ' الأحدث</button>' +
      '<span>صفحة ' + toAr(newsPage) + ' من ' + toAr(res.totalPages) + '</span>' +
      '<button ' + (newsPage >= res.totalPages ? "disabled" : "") + ' data-dir="1">الأقدم <span style="display:inline-block;transform:scaleX(-1)">' + ARROW_INLINE + '</span></button>';
    document.querySelectorAll("#news-pager button").forEach(function (b) {
      b.addEventListener("click", function () {
        newsPage += parseInt(b.dataset.dir, 10);
        window.scrollTo({ top: 0, behavior: "smooth" });
        loadNewsPage();
      });
    });
    observeReveal();
  } catch (e) { list.innerHTML = errorBox(e); }
}

async function viewPost(id) {
  app.innerHTML = '<section class="section"><div class="wrap"><div class="prose">' + loading() + '</div></div></section>';
  try {
    var p = await getPost(id);
    var title = stripTags(p.title.rendered);
    app.innerHTML = pagehead(title, arDate(p.date), ["الرئيسية|#/", "المركز الإعلامي|#/news", "خبر"]) +
      '<section class="section"><div class="wrap"><article class="prose">' +
      (p.jetpack_featured_media_url ? '<img src="' + p.jetpack_featured_media_url + '" alt="">' : "") +
      cleanContent(p.content.rendered) +
      '</article><div style="max-width:74ch;margin:2.5rem auto 0"><a class="link" href="#/news">' + ARROW_INLINE + ' كل الأخبار</a></div></div></section>';
  } catch (e) { app.innerHTML = errorBox(e); }
}

/* ============================================================
   تواصل معنا
   ============================================================ */
function viewContact() {
  app.innerHTML = pagehead("تواصل معنا", "يسرّنا تواصلكم واستفساراتكم على مدار الساعة.", ["الرئيسية|#/", "تواصل معنا"]) + `
    <section class="section"><div class="wrap contact-grid">
      <form class="reveal" action="https://formsubmit.co/${CONTACT.email}" method="POST">
        <div class="field"><label>الاسم</label><input type="text" name="name" required></div>
        <div class="field"><label>البريد الإلكتروني</label><input type="email" name="email" required></div>
        <div class="field"><label>رقم الجوال</label><input type="tel" name="mobile"></div>
        <div class="field"><label>رسالتك</label><textarea name="message" rows="6" required></textarea></div>
        <input type="hidden" name="_subject" value="رسالة من موقع المستشفى">
        <button class="btn btn--red" type="submit">أرسل الرسالة</button>
      </form>
      <div class="infoblock reveal">
        <div><h4>الموقع</h4><p>${CONTACT.place}</p></div>
        <div><h4>البريد الإلكتروني</h4><p><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p></div>
        <div><h4>مواعيد العمل</h4><p>${HOURS.map(function (h) { return h.k + ": " + h.v; }).join("<br>")}</p></div>
        <div><h4>تابعنا</h4><p>${Object.keys(SOCIALS).map(function (k) {
          return '<a href="' + SOCIALS[k] + '" target="_blank" rel="noopener">' + k + '</a>';
        }).join(" &nbsp;·&nbsp; ")}</p></div>
      </div>
    </div></section>`;
  observeReveal();
}

/* ---------- رأس صفحة داخلية ---------- */
function pagehead(title, sub, crumbs) {
  var c = crumbs.map(function (seg) {
    var parts = seg.split("|");
    return parts[1] ? '<a href="' + parts[1] + '">' + parts[0] + '</a>' : parts[0];
  }).join(" / ");
  return '<div class="pagehead"><div class="wrap">' +
    '<div class="crumbs">' + c + '</div>' +
    '<h1>' + title + '</h1>' + (sub ? '<p>' + sub + '</p>' : "") +
    '</div></div>';
}

/* ============================================================
   التوجيه
   ============================================================ */
function router() {
  var hash = location.hash.replace(/^#/, "") || "/";
  var seg = hash.split("/")[1], param = hash.split("/")[2];
  setActiveNav("#/" + (seg || ""));
  var nav = document.getElementById("mainnav");
  if (nav) nav.classList.remove("open");
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
if (document.readyState !== "loading") router();
