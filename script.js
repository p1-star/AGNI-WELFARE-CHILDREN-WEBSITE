// ================= LOGIN =================
function login() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  if (user && pass) {
    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", user);

    document.getElementById("displayUser").innerText = user;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";

    showPage("home");
  } else {
    alert("Please enter username and password");
  }
}

// ================= SIGNUP (MOCK) =================
function signup() {
  alert("Signup successful! Please login.");
}

// ================= SHOW PAGE =================
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(page => page.classList.remove("active"));

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  setActiveNav(pageId);
}

// ================= ACTIVE NAV =================
function setActiveNav(pageId) {
  const links = document.querySelectorAll("nav a");
  links.forEach(link => link.classList.remove("active"));

  links.forEach(link => {
    if (link.getAttribute("onclick") === `showPage('${pageId}')`) {
      link.classList.add("active");
    }
  });
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  document.getElementById("website").style.display = "none";
  document.getElementById("authSection").style.display = "block";
}

// ================= AUTO LOGIN CHECK =================
window.onload = function () {
  if (localStorage.getItem("loggedIn") === "yes") {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("website").style.display = "block";
    document.getElementById("displayUser").innerText =
      localStorage.getItem("username");
    showPage("home");
  }
};
