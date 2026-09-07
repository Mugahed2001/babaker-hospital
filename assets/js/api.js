/* ============================================================
   طبقة البيانات — تجلب المحتوى الحيّ من الموقع الأساسي
   عبر واجهة WordPress REST API المفتوحة.
   المصدر: https://babakerhospital.org/wp-json/wp/v2
   ============================================================ */

const SOURCE = "https://babakerhospital.org";
const API = SOURCE + "/wp-json/wp/v2";

/* معرفات ثابتة معروفة من الموقع الأساسي */
export const PAGE_IDS = {
  about: 23,          // من نحن
  departmentsRoot: 32 // الأقسام (الأب)
};
export const NEWS_CATEGORY = 41; // تصنيف "الأخبار"

const cache = new Map();

async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(API + path, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("HTTP " + res.status + " — " + path);
  const total = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
  const data = await res.json();
  const out = { data, totalPages: total };
  cache.set(path, out);
  return out;
}

/* ---------- صفحات ---------- */
export async function getPage(id) {
  const { data } = await get(`/pages/${id}?_fields=id,title,content,link`);
  return data;
}

/* الأقسام: كل الصفحات التي أبوها = صفحة "الأقسام" */
export async function getDepartments() {
  const { data } = await get(
    `/pages?parent=${PAGE_IDS.departmentsRoot}&per_page=50&orderby=menu_order&order=asc` +
    `&_fields=id,title,content,link,excerpt`
  );
  return data;
}

/* ---------- أخبار ---------- */
export async function getNews(page = 1, perPage = 9) {
  const { data, totalPages } = await get(
    `/posts?categories=${NEWS_CATEGORY}&page=${page}&per_page=${perPage}` +
    `&_fields=id,slug,title,excerpt,date,jetpack_featured_media_url,content`
  );
  return { items: data, totalPages };
}

export async function getPost(id) {
  const { data } = await get(
    `/posts/${id}?_fields=id,title,content,date,link,jetpack_featured_media_url`
  );
  return data;
}

/* ---------- أدوات مساعدة ---------- */
export function stripTags(html) {
  const d = document.createElement("div");
  d.innerHTML = html || "";
  return (d.textContent || "").replace(/\s+/g, " ").trim();
}

/* ينظّف محتوى مُنشئ الصفحات القديم (اختصارات mhc_*) ويُبقي HTML المفيد */
export function cleanContent(html) {
  if (!html) return "";
  let s = html
    .replace(/\[\/?mhc_[^\]]*\]/g, "")     // اختصارات القوالب
    .replace(/\[\/?vc_[^\]]*\]/g, "")
    .replace(/&#8221;|&#8243;|&#8220;/g, '"')
    .replace(/&#8217;|&#8216;/g, "'");
  // أعد كتابة روابط الصور النسبية إلى المصدر
  s = s.replace(/src="\/wp-content/g, `src="${SOURCE}/wp-content`);
  return s;
}

export function arDate(iso) {
  try {
    return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
      year: "numeric", month: "long", day: "numeric"
    }).format(new Date(iso));
  } catch { return iso; }
}

export { SOURCE };
