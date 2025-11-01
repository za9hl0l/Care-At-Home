/* ================= Care At Home - script.js =================
   - قاعدة أطباء داخلية
   - بحث ذكي (includes + fuzzy name match)
   - حجز مواعيد (localStorage)
   - تواصل (localStorage)
   - CareBot ذكي محلي: تحليل جملة + مطابقة أسماء + اقتراح حجز
   - تسجيل دخول (login.html) و Dashboard (dashboard.html) يعتمدوا على sessionStorage
*/

/* -------------------- بيانات الأطباء -------------------- */
const DOCTORS = [
  { id: "d001", name: "د. حسن السعيد", specialty: "باطنة" },
  { id: "d002", name: "د. زغلول حسن", specialty: "عظام" },
  { id: "d003", name: "د. أحمد عكاشة", specialty: "نفسية" },
  { id: "d004", name: "د. منى عبد الله", specialty: "جلدية" },
  { id: "d005", name: "د. خالد صبري", specialty: "أسنان" },
  { id: "d006", name: "د. رحاب مجدي", specialty: "نساء وتوليد" },
  { id: "d007", name: "د. سامي فؤاد", specialty: "قلب" },
  { id: "d008", name: "د. أحمد ياسين", specialty: "أنف وأذن" },
  { id: "d009", name: "د. فاطمة ناصر", specialty: "تغذية" },
  { id: "d010", name: "د. مازن جمال", specialty: "أطفال" }
];

/* ---------- عناصر DOM (إذا موجودة في الصفحة) ---------- */
const doctorListEl = document.getElementById("doctorList");
const searchDoctorEl = document.getElementById("searchDoctor");
const doctorSelectEl = document.getElementById("doctorSelect");

const bookingForm = document.getElementById("bookingForm");
const bookingResultEl = document.getElementById("bookingResult");

const contactForm = document.getElementById("contactForm");
const contactResultEl = document.getElementById("contactResult");

/* Chat elements */
const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatClose = document.getElementById("closeChat");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

/* Utility: localStorage wrappers */
const STORAGE = {
  bookingsKey: "care_bookings_v1",
  messagesKey: "care_messages_v1",
  loadBookings(){ return JSON.parse(localStorage.getItem(this.bookingsKey) || "[]"); },
  saveBookings(list){ localStorage.setItem(this.bookingsKey, JSON.stringify(list)); },
  loadMessages(){ return JSON.parse(localStorage.getItem(this.messagesKey) || "[]"); },
  saveMessages(list){ localStorage.setItem(this.messagesKey, JSON.stringify(list)); }
};

/* -------------------- render doctors & select -------------------- */
function renderDoctors(filter = "") {
  if (!doctorListEl || !doctorSelectEl) return;
  doctorListEl.innerHTML = "";
  doctorSelectEl.innerHTML = '<option value="">-- اختر الطبيب --</option>';
  const q = (filter||"").trim().toLowerCase();
  const list = DOCTORS.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
  list.forEach(d => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `<h4>${d.name}</h4><p>${d.specialty}</p><div class="doctor-actions"><button class="btn-small" data-id="${d.id}">احجز</button></div>`;
    doctorListEl.appendChild(card);

    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = `${d.name} — ${d.specialty}`;
    doctorSelectEl.appendChild(opt);
  });
  // attach quick book handlers
  document.querySelectorAll(".doctor-actions .btn-small").forEach(btn=>{
    btn.addEventListener("click", ()=> {
      const id = btn.getAttribute("data-id");
      doctorSelectEl.value = id;
      document.getElementById("appointmentDate").focus();
      document.getElementById("appointmentDate").scrollIntoView({behavior:"smooth",block:"center"});
    });
  });
}
renderDoctors();

/* search */
if (searchDoctorEl) {
  searchDoctorEl.addEventListener("input", e => renderDoctors(e.target.value));
}

/* -------------------- booking form -------------------- */
if (bookingForm) {
  bookingForm.addEventListener("submit", e => {
    e.preventDefault();
    const patient = document.getElementById("patientName").value.trim();
    const phone = document.getElementById("patientPhone").value.trim();
    const doctorId = document.getElementById("doctorSelect").value;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime") ? document.getElementById("appointmentTime").value : "";
    const note = document.getElementById("appointmentNote") ? document.getElementById("appointmentNote").value.trim() : "";

    if(!patient || !phone || !doctorId || !date){
      bookingResultEl.textContent = "من فضلك اكمل الحقول المطلوبة.";
      bookingResultEl.style.color = "#f97316";
      return;
    }

    const doctor = DOCTORS.find(d=>d.id===doctorId) || {name:"غير محدد"};
    const bookings = STORAGE.loadBookings();
    const b = { id:`bk_${Date.now()}`, patient, phone, doctorId, doctorName: doctor.name, date, time, note, createdAt: new Date().toISOString() };
    bookings.unshift(b);
    STORAGE.saveBookings(bookings);

    bookingResultEl.textContent = `✅ تم حجز موعدك مع ${doctor.name} (${date} ${time||""})`;
    bookingResultEl.style.color = "#34d399";
    bookingForm.reset();
    // small flash
    setTimeout(()=> bookingResultEl.textContent = "", 5000);
  });
}

/* -------------------- contact form -------------------- */
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const msg = document.getElementById("contactMsg").value.trim();
    if(!name||!email||!msg){
      contactResultEl.textContent = "من فضلك املأ كل الحقول.";
      contactResultEl.style.color = "#f97316";
      return;
    }
    const messages = STORAGE.loadMessages();
    messages.unshift({ id:`m_${Date.now()}`, name, email, message: msg, createdAt: new Date().toISOString() });
    STORAGE.saveMessages(messages);
    contactResultEl.textContent = "✅ تم إرسال رسالتك! سنتواصل معك قريباً.";
    contactResultEl.style.color = "#34d399";
    contactForm.reset();
    setTimeout(()=> contactResultEl.textContent = "", 5000);
  });
}

/* -------------------- CareBot (تحليل + fuzzy match) -------------------- */
/* utility: normalize Arabic (basic) */
function normalizeArabic(s){
  return s.replace(/[^\u0600-\u06FF0-9\s]/g,"").replace(/[آأإ]/g,"ا").replace(/ى/g,"ي").replace(/ؤ|ئ/g,"ئ").replace(/\s+/g," ").trim().toLowerCase();
}

/* simple Levenshtein distance for fuzzy name match */
function levenshtein(a,b){
  if(!a.length) return b.length;
  if(!b.length) return a.length;
  const matrix = Array.from({length:a.length+1},()=>[]);
  for(let i=0;i<=a.length;i++) matrix[i][0]=i;
  for(let j=0;j<=b.length;j++) matrix[0][j]=j;
  for(let i=1;i<=a.length;i++){
    for(let j=1;j<=b.length;j++){
      const cost = a[i-1]===b[j-1]?0:1;
      matrix[i][j] = Math.min(matrix[i-1][j]+1, matrix[i][j-1]+1, matrix[i-1][j-1]+cost);
    }
  }
  return matrix[a.length][b.length];
}

/* find closest doctor by name (fuzzy) */
function findClosestDoctor(term){
  term = normalizeArabic(term);
  let best = null; let bestScore = Infinity;
  DOCTORS.forEach(d=>{
    const nameNorm = normalizeArabic(d.name);
    const score = levenshtein(term, nameNorm);
    if(score < bestScore){ bestScore = score; best = d; }
  });
  // also check includes
  const includesMatch = DOCTORS.find(d=> normalizeArabic(d.name).includes(term) || normalizeArabic(d.specialty).includes(term));
  if(includesMatch) return includesMatch;
  // threshold
  if(bestScore <= Math.max(2, Math.floor(best.name.length/4))) return best;
  return null;
}

/* bot reply logic */
function botAnalyze(text){
  const t = normalizeArabic(text);
  if(!t) return "ممكن تكتب سؤالك؟";
  if(/\b(السلام|اهلا|مرحبا|هاي|هلا)\b/.test(t)) return "أهلاً! كيف أقدر أساعدك اليوم؟ يمكنك طلب 'حجز' أو السؤال عن 'دكتور' أو 'معلومات'.";

  if(/\b(حجز|موعد|أحجز|عايز أحجز|عايز حجز)\b/.test(t)){
    // try to find doctor name
    const maybeName = t.split(" ").slice(-2).join(" ");
    const found = findClosestDoctor(maybeName);
    if(found) return `أقدر احجزلك مع ${found.name}. افتح قسم الحجز لاختيار التاريخ والوقت.`;
    // try to extract number date/time? (basic)
    return "تمام — من فضلك أخبرني باسم الطبيب أو افتح قسم الحجز لاختيار الطبيب والتاريخ.";
  }

  if(/\b(دكتور|طبيب|دكت)\b/.test(t)){
    // ask for specialization or suggest top 3
    const suggestions = DOCTORS.slice(0,3).map(d=>d.name+" ("+d.specialty+")").join(" — ");
    return "لدينا متخصصون: " + suggestions + "؛ يمكنك كتابة اسم الطبيب أو استخدام مربع البحث.";
  }

  if(/\b(الموقع|فين|عنوان|سيتي|طنطا)\b/.test(t)) return "كل الأطباء المذكورين من طنطا مثالياً — لمعلومات العنوان افتح صفحة الطبيب أو تواصل معنا.";

  if(/\b(شكرا|متشكر|يسلم)\b/.test(t)) return "العفو — لو تحتاج مساعدة تانية أنا هنا.";

  // try fuzzy name
  const found = findClosestDoctor(t);
  if(found) return `تقصد ${found.name} ؟ هذا ${found.specialty}. أستطيع اقتراح حجز معه.`;

  return "معلش مش واضح عندي — جرب: 'أريد حجز مع حسن' أو 'دكتور عظام'.";
}

/* attach bot events */
if (chatToggle) chatToggle.addEventListener("click", ()=> chatBox.classList.toggle("hidden"));
if (chatClose) chatClose.addEventListener("click", ()=> chatBox.classList.add("hidden"));
if (chatSend) chatSend.addEventListener("click", ()=> {
  const txt = (chatInput && chatInput.value)||"";
  if(!txt.trim()) return;
  const userMsgEl = document.createElement("div"); userMsgEl.className="user-msg"; userMsgEl.textContent = txt;
  chatBody.appendChild(userMsgEl);
  chatInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(()=> {
    const reply = botAnalyze(txt);
    const botEl = document.createElement("div"); botEl.className="bot-msg"; botEl.textContent = reply;
    chatBody.appendChild(botEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 350);
});
if (chatInput) chatInput.addEventListener("keypress", e=> { if(e.key==="Enter"){ e.preventDefault(); chatSend.click(); } });

/* -------------------- Dashboard & Login helpers -------------------- */
/* login.html uses: username=za9hl0l , password=za9hl0l */
// To be used on login.html: on success set sessionStorage.setItem("care_admin","1")

/* Helper for other pages (dashboard) to read data */
function getBookings(){ return STORAGE.loadBookings(); }
function getMessages(){ return STORAGE.loadMessages(); }

/* -------------------- small UX polish -------------------- */
window.addEventListener("load", ()=>{
  // small fade-in animation for card sections
  document.querySelectorAll(".card-section, .hero-card").forEach((el,i)=>{
    el.style.opacity=0; el.style.transform="translateY(8px)";
    setTimeout(()=> { el.style.transition="opacity 300ms ease, transform 300ms ease"; el.style.opacity=1; el.style.transform="translateY(0)"; }, 120*i);
  });
});
/* smooth scroll helper */
function scrollToSection(id){ const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:"smooth",block:"center"}); }

/* End of script.js */


