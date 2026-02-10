// ================= API BASE (LIVE BACKEND) =================
const API_BASE = "https://agni-welfare-children-website.onrender.com";

// ================= PAGE SWITCH =================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ================= MOBILE MENU =================
function toggleMenu() {
  const header = document.querySelector("header");
  const overlay = document.getElementById("menuOverlay");
  header.classList.toggle("menu-open");

  if (header.classList.contains("menu-open")) {
    overlay?.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    overlay?.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function closeMenu() {
  document.querySelector("header")?.classList.remove("menu-open");
  document.getElementById("menuOverlay")?.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("nav a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );
});

// ================= PASSWORD TOGGLE =================
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.type = input.type === "password" ? "text" : "password";
  btn.textContent = input.type === "password" ? "👁️" : "🙈";
}

// ================= LOADING =================
function showLoading() {
  document.getElementById("loadingOverlay")?.classList.add("show");
}
function hideLoading() {
  document.getElementById("loadingOverlay")?.classList.remove("show");
}

// ================= TABS =================
function switchTab(tab) {
  document.getElementById("loginForm")?.classList.remove("active");
  document.getElementById("registerForm")?.classList.remove("active");
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  if (tab === "login") {
    document.getElementById("loginForm")?.classList.add("active");
    document.querySelectorAll(".tab-btn")[0]?.classList.add("active");
  } else {
    document.getElementById("registerForm")?.classList.add("active");
    document.querySelectorAll(".tab-btn")[1]?.classList.add("active");
  }
}

// ================= AUTH =================
function updateAuthButton() {
  const btn = document.getElementById("authBtn");
  if (!btn) return;

  if (localStorage.getItem("loggedIn") === "yes") {
    btn.textContent = "Logout";
    btn.onclick = logout;
  } else {
    btn.textContent = "Login";
    btn.onclick = openLogin;
  }
}

function openLogin() {
  document.getElementById("website").style.display = "none";
  document.getElementById("authSection").style.display = "flex";
  switchTab("login");
}

function logout() {
  localStorage.clear();
  updateAuthButton();
  document.getElementById("website").style.display = "none";
  document.getElementById("authSection").style.display = "flex";
  switchTab("login");
}

function updateWelcomeName() {
  const el = document.getElementById("welcomeText");
  if (!el) return;
  const name = localStorage.getItem("username");
  el.textContent = name ? "Welcome, " + name : "Welcome";
}

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;

  if (!email || !password) return alert("Fill all fields");

  showLoading();
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", data.user.name);

    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  } catch (e) {
    alert(e.message);
  } finally {
    hideLoading();
  }
}

// ================= REGISTER =================
async function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPass").value;
  const confirm = document.getElementById("registerConfirm").value;

  if (!name || !email || !password || password !== confirm)
    return alert("Invalid input");

  showLoading();
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", name);

    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  } catch (e) {
    alert(e.message);
  } finally {
    hideLoading();
  }
}

// ================= NCC FORM =================
async function submitNCCForm(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  try {
    const res = await fetch(`${API_BASE}/api/ncc-application`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const r = await res.json();
    if (!res.ok) throw new Error(r.message || "Submit failed");

    alert("Submitted Successfully");
    e.target.reset();
    showPage("home");
  } catch (err) {
    alert(err.message);
  }
}

// ================= DONATION =================
let selectedAmount = 0;

function selectAmount(amount, btn) {
  selectedAmount = amount;
  document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

document.getElementById("payBtn")?.addEventListener("click", async () => {
  const customAmountEl = document.getElementById("customAmount");
  const amount = selectedAmount || Number(customAmountEl?.value);
  if (!amount) return alert("Select amount");

  try {
    const res = await fetch(`${API_BASE}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const order = await res.json();

    new Razorpay({
      key: order.key,
      amount: order.amount,
      currency: "INR",
      name: "Agni Rural Welfare Society",
      order_id: order.id,
      handler: async (response) => {
        const name = document.querySelector('input[placeholder="Name"]')?.value || "Guest";
        const email = document.querySelector('input[placeholder="Email"]')?.value || "N/A";
        const phone = document.querySelector('input[placeholder="Phone"]')?.value || "N/A";
        const userId = localStorage.getItem("userId") || null; // if you store it

        await fetch(`${API_BASE}/save-donation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            name,
            email,
            phone,
            amount,
            razorpay_payment_id: response.razorpay_payment_id
          })
        });

        alert("Payment successful!");
      }
    }).open();
  } catch (err) {
    alert("Payment failed");
    console.error(err);
  }
});

// ================= AUTO LOGIN =================
window.addEventListener("load", () => {
  const authSection = document.getElementById("authSection");
  const website = document.getElementById("website");

  if (localStorage.getItem("loggedIn") === "yes") {
    authSection.style.display = "none";
    website.style.display = "block";
    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  }
});
