"use strict";

//////////////////////////////////////////////////////////
// All variables

const modalLogin = document.querySelector(".modal__login");
const modalReport = document.querySelector(".modal__report");
const overlay = document.querySelector(".overlay");
const btnsCloseModal = document.querySelectorAll(".btn--close-modal");
const btnsCancel = document.querySelectorAll(".btn__cancel");
const btnsOpenModalReport = document.querySelectorAll(
  ".btn--show-modal-report"
);
const btnOpenModalLogin = document.querySelector(".btn--show-modal-login");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

///////////////////////////////////////////////////////////
// MODAL WINDOW

const openModalLogin = function (e) {
  e.preventDefault();
  modalLogin.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const openModalReport = function (e) {
  e.preventDefault();
  modalReport.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modalLogin.classList.add("hidden");
  modalReport.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModalLogin.addEventListener("click", openModalLogin);

btnsOpenModalReport.forEach(btn =>
  btn.addEventListener("click", openModalReport)
);

btnsCloseModal.forEach(btn => btn.addEventListener("click", closeModal));
overlay.addEventListener("click", closeModal);

btnsCancel.forEach(btn => btn.addEventListener("click", closeModal));

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

///////////////////////////////////////////////////////////
// BUTTON SCROLLING

btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
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
// TABBED COMPONENT

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  tabsContent.forEach(c => c.classList.remove("operations__content--active"));

  // Active tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//////////////////////////////////////////////////////////
// MENU FADE ANIMATION

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
const header = document.querySelector(".header");
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

//////////////////////////////////////////////////////////
// REVEAL SECTIONS (SEE video & REFER Notes)

const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////////////////////////////////////////////////////////
// LAZY LOADING IMAGES

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////
// SLIDER COMPONENT
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach(dot => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////////////////////
const submitCrimeForm = document.querySelector(".crimeForm");
const inputs = document.querySelectorAll(".crimeForm--input");
submitCrimeForm.addEventListener("submit", e => {
  e.preventDefault();
  let reqObj = {};
  inputs.forEach(input => {
    reqObj[input.name] = input.value;
  });
  console.log(reqObj);
  fetch("http://127.0.0.1:3000/reportCrime", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqObj),
  })
    .then(response => {
      if (!response.ok) {
        alert("Something went wrong");
      } else {
        alert("Crime reported");
      }
    })
    .catch(() => {
      alert("Something went wrong");
    });
});

////////////////LOGIN FORM///////////////////////
const loginForm = document.querySelector(".loginForm");
const loginFormInputs = document.querySelectorAll(".loginForm--input");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  let reqObj = {};
  loginFormInputs.forEach(input => {
    reqObj[input.name] = input.value;
  });
  fetch("http://localhost:3000/login", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqObj),
    method: "POST",
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log("DATA", data);
      if (!data.success) {
        return alert(data?.message);
      }
      window.open("http://127.0.0.1:5500/client/pages/login.html");
      localStorage.setItem("user", JSON.stringify(data?.user));
      localStorage.setItem("authToken", JSON.stringify(data?.token));
    })
    .catch(error => {
      console.log(error);
    });
  console.log("Submit", reqObj);
});
