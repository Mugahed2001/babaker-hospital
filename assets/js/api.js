/* ============================================================
   طبقة البيانات — تجلب المحتوى الحيّ من الموقع الأساسي
   عبر واجهة WordPress REST API المفتوحة.
   المصدر: https://babakerhospital.org/wp-json/wp/v2
   سكربت كلاسيكي (بلا وحدات) ليعمل حتى عند فتح الملف مباشرةً.
   ============================================================ */
(function (w) {
  "use strict";

  var SOURCE = "https://babakerhospital.org";
  var API = SOURCE + "/wp-json/wp/v2";

  var PAGE_IDS = { about: 23, departmentsRoot: 32 };
  var NEWS_CATEGORY = 41;

  var cache = new Map();

  function get(path) {
    if (cache.has(path)) return Promise.resolve(cache.get(path));
    return fetch(API + path, { headers: { Accept: "application/json" } }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      var total = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
      return res.json().then(function (data) {
        var out = { data: data, totalPages: total };
        cache.set(path, out);
        return out;
      });
    });
  }

  function getPage(id) {
    return get("/pages/" + id + "?_fields=id,title,content,link").then(function (r) { return r.data; });
  }

  function getDepartments() {
    return get("/pages?parent=" + PAGE_IDS.departmentsRoot +
      "&per_page=50&orderby=menu_order&order=asc&_fields=id,title,content,link,excerpt")
      .then(function (r) { return r.data; });
  }

  function getNews(page, perPage) {
    page = page || 1; perPage = perPage || 9;
    return get("/posts?categories=" + NEWS_CATEGORY + "&page=" + page + "&per_page=" + perPage +
      "&_fields=id,slug,title,excerpt,date,jetpack_featured_media_url,content")
      .then(function (r) { return { items: r.data, totalPages: r.totalPages }; });
  }

  function getPost(id) {
    return get("/posts/" + id + "?_fields=id,title,content,date,link,jetpack_featured_media_url")
      .then(function (r) { return r.data; });
  }

  function stripTags(html) {
    var d = document.createElement("div");
    d.innerHTML = html || "";
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  }

  function cleanContent(html) {
    if (!html) return "";
    var s = html
      .replace(/\[\/?mhc_[^\]]*\]/g, "")
      .replace(/\[\/?vc_[^\]]*\]/g, "")
      .replace(/&#8221;|&#8243;|&#8220;/g, '"')
      .replace(/&#8217;|&#8216;/g, "'");
    s = s.replace(/src="\/wp-content/g, 'src="' + SOURCE + '/wp-content');
    return s;
  }

  function arDate(iso) {
    try {
      return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
        year: "numeric", month: "long", day: "numeric"
      }).format(new Date(iso));
    } catch (e) { return iso; }
  }

  w.BH = {
    SOURCE: SOURCE, PAGE_IDS: PAGE_IDS, NEWS_CATEGORY: NEWS_CATEGORY,
    getPage: getPage, getDepartments: getDepartments, getNews: getNews, getPost: getPost,
    stripTags: stripTags, cleanContent: cleanContent, arDate: arDate
  };
})(window);
