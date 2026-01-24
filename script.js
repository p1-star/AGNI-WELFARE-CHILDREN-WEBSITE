// ================= MOBILE MENU =================
function toggleMenu() {
  const header = document.querySelector("header");
  header.classList.toggle("menu-open");
}

function closeMenu() {
  const header = document.querySelector("header");
  header.classList.remove("menu-open");
}

// Close menu when clicking a link
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
});

// ================= PASSWORD VISIBILITY TOGGLE =================
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = event.target;
  
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
  } else if (tab === "register") {
    document.getElementById("registerForm").classList.add("active");
    document.querySelectorAll(".tab-btn")[1].classList.add("active");
  }
}

// ================= LOGIN =================
function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;

  if (!user) {
    alert("Please enter your username");
    return;
  }

  if (!pass) {
    alert("Please enter your password");
    return;
  }

  // Show loading overlay
  showLoading();

  // Simulate verification delay
  setTimeout(() => {
    // Store login data
    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", user);

    // Update display and show website
    document.getElementById("displayUser").innerText = user;
    document.getElementById("loginUser").value = "";
    document.getElementById("loginPass").value = "";
    
    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    // Hide loading overlay
    hideLoading();

    showPage("home");
  }, 2000);
}

// ================= REGISTRATION =================
function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const pass = document.getElementById("registerPass").value;
  const confirm = document.getElementById("registerConfirm").value;

  // Validation
  if (!name) {
    alert("Please enter your full name");
    return;
  }

  if (!email) {
    alert("Please enter your email");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email address");
    return;
  }

  if (!pass) {
    alert("Please enter a password");
    return;
  }

  if (pass.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  if (!confirm) {
    alert("Please confirm your password");
    return;
  }

  if (pass !== confirm) {
    alert("Passwords do not match. Please try again");
    return;
  }

  // Show loading overlay
  showLoading();

  // Simulate verification delay
  setTimeout(() => {
    // Success - Store user data
    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", name);
    localStorage.setItem("userEmail", email);

    // Show success message
    alert("✓ Registration successful!\n\nWelcome " + name + "!\n\nYou are now logged in.");
    
    // Clear all form fields
    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPass").value = "";
    document.getElementById("registerConfirm").value = "";
    document.querySelector(".terms-agree input").checked = false;

    // Update display and show website
    document.getElementById("displayUser").innerText = name;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";
    
    // Hide loading overlay
    hideLoading();
    
    // Show home page
    showPage("home");
  }, 2000);
}

// ================= PAGE SWITCH =================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  
  // Initialize gallery when gallery page is shown
  if (id === "gallery") {
    initGallery();
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  document.getElementById("website").style.display = "none";
  document.getElementById("authSection").style.display = "flex";
  switchTab("login");
}

// ================= GALLERY =================
let galleryImages = [];
let currentImageIndex = 0;
const animationTypes = ['slideInAndZoom', 'animate-rotate', 'animate-slide-left', 'animate-slide-right', 'animate-bounce'];
let currentAnimationIndex = 0;

function initGallery() {
  // List of all images in the workspace
  galleryImages = [
    "image1.jpg", "image3.jpg", "image4.jpg", "image5.jpg",
    "image6.jpg", "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg",
    "image11.jpg", "image14.jpg", "image15.jpg",
    "image16.jpg", "image17.jpg", "image18.jpg", "image19.jpg", "image20.jpg",
    "image21.jpg"
  ];
  
  currentImageIndex = 0;
  document.getElementById("totalImages").innerText = galleryImages.length;
  loadGalleryImage();
}

function loadGalleryImage() {
  if (galleryImages.length > 0) {
    const imgElement = document.getElementById("galleryImage");
    
    // Remove all animation classes
    animationTypes.forEach(anim => imgElement.classList.remove(anim));
    
    // Apply random or sequential animation
    const animationType = animationTypes[currentAnimationIndex % animationTypes.length];
    imgElement.classList.add(animationType);
    currentAnimationIndex++;
    
    // Update image source
    imgElement.src = galleryImages[currentImageIndex];
    document.getElementById("currentImageIndex").innerText = currentImageIndex + 1;
    
    // Update progress bar
    const progress = ((currentImageIndex + 1) / galleryImages.length) * 100;
    document.getElementById("progressBar").style.width = progress + "%";
  }
}

function nextImage() {
  if (galleryImages.length > 0) {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    loadGalleryImage();
  }
}

function previousImage() {
  if (galleryImages.length > 0) {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    loadGalleryImage();
  }
}

// ================= DONATION =================
let selectedAmount = 0;

function selectAmount(amount, btn) {
  selectedAmount = amount;
  document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  document.getElementById("customAmount").value = "";
}

// ================= PAYMENT =================
async function initiatePayment() {
  try {
    const customAmount = document.getElementById("customAmount").value;
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    const name = document.getElementById("donorName").value.trim();
    const email = document.getElementById("donorEmail").value.trim();
    const phone = document.getElementById("donorPhone").value.trim();

    if (!amount || amount < 1) {
      alert("Please select or enter a valid amount (minimum ₹1)");
      return;
    }
    if (!name || !email || !phone) {
      alert("Please fill all donor details");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    // Demo mode - show success without backend
    const paymentId = "demo_" + Date.now();
    
    alert(
      "✓ Payment Successful (Demo Mode)!\n\n" +
      "Name: " + name + "\n" +
      "Amount: ₹" + amount + "\n" +
      "Payment ID: " + paymentId
    );
    
    resetDonationForm();
    showPage("home");

  } catch (err) {
    console.error(err);
    alert("Payment processing failed. Please try again.");
  }
}

function resetDonationForm() {
  selectedAmount = 0;
  document.getElementById("customAmount").value = "";
  document.getElementById("donorName").value = "";
  document.getElementById("donorEmail").value = "";
  document.getElementById("donorPhone").value = "";
  document.querySelectorAll(".amount-btn").forEach(b => b.classList.remove("selected"));
}

// ================= AUTO LOGIN =================
window.addEventListener("load", () => {
  if (localStorage.getItem("loggedIn") === "yes") {
    const user = localStorage.getItem("username");
    document.getElementById("displayUser").innerText = user;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";
    showPage("home");
  }
});
