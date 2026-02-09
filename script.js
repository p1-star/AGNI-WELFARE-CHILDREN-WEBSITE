// ================= API BASE (LIVE BACKEND) =================
const API_BASE = "https://agni-welfare-children-website.onrender.com";

// ================= MOBILE MENU =================
function toggleMenu() {
  const header = document.querySelector("header");
  const overlay = document.getElementById("menuOverlay");
  header.classList.toggle("menu-open");
  
  if (header.classList.contains("menu-open")) {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function closeMenu() {
  const header = document.querySelector("header");
  const overlay = document.getElementById("menuOverlay");
  header.classList.remove("menu-open");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => link.addEventListener("click", closeMenu));
});

// ================= PASSWORD VISIBILITY TOGGLE =================
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const button = btn;

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
  } else {
    input.type = "password";
    button.textContent = "👁️";
  }
}

// ================= LOADING OVERLAY =================
function showLoading() {
  document.getElementById("loadingOverlay")?.classList.add("show");
}
function hideLoading() {
  document.getElementById("loadingOverlay")?.classList.remove("show");
}

// ================= TAB SWITCHING =================
function switchTab(tab) {
  document.getElementById("loginForm")?.classList.remove("active");
  document.getElementById("registerForm")?.classList.remove("active");
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  if (tab === "login") {
    document.getElementById("loginForm")?.classList.add("active");
    document.querySelectorAll(".tab-btn")[0]?.classList.add("active");
  } else {
    document.getElementById("registerForm")?.classList.add("active");
    document.querySelectorAll(".tab-btn")[1]?.classList.add("active");
  }
}

// ================= HELPER =================
function getFirstName(name) {
  if (!name) return "";
  return name.split(" ")[0];
}

// ================= HEADER AUTH BUTTON UPDATE =================
function updateAuthButton() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;

  if (localStorage.getItem("loggedIn") === "yes") {
    authBtn.textContent = "Logout";
    authBtn.onclick = logout;
  } else {
    authBtn.textContent = "Login";
    authBtn.onclick = openLogin;
  }
}

// ================= LOGIN =================
async function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;

  if (!user) return alert("Please enter your username");
  if (!pass) return alert("Please enter your password");

  showLoading();

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user, password: pass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", data.user.name);

    alert("✓ Login Successful!\n\nWelcome " + getFirstName(data.user.name));

    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  } catch (e) {
    alert("❌ " + e.message);
  } finally {
    hideLoading();
  }
}

// ================= REGISTRATION =================
async function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const pass = document.getElementById("registerPass").value;
  const confirm = document.getElementById("registerConfirm").value;

  if (!name || !email || !pass || !confirm) return alert("Please fill all fields");
  if (pass !== confirm) return alert("Passwords do not match");

  showLoading();

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", name);
    localStorage.setItem("userEmail", email);

    alert("✓ Registration Successful!\n\nWelcome " + getFirstName(name));

    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  } catch (e) {
    alert("❌ " + e.message);
  } finally {
    hideLoading();
  }
}

// ================= PAGE SWITCH =================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");

  if (id === "gallery") initGallery();

  if (id === "nccForm") {
    setTimeout(() => {
      const dateInput = document.getElementById("nccApplicationDate");
      if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split("T")[0];
      }
    }, 100);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ================= OPEN LOGIN / LOGOUT =================
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

// ================= NCC FORM =================
async function submitNCCForm(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("nccName").value.trim(),
    gender: document.getElementById("nccGender").value,
    mobile: document.getElementById("nccMobile").value.trim(),
    email: document.getElementById("nccEmail").value.trim(),
    address: document.getElementById("nccAddress").value.trim(),
    job: document.getElementById("nccJob").value,
    qualification: document.getElementById("nccQualification").value.trim(),
    institute: document.getElementById("nccInstitute").value.trim(),
    jobPortal: document.getElementById("nccJobPortal").value.trim() || "N/A",
    purpose: document.getElementById("nccPurpose").value.trim(),
    applicationDate: document.getElementById("nccApplicationDate").value
  };

  try {
    const res = await fetch(`${API_BASE}/api/ncc-application`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Submission failed");

    alert("✓ Application Submitted!\n\nApplication ID: " + result.applicationId);
    document.getElementById("nccRecruitmentForm").reset();
    showPage("home");
  } catch (e) {
    alert("❌ " + e.message);
  }
}

// ================= PAYMENT =================
let selectedAmount = 0;
function selectAmount(amount, btn) {
  selectedAmount = amount;
  document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  document.getElementById("customAmount").value = "";
}

const payBtn = document.getElementById("payBtn");
if (payBtn) {
  payBtn.addEventListener("click", async function () {
    const customAmount = document.getElementById("customAmount").value;
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount < 1) return alert("Please select or enter valid amount");

    try {
      const res = await fetch(`${API_BASE}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      const order = await res.json();

      const options = {
        key: "rzp_live_SCozJj700VYcQQ",
        amount: order.amount,
        currency: "INR",
        name: "Agni Rural Welfare Society",
        description: "Donation",
        order_id: order.id,
        handler: async function (response) {
          alert("✅ Payment Successful!");
          await fetch(`${API_BASE}/save-donation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: document.querySelector('input[placeholder="Name"]')?.value || "Guest",
              email: document.querySelector('input[placeholder="Email"]')?.value || "N/A",
              phone: document.querySelector('input[placeholder="Phone"]')?.value || "N/A",
              amount,
              razorpay_payment_id: response.razorpay_payment_id
            })
          });
        },
        theme: { color: "#146b4f" }
      };

      new Razorpay(options).open();
    } catch (err) {
      alert("❌ Payment Failed");
      console.error(err);
    }
  });
}
