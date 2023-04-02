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
  solvedCrimes.animate(btnClickAnimation, 1000);
});

btnPending.addEventListener("click", function () {
  if (!pendingCrimes.classList.contains("hidden")) return;

  solvedCrimes.classList.add("hidden");
  pendingCrimes.classList.remove("hidden");
  pendingCrimes.animate(btnClickAnimation, 1000);
});

//////////////////////////////////////////////////////////
// Changing Police Officer
