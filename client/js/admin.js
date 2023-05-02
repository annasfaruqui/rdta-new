"use strict";

const modalAddUser = document.querySelector(".modal__add-user");
const modalRemoveUser = document.querySelector(".modal__delete-user");
const modalUpdateUser = document.querySelector(".modal__update-user");
const btnsCloseModal = document.querySelectorAll(".modal__close--btn");
const btnsCancel = document.querySelectorAll(".btn__cancel--admin");
const btnAdmin = document.querySelectorAll(".btn__admin");
const revealCredentials = document.querySelector(".reveal__credentials");

const btnSettings = document.querySelectorAll(".btn__settings");
const overlay = document.querySelector(".overlay");

// ADMIN MODAL WINDOWS
const openModalAddUser = function () {
  modalAddUser.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const openModalRemoveUser = function () {
  modalRemoveUser.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const openModalUpdateUser = function () {
  modalUpdateUser.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const openRevealCredentials = function () {
  revealCredentials.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// Close Modal
const closeModal = function () {
  modalAddUser.classList.add("hidden");
  modalRemoveUser.classList.add("hidden");
  modalUpdateUser.classList.add("hidden");
  revealCredentials.classList.add("hidden");
  overlay.classList.add("hidden");
};

// OPening different Modal windows
btnAdmin.forEach(btn => btn.addEventListener("click", openRevealCredentials));

btnSettings[0].addEventListener("click", openModalAddUser);
btnSettings[1].addEventListener("click", openModalRemoveUser);
btnSettings[2].addEventListener("click", openModalUpdateUser);

// Closing all types of modal windows
btnsCloseModal.forEach(btn => btn.addEventListener("click", closeModal));
btnsCancel.forEach(btn => btn.addEventListener("click", closeModal));

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

//////////////////////////////////////////////////////////
// PAGE NAVIGATION (SMOOTH SCROLL)

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    if (id === "#") return;
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//////////////////////////////////////////////////////////
// MENU FADE ANIMATION
const nav = document.querySelector(".nav");

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
// REFER NOTES for why bind method is used in the event handler
nav.addEventListener("mouseout", handleHover.bind(1));

//////////////////////////////////////////////////////////
// STICKY NAVIGATION

// Implementation of Sticky navigation using Intersection Observer API
const header = document.querySelector("header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// DATA FILLING
const userLC = localStorage.getItem("user");

let user;
if (userLC) {
  user = JSON.parse(userLC);
  console.log(user);
  if (user) {
    const avatar = document.querySelector(".admin__img");
    const userName = document.querySelector(".admin__name");
    // const casesSolved = document.querySelector(".admin__cases-solved");
    // const designation = document.querySelector("");

    avatar.src = user.avatar;
    userName.textContent = user.userName;
  }
}

//LOGOUT
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.replace("http://127.0.0.1:5500/client/index.html");
});
