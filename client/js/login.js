"use strict";

const btnSolved = document.querySelector(".btn__solved");
const btnPending = document.querySelector(".btn__pending");
const solvedCrimes = document.querySelector(".crimes__solved");
const pendingCrimes = document.querySelector(".crimes__pending");
const policeOfficers = document.querySelectorAll(".police__officer");

/////////////////////////////////////////////////////////
// Solved Cases and Pending Cases rendering

const btnClickAnimation = [
  {
    transform: "translateY(80px)",
    opacity: 0,
  },
  {
    transform: "translateY(40px)",
    opacity: 0.5,
    offset: 0.5,
  },
  {
    transform: "translateY(0)",
    opacity: 1,
  },
];

btnSolved.addEventListener("click", function () {
  if (!solvedCrimes.classList.contains("hidden")) return;

  pendingCrimes.classList.add("hidden");
  solvedCrimes.classList.remove("hidden");
  solvedCrimes.animate(btnClickAnimation, 500);
});

btnPending.addEventListener("click", function () {
  if (!pendingCrimes.classList.contains("hidden")) return;

  solvedCrimes.classList.add("hidden");
  pendingCrimes.classList.remove("hidden");
  pendingCrimes.animate(btnClickAnimation, 500);
});

//////////////////////////////////////////////////////////
const userLC = localStorage.getItem("user");
const tokenLC = localStorage.getItem("token");
const userName = document.querySelector(".userName");
const designation = document.querySelector(".designation");
const logout = document.querySelector(".logout");
let user;
let token;
if (userLC) {
  user = JSON.parse(userLC);
  userName.textContent = user.userName;
  if (user.designation === "super_admin")
    designation.textContent = "Senior Officer";
} else {
  window.location.replace("http://127.0.0.1:5500/client/index.html");
}
if (tokenLC) {
  token = JSON.parse(tokenLC);
  console.log(token);
}

logout.addEventListener("click", () => {
  localStorage.clear();
});
