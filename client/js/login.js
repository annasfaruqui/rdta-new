"use strict";

const btnSolved = document.querySelector(".btn__solved");
const btnPending = document.querySelector(".btn__pending");

const solvedCrimesContainer = document.querySelector(".crimes__solved");
const pendingCrimesContainer = document.querySelector(".crimes__pending");

const solvedCrimesList = document.querySelector(".crimes__solved-list");
const pendingCrimesList = document.querySelector(".crimes__pending-list");

const crimeSolved = document.querySelectorAll(".crime__solved");
const crimePending = document.querySelectorAll(".crime__pending");

const policeContainer = document.querySelector(".police");
const policeOfficers = document.querySelectorAll(".police__officer");

const emptyListSolved = document.querySelector(".empty__list-solved");
const emptyListPending = document.querySelector(".empty__list-pending");

const policeOfficerImage = document.querySelector(".police__officer--image");

/////////////////////////////////////////////////////////
// Solved Cases and Pending Cases rendering

const btnClickAnimation = [
  {
    zIndex: 0,
    transform: "translateY(80px)",
    opacity: 0,
  },
  {
    transform: "translateY(40px)",
    opacity: 0.5,
    offset: 0.5,
  },
  {
    zIndex: 1,
    transform: "translateY(0)",
    opacity: 1,
  },
];

btnSolved.addEventListener("click", function () {
  if (!solvedCrimesContainer.classList.contains("hidden")) return;

  pendingCrimesContainer.classList.add("hidden");
  solvedCrimesContainer.classList.remove("hidden");
  solvedCrimesContainer.animate(btnClickAnimation, 500);
});

btnPending.addEventListener("click", function () {
  if (!pendingCrimesContainer.classList.contains("hidden")) return;

  solvedCrimesContainer.classList.add("hidden");
  pendingCrimesContainer.classList.remove("hidden");
  pendingCrimesContainer.animate(btnClickAnimation, 500);
});

///////////////////////////////////////////////////////////////
// In case of Empty Lists

///////////////////////////////////////////////////////////////
// Accepting and Rejecting cases

const rejectCase = async function (e) {
  const item = e.target.closest(".crimes__pending-list-item");
  if (item) {
    const id = item.dataset.id;
    try {
      await fetch("http://127.0.0.1:3000/deleteCrime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ id }),
      });
      item.remove();
    } catch (error) {
      console.log("ERROR ", error);
    }
  }
};

const acceptCase = async function (e) {
  const item = e.target.closest(".crimes__pending-list-item");
  if (item) {
    const id = item.dataset.id;
    try {
      await fetch("http://127.0.0.1:3000/crimeSolved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ id }),
      });
      getCrimesFromAPI();
    } catch (error) {
      console.log("ERROR ", error);
    }
  }
};

//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

const userLC = localStorage.getItem("user");
const tokenLC = localStorage.getItem("authToken");
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
  if (user.avatar) {
    policeOfficerImage.src = user.avatar;
  }
}
if (tokenLC) {
  token = JSON.parse(tokenLC);
  console.log(token);
}

logout.addEventListener("click", () => {
  localStorage.clear();
});

////////////////////FILLING CRIMES/////////////////////////////
let crimes = [];
const generateCrimeItem = (crime, isPending) => {
  if (isPending)
    return `<li class="crime__solved" data-id="${crime._id}">
  <div class="table">
      <div class="table__header"></div>

      <div class="table__items">
        <h2 class="column__title">Location</h2>
        <h3 class="column__content">${crime.suspectedLocation}</h3>

        <h2 class="column__title">Date</h2>
        <h3 class="column__content">${new Date(
          crime.createdAt
        ).toLocaleDateString()}</h3>

        <h2 class="column__title">Details</h2>
        <h3 class="column__content column__tip">${crime.tip}</h3>

        <h2 class="column__title">Criminal Name</h2>
        <h3 class="column__content">${crime.criminalName}</h3>

        <h2 class="column__title">Criminal Age</h2>
        <h3 class="column__content">${crime.criminalAge}</h3>

        <h2 class="column__title">People Involved</h2>
        <h3 class="column__content">${crime.involvedPeople}</h3>
      </div>
    </div>
</li>`;
  else
    return `<li class="crimes__pending-list-item" data-id="${crime._id}">
    <div class="crime__pending">
    <div class="table">
      <div class="table__header"></div>

      <div class="table__items">
        <h2 class="column__title">Location</h2>
        <h3 class="column__content">${crime.suspectedLocation}</h3>

        <h2 class="column__title">Date</h2>
        <h3 class="column__content">${new Date(
          crime.createdAt
        ).toLocaleDateString()}</h3>

        <h2 class="column__title">Details</h2>
        <h3 class="column__content column__tip">${crime.tip}</h3>

        <h2 class="column__title">Criminal Name</h2>
        <h3 class="column__content">${crime.criminalName}</h3>

        <h2 class="column__title">Criminal Age</h2>
        <h3 class="column__content">${crime.criminalAge}</h3>

        <h2 class="column__title">People Involved</h2>
        <h3 class="column__content">${crime.involvedPeople}</h3>
      </div>
    </div>
   </div>
   <div class="btns__action">
    <button class="btn__accept">Accept</button>
    <button class="btn__reject">Reject</button>
   </div>
  </li>`;
};

const fillCrimes = () => {
  pendingCrimesList.innerHTML = "";
  solvedCrimesList.innerHTML = "";
  crimes.forEach(crime => {
    if (crime.isPending) {
      const html = generateCrimeItem(crime, false);
      if (html) {
        // emptyList.remove();
        pendingCrimesList.insertAdjacentHTML("beforeend", html);
      }
    } else {
      const html = generateCrimeItem(crime, true);
      if (html) {
        solvedCrimesList.insertAdjacentHTML("beforeend", html);
      }
    }
  });

  const btnAccept = document.querySelectorAll(".btn__accept");
  const btnReject = document.querySelectorAll(".btn__reject");

  btnAccept.forEach(btn => btn.addEventListener("click", acceptCase));

  btnReject.forEach(btn => btn.addEventListener("click", rejectCase));
};

const getCrimesFromAPI = async () => {
  const response = await fetch("http://127.0.0.1:3000/crimes", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  const newCrimes = data.crimes;
  if (Array.isArray(newCrimes) && newCrimes.length !== 0) {
    crimes = newCrimes;
    fillCrimes();
  }
};

getCrimesFromAPI();
