const chat = document.getElementById("chat");
const msgInput = document.getElementById("msg");

fetch("/history")
  .then(r => r.json())
  .then(data => data.forEach(m => add(m.user, m.bot)));

function add(user, bot) {
  chat.innerHTML += `
    <div class="msg user">You: ${user}</div>
    <div class="msg bot" id="last"></div>
  `;
  typeText(bot, document.getElementById("last"));
  chat.scrollTop = chat.scrollHeight;
}

function typeText(text, el) {
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(t);
  }, 15);
}

async function send() {
  const text = msgInput.value.trim();
  if (!text) return;
  msgInput.value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message: text })
  });
  const data = await res.json();
  add(text, data.reply);
}

function logout() {
  location.href = "/logout";
}