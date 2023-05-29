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
  const generateActions = imagesAvailable => {
    if (imagesAvailable) {
      return `<button class="btn__accept">Accept</button>
      <button class="btn__reject">Reject</button>
      <button class="btn__show-images">Images</button>
      `;
    } else {
      return `<button class="btn__accept">Accept</button>
      <button class="btn__reject">Reject</button>`;
    }
  };

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
    ${generateActions(Array.isArray(crime.images) && crime.images.length > 0)}
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
  const showImagesBtn = document.querySelectorAll(".btn__show-images");

  showImagesBtn.forEach(btn => btn.addEventListener("click", openImageModal));

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

// CRIME IMAGES
const crimeImages = document.querySelector(".crime_images");
const crimeOverlay = document.querySelector(".login__overlay");
const crimeModal = document.querySelector(".login__modal");

crimeOverlay.addEventListener("click", e => {
  closeImageModal();
});

const openImageModal = async e => {
  const item = e.target.closest(".crimes__pending-list-item");

  if (item) {
    const id = item.dataset.id;
    const crime = crimes.find(crime => crime._id === id);
    if (!crime) return;
    const images = crime.images;
    if (!images || !Array.isArray(images) || images.length === 0) return;
    try {
      crimeImages.innerHTML = "";
      for (let imagePath of images) {
        const html = generateImageItem(
          `http://127.0.0.1:3000/image/${imagePath}`
        );
        crimeImages.insertAdjacentHTML("beforeend", html);
      }
      // getCrimesFromAPI();
    } catch (error) {
      console.log("ERROR ", error);
    }
  }

  crimeOverlay.classList.remove("hidden");
  crimeModal.classList.remove("hidden");
};

const closeImageModal = () => {
  crimeOverlay.classList.add("hidden");
  crimeModal.classList.add("hidden");
};

const generateImageItem = src => {
  return `
  <a 
  href="${src}"
  target="_blank"
  a>
  <img
    src="${src}"
    class="crime__images--image"
  />
    </a>`;
};

const fillImages = (images, id) => {
  if (Array.isArray(images) && images.length > 0) {
  }
};
