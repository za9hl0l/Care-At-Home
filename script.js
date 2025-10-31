/* script.js - Care At Home (Dark mode) */
/* ==================================== */
/* ملاحظة: بعد التسجيل في EmailJS ضع القيم في المتغيرات تحت */
const EMAILJS_SERVICE_ID = "service_89cf5tr";
const EMAILJS_TEMPLATE_ID = "template_bnz3ivo";
const EMAILJS_PUBLIC_KEY = "4egQwIXkqYoru15L3";

// ----- بيانات أطباء كبيرة (مثال مبدئي) -----
const DOCTORS_DB = [
  { id: "d001", name: "د. حسن السعيد", specialty: "باطنة", location: "طنطا - شارع الجيش", rating: 4.9, img: "https://cdn-icons-png.flaticon.com/512/194/194938.png" },
  { id: "d002", name: "د. زغلول حسن", specialty: "عظام", location: "طنطا - سيتي سنتر", rating: 4.8, img: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" },
  { id: "d003", name: "د. أحمد عكاشة", specialty: "أسنان", location: "طنطا - ميدان الساعة", rating: 5.0, img: "https://cdn-icons-png.flaticon.com/512/2922/2922564.png" },
  { id: "d004", name: "د. عبدالله سمير", specialty: "أنف وأذن وحنجرة", location: "طنطا - شارع الجمهوري", rating: 4.7, img: "https://cdn-icons-png.flaticon.com/512/2922/2922660.png" },
  { id: "d005", name: "د. ندى ماهر", specialty: "نساء وتوليد", location: "طنطا - المستشفى العام", rating: 4.9, img: "https://cdn-icons-png.flaticon.com/512/2922/2922722.png" },
  { id: "d006", name: "د. كريم يوسف", specialty: "قلب", location: "طنطا - مركز القلب", rating: 4.6, img: "https://cdn-icons-png.flaticon.com/512/2922/2922666.png" },
  { id: "d007", name: "د. مريم فؤاد", specialty: "جلدية", location: "طنطا - العيادة الشعبية", rating: 4.5, img: "https://cdn-icons-png.flaticon.com/512/2922/2922631.png" },
  { id: "d008", name: "د. سامح الطوخي", specialty: "عظام", location: "طنطا - شارع 15", rating: 4.4, img: "https://cdn-icons-png.flaticon.com/512/2922/2922506.png" },
  { id: "d009", name: "د. رنا حمدي", specialty: "باطنة", location: "طنطا - سيتي ميديكال", rating: 4.8, img: "https://cdn-icons-png.flaticon.com/512/2922/2922708.png" },
  { id: "d010", name: "د. أمير جودة", specialty: "أطفال", location: "طنطا - شارع النيل", rating: 4.7, img: "https://cdn-icons-png.flaticon.com/512/2922/2922716.png" },
  { id: "d011", name: "د. خالد شوقي", specialty: "مسالك بولية", location: "طنطا - شارع الشهداء", rating: 4.5, img: "https://cdn-icons-png.flaticon.com/512/2922/2922608.png" },
  { id: "d012", name: "د. شيرين طبيب", specialty: "علاج طبيعي", location: "طنطا - المركز الرياضي", rating: 4.6, img: "https://cdn-icons-png.flaticon.com/512/2922/2922649.png" },
  { id: "d013", name: "د. ياسر فهيم", specialty: "باطنة", location: "طنطا - شارع الثلاثيني", rating: 4.3, img: "https://cdn-icons-png.flaticon.com/512/2922/2922682.png" },
  { id: "d014", name: "د. إيمان عفيفي", specialty: "تخدير", location: "طنطا - مستشفى أورام", rating: 4.2, img: "https://cdn-icons-png.flaticon.com/512/2922/2922618.png" },
  { id: "d015", name: "د. مصطفى عمارة", specialty: "جلدية", location: "طنطا - شارع التحرير", rating: 4.0, img: "https://cdn-icons-png.flaticon.com/512/2922/2922633.png" },
  { id: "d016", name: "د. سلوى مرسي", specialty: "عيون", location: "طنطا - العيادات التخصصية", rating: 4.7, img: "https://cdn-icons-png.flaticon.com/512/2922/2922623.png" },
  { id: "d017", name: "د. حسام إبراهيم", specialty: "أمراض صدرية", location: "طنطا - شارع الثورة", rating: 4.1, img: "https://cdn-icons-png.flaticon.com/512/2922/2922587.png" },
  { id: "d018", name: "د. نادر جاد", specialty: "نفسية", location: "طنطا - مركز العلاج النفسي", rating: 4.6, img: "https://cdn-icons-png.flaticon.com/512/2922/2922693.png" },
  { id: "d019", name: "د. هند فاروق", specialty: "أسنان", location: "طنطا - شارع النصر", rating: 4.4, img: "https://cdn-icons-png.flaticon.com/512/2922/2922568.png" },
  { id: "d020", name: "د. ماجد حمدي", specialty: "أورام", location: "طنطا - مستشفى الأورام", rating: 4.2, img: "https://cdn-icons-png.flaticon.com/512/2922/2922612.png" }
];

// ----- DOM nodes -----
const doctorListEl = document.getElementById("doctor-list");
const doctorSelectEl = document.getElementById("doctor-select");
const searchEl = document.getElementById("doctor-search");
const bookingForm = document.getElementById("booking-form");
const bookingResultEl = document.getElementById("booking-result");
const contactForm = document.getElementById("contact-form");
const contactResultEl = document.getElementById("contact-result");

// chat elements
const chatBubble = document.getElementById("chat-bubble");
const chatWindow = document.getElementById("chat-window");
const closeChatBtn = document.getElementById("close-chat");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-message");
const sendBtn = document.getElementById("send-btn");

// sounds
const soundOpen = document.getElementById("sound-open");
const soundSend = document.getElementById("sound-send");

// helper: debounce
function debounce(fn, delay=250){
  let t;
  return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), delay); };
}

// ----- init EmailJS (safe: only init, sending later) -----
if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "REPLACE_WITH_YOUR_PUBLIC_KEY") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
} else {
  // console.warn("EmailJS not initialized — ضع PUBLIC KEY في المتغيرات أعلى script.js");
}

// ----- render doctors (cards + select) -----
function renderDoctors(list){
  doctorListEl.innerHTML = "";
  doctorSelectEl.innerHTML = '<option value="">-- اختر الطبيب --</option>';
  list.forEach(doc=>{
    // card
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `
      <img src="${doc.img}" alt="${doc.name}" />
      <h3>${doc.name}</h3>
      <p>${doc.specialty}</p>
      <p class="loc">📍 ${doc.location}</p>
      <div class="doctor-meta">
        <span class="rate">⭐ ${doc.rating}</span>
        <button class="book-btn" data-id="${doc.id}" aria-label="احجز مع ${doc.name}">احجز</button>
      </div>
    `;
    doctorListEl.appendChild(card);

    // select option
    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.textContent = `${doc.name} — ${doc.specialty}`;
    doctorSelectEl.appendChild(opt);
  });
}

// initial render
renderDoctors(DOCTORS_DB);

// ----- search/filter -----
function filterDoctors(q){
  q = (q||"").trim().toLowerCase();
  if(!q) return DOCTORS_DB;
  return DOCTORS_DB.filter(d=>{
    return d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.location.toLowerCase().includes(q);
  });
}

const handleSearch = debounce(()=>{
  const q = searchEl.value;
  const filtered = filterDoctors(q);
  renderDoctors(filtered);
});
searchEl.addEventListener("input", handleSearch);

// ----- book button from card (event delegation) -----
doctorListEl.addEventListener("click",(e)=>{
  if(e.target.matches(".book-btn")){
    const id = e.target.getAttribute("data-id");
    const doc = DOCTORS_DB.find(d=>d.id===id);
    if(doc){
      // set select by id
      doctorSelectEl.value = doc.id;
      // scroll to booking
      const booking = document.getElementById("booking");
      booking.scrollIntoView({behavior:"smooth", block:"center"});
      // small highlight
      doctorSelectEl.classList.add("highlight");
      setTimeout(()=>doctorSelectEl.classList.remove("highlight"),900);
    }
  }
});

// ----- booking form submit -----
bookingForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const doctorId = doctorSelectEl.value;
  const date = document.getElementById("appointment-date").value;
  const time = document.getElementById("appointment-time").value;
  const note = document.getElementById("note").value;
  if(!doctorId || !date || !time){
    bookingResultEl.textContent = "من فضلك أكمل اختيار الطبيب والتاريخ والوقت.";
    bookingResultEl.style.color = "#f97316";
    return;
  }
  const doc = DOCTORS_DB.find(d=>d.id===doctorId);
  bookingResultEl.innerHTML = `✅ تم حجز موعد مع <strong>${doc.name}</strong> — ${doc.specialty}<br>📅 ${date} ⏰ ${time}`;
  bookingResultEl.style.color = "var(--success)";
  bookingForm.reset();
});

// ----- contact form (EmailJS send) -----
contactForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();
  if(!name || !email || !message){
    contactResultEl.textContent = "يرجى ملء جميع الحقول.";
    contactResultEl.style.color = "#f97316";
    return;
  }

  // prepare template params
  const templateParams = {
    contact_name: name,
    contact_email: email,
    contact_message: message
  };

  // if EmailJS configured -> send, otherwise show fallback
  if (window.emailjs && EMAILJS_SERVICE_ID !== "REPLACE_WITH_YOUR_SERVICE_ID" && EMAILJS_TEMPLATE_ID !== "REPLACE_WITH_YOUR_TEMPLATE_ID") {
    contactResultEl.textContent = "جاري إرسال الرسالة...";
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(()=> {
        contactResultEl.textContent = "✅ تم إرسال رسالتك، شكراً لك!";
        contactResultEl.style.color = "var(--success)";
        contactForm.reset();
      })
      .catch((err)=>{
        contactResultEl.textContent = "حدث خطأ أثناء الإرسال، جرب لاحقًا.";
        contactResultEl.style.color = "#f97316";
        console.error("EmailJS error:", err);
      });
  } else {
    // fallback: عرض الرسالة محليًا (ولازم تضيف مفاتيح EmailJS لاحقاً)
    contactResultEl.innerHTML = `✅ (محلي) تم استلام رسالتك: <strong>${message}</strong><br>سوف يصلك إشعار بالبريد بعد تفعيل EmailJS.`;
    contactResultEl.style.color = "var(--success)";
    contactForm.reset();
  }
});

// ----- CareBot (bubble open/close + sound + replies) -----
function safePlay(audioEl){
  try{ audioEl && audioEl.play().catch(()=>{}); }catch(e){}
}
chatBubble.addEventListener("click", ()=>{
  // play open sound
  safePlay(soundOpen);
  chatWindow.classList.remove("hidden");
  chatBubble.style.display = "none";
  // initial bot welcome if empty
  if(chatMessages.children.length===0){
    addChatMessage("أهلاً! أنا CareBot 🤖 — اكتب أعراضك أو اسألني عن المواعيد.", "bot");
  }
});
closeChatBtn.addEventListener("click", ()=>{
  chatWindow.classList.add("hidden");
  chatBubble.style.display = "flex";
});

// add message to chat
function addChatMessage(text, sender){
  const div = document.createElement("div");
  div.className = sender==="user" ? "user-msg" : "bot-msg";
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// smarter bot replies (keyword-based + recommend doctor)
function careBotReply(userMsg){
  const msg = userMsg.toLowerCase();
  if(msg.includes("سلام") || msg.includes("اهلا")) return "أهلاً بيك! اكتب لي الأعراض باختصار أو 'مساعدة' لمعرفة الخيارات.";
  if(msg.includes("صداع")) return "الصداع ممكن يكون من قلة نوم أو جفاف. لو مصاحب لدوخة أو قيء لازم تظهر لطبيب باطنة — أنصح بـ د. حسن السعيد.";
  if(msg.includes("سخونة") || msg.includes("حر")) return "قيس درجة الحرارة، اشرب سوائل، لو أكثر من 38.5 توجه للطبيب فورًا.";
  if(msg.includes("أسنان")||msg.includes("ضرس")||msg.includes("لثة")) return "يبدو أنها مشكلة أسنان — أنصح بحجز د. أحمد عكاشة (أسنان).";
  if(msg.includes("ركبة")||msg.includes("مفصل")||msg.includes("ظهر")) return "ممكن تكون مشكلة عظام/عضلات — أنصح بحجز د. زغلول حسن (عظام).";
  if(msg.includes("معدة")||msg.includes("قولون")||msg.includes("هضم")) return "أعراض جهاز هضمي — أنصح مراجعة باطنة مثل د. حسن السعيد.";
  if(msg.includes("مساعدة")||msg.includes("ازاي")||msg.includes("كيف")) return "تستطيع: 1) حجز موعد، 2) إرسال رسالة في تواصل معنا، 3) وصف الأعراض هنا.";
  if(msg.includes("شكرا")||msg.includes("متشكر")) return "العفو! سلامتَك تهمنا 🌟";
  // default
  return "ممكن توصفلي الأعراض أكتر؟ (مثال: صداع من امتى، هل فيه حرارة، ألم موضعي أو عام)";
}

// handle send
sendBtn.addEventListener("click", ()=>{
  const text = userInput.value.trim();
  if(!text) return;
  addChatMessage(text,"user");
  userInput.value = "";
  // play send sound
  safePlay(soundSend);
  setTimeout(()=>{
    const reply = careBotReply(text);
    addChatMessage(reply,"bot");
  }, 600);
});
userInput.addEventListener("keypress",(e)=>{ if(e.key==="Enter") sendBtn.click(); });

// ----- accessibility: focus landing when search used -----
searchEl.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    e.preventDefault();
    const q = searchEl.value.trim();
    if(q){
      // focus first match card
      const firstOpt = Array.from(document.querySelectorAll(".doctor-card h3")).find(h=>h.textContent.toLowerCase().includes(q.toLowerCase()));
      if(firstOpt){
        firstOpt.scrollIntoView({behavior:"smooth", block:"center"});
        firstOpt.parentElement.classList.add("highlight");
        setTimeout(()=>firstOpt.parentElement.classList.remove("highlight"),900);
      }
    }
  }
});


