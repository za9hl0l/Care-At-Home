const chatIcon = document.getElementById("chatIcon");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");

chatIcon.addEventListener("click", () => {
  chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
});

sendBtn.addEventListener("click", () => {
  const msg = userInput.value.trim();
  if (!msg) return;
  
  const userMsg = document.createElement("div");
  userMsg.textContent = msg;
  userMsg.style.textAlign = "right";
  userMsg.style.margin = "5px 0";
  chatBody.appendChild(userMsg);
  
  const botMsg = document.createElement("div");
  botMsg.style.textAlign = "left";
  botMsg.style.margin = "5px 0";
  
  let reply = "ممكن توضح أكتر؟ 🤔";
  if (msg.includes("حجز") || msg.includes("موعد")) reply = "تمام ✅ تقدر تحجز من قسم 'حجز موعد' فوق.";
  else if (msg.includes("دكتور") || msg.includes("طبيب")) reply = "لدينا مجموعة مميزة من الأطباء 👨‍⚕️ في كل التخصصات.";
  else if (msg.includes("تواصل")) reply = "تقدر تبعتلنا رسالة من قسم 'تواصل معنا' ✉️.";
  
  setTimeout(() => {
    botMsg.textContent = reply;
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);

  userInput.value = "";
});



