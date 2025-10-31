// البحث عن الأطباء
const searchInput = document.getElementById("searchDoctor");
const doctorList = document.getElementById("doctorList");

searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  for (let option of doctorList.options) {
    const text = option.text.toLowerCase();
    option.style.display = text.includes(filter) ? "" : "none";
  }
});

// حجز الطبيب
document.getElementById("bookBtn").addEventListener("click", () => {
  const doctor = doctorList.value;
  const msg = document.getElementById("bookMsg");
  if (doctor) {
    msg.textContent = `✅ تم حجز موعد مع ${doctor}`;
    msg.style.color = "#58a6ff";
  } else {
    msg.textContent = "❌ من فضلك اختر الطبيب أولًا";
    msg.style.color = "red";
  }
});

// إرسال الرسالة وتخزينها
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  let stored = JSON.parse(localStorage.getItem("contactMessages")) || [];
  stored.push({ name, email, message });
  localStorage.setItem("contactMessages", JSON.stringify(stored));

  document.getElementById("statusMsg").textContent = "✅ تم إرسال الرسالة بنجاح!";
  document.getElementById("contactForm").reset();
});


