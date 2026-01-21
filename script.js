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
    alert("Enter username and password");
  }
}

// ================= PAGE SWITCH =================
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  document.getElementById("website").style.display = "none";
  document.getElementById("authSection").style.display = "flex";
  switchTab("login");
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

    const name = document.getElementById("donorName").value;
    const email = document.getElementById("donorEmail").value;
    const phone = document.getElementById("donorPhone").value;

    if (!amount || amount < 1) {
      alert("Please select or enter a valid amount");
      return;
    }
    if (!name || !email || !phone) {
      alert("Please fill all donor details");
      return;
    }

    // 🔗 CREATE ORDER FROM BACKEND
    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const order = await res.json();

    const options = {
      key: "rzp_test_S6UUJQGA7jipYs", // ONLY KEY ID (test)
      amount: order.amount,
      currency: "INR",
      name: "Agni Rural Welfare Society",
      description: "Donation",
      order_id: order.id,
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: "#0f5c45"
      },
      handler: function (response) {
        alert(
          "Payment Successful!\n\nPayment ID: " +
          response.razorpay_payment_id
        );
        resetDonationForm();
        showPage("home");
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed. Check console.");
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
