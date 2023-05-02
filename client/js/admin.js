"use strict";

const modalAddUser = document.querySelector(".modal__add-user");
const modalRemoveUser = document.querySelector(".modal__delete-user");
const modalUpdateUser = document.querySelector(".modal__update-user");
const btnsCloseModal = document.querySelectorAll(".modal__close--btn");
const btnsCancel = document.querySelectorAll(".btn__cancel--admin");
const btnAdmin = document.querySelectorAll(".btn__admin");
const revealCredentials = document.querySelector(".reveal__credentials");

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

const officerName = document.querySelector(".adminForm--input--officerName");
const officerDesignation = document.querySelector(
  ".adminForm--input--designation"
);
const officerAvatar = document.querySelector(".adminForm--input--avatar");

let officerId;

const openModalUpdateUser = async function (e) {
  //select inputs
  const user = e.target.closest(".user");
  if (user) {
    const { userid, name: userName, designation, avatar } = user.dataset;

    officerId = userid;

    officerName.value = userName;
    officerDesignation.value = designation;
    officerAvatar.value = avatar;
  }
  // Show modal
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
  // rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// DATA MANIPULATION FNS

const btnUpdateOfficer = document.querySelector(".btn-update-officer");
const addOfficerForm = document.querySelector(".addOfficerForm");
const totalOfficers = document.querySelector(".total__officers");
const totalSeniorOfficers = document.querySelector(".total__senior__officers");

btnUpdateOfficer.addEventListener("click", updateOfficer);
addOfficerForm.addEventListener("submit", addOfficer);

const fetchDetails = async () => {
  try {
    const response = await fetch("http://localhost:3000/me", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      const extraDetails = data?.extraDetails;
      totalOfficers.textContent = `${extraDetails.totalOfficers} Officers`;
      totalSeniorOfficers.textContent = `${extraDetails.totalSeniorOfficers} Officers`;
      if (extraDetails) {
        localStorage.setItem("extraDetails", JSON.stringify(extraDetails));
      }
    }
  } catch (error) {
    console.log(error);
  }
};

async function addOfficer(e) {
  e.preventDefault();
  const formData = new FormData(addOfficerForm);

  const reqObj = {};

  // iterate through entries...
  for (let pair of formData.entries()) {
    reqObj[pair[0]] = pair[1];
  }

  console.log(reqObj);

  try {
    const response = await fetch("http://localhost:3000/createUser", {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        officers.push(data.user);
        fillOfficers();
        fetchDetails();
        closeModal();
        alert("Officer added");
      }
    }
  } catch (error) {
    alert("Something went wrong");
  }
}

async function updateOfficer(e) {
  e.preventDefault();
  const reqObj = {
    userId: officerId,
    userName: officerName.value,
    designation: officerDesignation.value,
    avatar: officerAvatar.value,
  };
  // DATA FROM FORM

  try {
    const response = await fetch("http://localhost:3000/editUser", {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const newOfficers = officers.map(officer => {
        const newOff = { ...officer };
        newOff.userId = officerId;
        if (officer._id === officerId) {
          newOff.userName = reqObj.userName;
          newOff.designation = reqObj.designation;
          newOff.avatar = reqObj.avatar;
          return newOff;
        }
        return officer;
      });
      officers = newOfficers;
      fetchDetails();
      fillOfficers();
      closeModal();
      alert("Officer updated");
    }
  } catch (error) {
    alert("Something went wrong");
  }
}

async function removeOfficer(e) {
  const target = e.target;
  const user = target.closest(".user");
  const id = user.dataset.userid;

  try {
    const reqObj = {
      userId: id,
    };
    const response = await fetch("http://localhost:3000/deleteUser", {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      officers = officers.filter(officer => officer._id !== id);
      fetchDetails();
      fillOfficers();
    }
  } catch (error) {
    console.log("ERROR DELETEING USER ", error);
  }
}

// DATA FILLING
let officers = [];

const generateOfficerItem = officer => {
  const dob = officer.dateOfBirth;
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  return `
  <div class="user" data-userId="${officer._id}" data-name="${
    officer.userName
  }" data-designation="${officer.designation}" data-avatar="${officer.avatar}">
  <div class="user__img">
    <img src="${
      officer.avatar ? officer.avatar : "../imgs/person.png"
    }" alt="Registered User" />
  </div>

  <div class="user__user">
    <p class="user__name">
      Name: <span class="name">${officer.userName}</span>
    </p>
    <p class="user__designation">
      Designation: <span class="designation">${
        officer.designation === "senior_officer"
          ? "Senior Officer"
          : "Junior Officer"
      }</span>
    </p>
    <p class="user__age">Age: <span class="age">${age}</span></p>
  </div>

  <div class="user__credentials">
    <button class="btn btn__settings btn__settings-update">
      <span>Update Officer data</span>
    </button>
    <button class="btn btn__settings btn__settings-remove">
      <span>Remove Officer</span>
    </button>
  </div>
</div>
  `;
};

const fillOfficers = () => {
  const usersContainer = document.querySelector(".users");
  usersContainer.innerHTML = "";

  if (Array.isArray(officers)) {
    officers.forEach(officer => {
      usersContainer.insertAdjacentHTML(
        "beforeend",
        generateOfficerItem(officer)
      );
    });
  }

  const btnSettingsAdd = document.querySelectorAll(".btn__settings-add");
  const btnSettingsRemove = document.querySelectorAll(".btn__settings-remove");
  const btnSettingsUpdate = document.querySelectorAll(".btn__settings-update");

  btnSettingsAdd.forEach(btn =>
    btn.addEventListener("click", openModalAddUser)
  );
  btnSettingsRemove.forEach(btn =>
    btn.addEventListener("click", removeOfficer)
  );
  btnSettingsUpdate.forEach(btn =>
    btn.addEventListener("click", openModalUpdateUser)
  );
};

const userLC = localStorage.getItem("user");
const tokenLC = localStorage.getItem("authToken");
const extraDetailsLC = localStorage.getItem("extraDetails");

if (extraDetailsLC) {
  const extraDetails = JSON.parse(extraDetailsLC);
  console.log(extraDetails);

  if (extraDetails.solvedCases) {
    const solvedCases = document.querySelector(".total__cases");
    solvedCases.textContent = `${extraDetails.solvedCases} Solved Cases`;
  }

  if (extraDetails.totalOfficers) {
    totalOfficers.textContent = `${extraDetails.totalOfficers} Officers`;
  }

  if (extraDetails.totalSeniorOfficers) {
    totalSeniorOfficers.textContent = `${extraDetails.totalSeniorOfficers} Officers`;
  }

  // RENDER OFFICERS
  if (extraDetails.officers) {
    officers = extraDetails.officers;
    fillOfficers();
  }
}

let user;
let token;
if (userLC) {
  user = JSON.parse(userLC);
  console.log(user);
  if (user) {
    const avatar = document.querySelector(".admin__img");
    const userName = document.querySelector(".admin__name");
    const adminAge = document.querySelector(".admin__age");

    avatar.src = user.avatar;
    userName.textContent = user.userName;
    const dob = user.dateOfBirth;
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    adminAge.textContent = `${age} Years`;
  }
}
if (tokenLC) {
  token = JSON.parse(tokenLC);
  fetchDetails();
}

//LOGOUT
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.replace("http://127.0.0.1:5500/client/index.html");
});
