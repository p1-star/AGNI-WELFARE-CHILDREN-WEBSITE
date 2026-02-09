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

// Close menu when clicking a link
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
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
  document.getElementById("loadingOverlay").classList.add("show");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.remove("show");
}

// ================= TAB SWITCHING =================
function switchTab(tab) {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerForm").classList.remove("active");
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  if (tab === "login") {
    document.getElementById("loginForm").classList.add("active");
    document.querySelectorAll(".tab-btn")[0].classList.add("active");
  } else {
    document.getElementById("registerForm").classList.add("active");
    document.querySelectorAll(".tab-btn")[1].classList.add("active");
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
function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;

  if (!user) return alert("Please enter your username");
  if (!pass) return alert("Please enter your password");

  showLoading();

  setTimeout(() => {
    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", user);

    alert("✓ Login Successful!\n\nWelcome " + getFirstName(user));

    document.getElementById("loginUser").value = "";
    document.getElementById("loginPass").value = "";

    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    hideLoading();
    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  }, 2000);
}

// ================= REGISTRATION =================
function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const pass = document.getElementById("registerPass").value;
  const confirm = document.getElementById("registerConfirm").value;

  if (!name || !email || !pass || !confirm) return alert("Please fill all fields");
  if (pass !== confirm) return alert("Passwords do not match");

  showLoading();

  setTimeout(() => {
    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", name);
    localStorage.setItem("userEmail", email);

    alert("✓ Registration Successful!\n\nWelcome " + getFirstName(name));

    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    hideLoading();
    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  }, 2000);
}

// ================= PAGE SWITCH =================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "gallery") initGallery();

  if (id === "nccForm") {
    setTimeout(() => {
      const dateInput = document.getElementById("nccApplicationDate");
      if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
      }
    }, 100);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= OPEN LOGIN =================
function openLogin() {
  document.getElementById("website").style.display = "none";
  document.getElementById("authSection").style.display = "flex";
  switchTab("login");
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  updateAuthButton();
  document.getElementById("website").style.display = "none";
  document.getElementById("authSection").style.display = "flex";
  switchTab("login");
}

// ================= GALLERY =================
let galleryImages = [];
let currentImageIndex = 0;

function initGallery() {
  galleryImages = [
    "image1.jpg","image3.jpg","image4.jpg","image5.jpg","image6.jpg","image7.jpg","image8.jpg",
    "image10.jpg","image11.jpg","image14.jpg","image15.jpg","image16.jpg","image17.jpg","image18.jpg",
    "image19.jpg","image21.jpg","image22.jpg","image23.jpg","image24.jpg","image25.jpg","image26.jpg",
    "image27.jpg","image28.jpg","image29.jpg","image30.jpg","image31.jpg","image32.jpg","image33.jpg",
    "image34.jpg","image35.jpg","image36.jpg","image37.jpg","image38.jpg","image39.jpg","image40.jpg",
    "image41.jpg","image42.jpg","image43.jpg","image44.jpg","image45.jpg","image46.jpg","image47.jpg",
    "image48.jpg","image49.jpg","image50.jpg"
  ];

  currentImageIndex = 0;
  document.getElementById("totalImages").innerText = galleryImages.length;
  loadGalleryImage();
}

function loadGalleryImage() {
  if (!galleryImages.length) return;

  document.getElementById("galleryImage").src = galleryImages[currentImageIndex];
  document.getElementById("currentImageIndex").innerText = currentImageIndex + 1;

  const progress = ((currentImageIndex + 1) / galleryImages.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  loadGalleryImage();
}

function previousImage() {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  loadGalleryImage();
}

document.addEventListener("DOMContentLoaded", initGallery);

// ================= DONATION =================
let selectedAmount = 0;

function selectAmount(amount, btn) {
  selectedAmount = amount;
  document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  document.getElementById("customAmount").value = "";
}

// ================= AUTO LOGIN =================
window.addEventListener("load", () => {
  if (localStorage.getItem("loggedIn") === "yes") {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";
    updateAuthButton();
    updateWelcomeName();
    showPage("home");
  } else {
    updateAuthButton();
  }
});

function updateWelcomeName() {
  const welcomeEl = document.getElementById("welcomeText");
  if (!welcomeEl) return;

  const name = localStorage.getItem("username");
  welcomeEl.textContent =
    localStorage.getItem("loggedIn") === "yes" && name ? "Welcome, " + name : "Welcome";
}

// ================= NCC RECRUITMENT FORM SUBMISSION =================
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

  if (!formData.name || !formData.gender || !formData.mobile || !formData.email ||
      !formData.address || !formData.job || !formData.qualification ||
      !formData.institute || !formData.purpose || !formData.applicationDate) {
    return alert("Please fill all required fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) return alert("Invalid email address");

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(formData.mobile.replace(/\D/g, ''))) return alert("Invalid mobile number");

  const submitBtn = event.target.querySelector('.form-submit-btn') || event.target;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("http://localhost:5000/api/ncc-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      alert("✓ Application Submitted Successfully!\n\nApplication ID: " + result.applicationId);
      document.getElementById("nccRecruitmentForm").reset();
      showPage("home");
    } else {
      throw new Error(result.message || "Submission failed");
    }
  } catch (error) {
    alert("❌ Failed to submit application.\n\n" + error.message);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// ================= PAYMENT =================
const payBtn = document.getElementById("payBtn");
if (payBtn) {
  payBtn.addEventListener("click", async function () {
    const customAmount = document.getElementById("customAmount").value;
    const amount = selectedAmount || Number(customAmount);

    if (!amount || amount < 1) return alert("Please select or enter valid amount");

    try {
      const res = await fetch("http://localhost:5000/create-order", {
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

          await fetch("http://localhost:5000/save-donation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: document.querySelector('input[placeholder="Name"]')?.value || "Guest",
              email: document.querySelector('input[placeholder="Email"]')?.value || "N/A",
              phone: document.querySelector('input[placeholder="Phone"]')?.value || "N/A",
              amount: amount,
              razorpay_payment_id: response.razorpay_payment_id
            })
          });
        },
        theme: { color: "#146b4f" }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("❌ Payment Failed");
      console.error(err);
    }
  });
}
