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

const btnAccept = document.querySelectorAll(".btn__accept");
const btnReject = document.querySelectorAll(".btn__reject");

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
// Accepting and Rejecting cases

const rejectCase = function (e) {
  const crime_item = e.target.closest(".crimes__pending-list-item");
  crime_item.remove();
};

const acceptCase = function (e) {
  const markup = `
    <li class="crime__solved">
      <table class="solved__table">
        <colgroup>
          <col span="1" style="width: 10%" />
          <col span="1" style="width: 70%" />
          <col span="1" style="width: 10%" />
          <col span="1" style="width: 10%" />
        </colgroup>
        <thead class="solved__table-thead">
          <tr>
            <th colspan="4">Accepted Crime To take action</th>
          </tr>
        </thead>
        <tbody class="solved__table-tbody">
          <tr>
            <th>Location</th>
            <th>Details</th>
            <th>Date</th>
            <th>Officers Deployed</th>
          </tr>
          <tr>
            <td><p>Entered Location</p></td>
            <td>
              <p>
                Entered Data
              </p>
            </td>
            <td>Entered Date</td>
            <td>Entered Number</td>
          </tr>
        </tbody>
      </table>
    </li>
`;
  console.log(e.target);

  solvedCrimesList.insertAdjacentHTML("afterbegin", markup);
  rejectCase(e);
  // moveCaseToSolved();
};

btnAccept.forEach(btn => btn.addEventListener("click", acceptCase));

btnReject.forEach(btn => btn.addEventListener("click", rejectCase));

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

////////////////////FILLING CRIMES/////////////////////////////
let crimes = [];
const generateCrimeItem = (crime, isPending) => {
  if (isPending)
    return `<li class="crime__solved">
  <table class="solved__table">
    <colgroup>
      <col span="1" style="width: 20%" />
      <col span="1" style="width: 10%" />
      <col span="1" style="width: 50%" />
      <col span="1" style="width: 10%" />
      <col span="1" style="width: 10%" />
    </colgroup>
    <thead class="solved__table-thead">
      <tr>
        <th colspan="6">Stolen Gauntlet Crime</th>
      </tr>
    </thead>
    <tbody class="solved__table-tbody">
      <tr>
        <th>Location</th>
        <th>Date</th>
        <th>Details</th>
        <th>Criminal Name</th>
        <th>Criminal Age</th>
        <th>People Involved</th>
      </tr>
      <tr>
        <td><p>${crime.suspectedLocation}</p></td>
        <td>
          <p>
           ${new Date(crime.createdAt).toLocaleDateString()}
          </p>
        </td>
        <td>${crime.tip}</td>
        <td>${crime.criminalName}</td>
        <td>${crime.criminalAge}</td>
        <td>${crime.involvedPeople}</td>
      </tr>
    </tbody>
  </table>
</li>`;
  else
    return `<li class="crimes__pending-list-item">
  <div class="crime__pending">
    <table class="pending__table">
      <colgroup>
        <col span="1" style="width: 10%" />
        <col span="1" style="width: 70%" />
        <col span="1" style="width: 10%" />
        <col span="1" style="width: 10%" />
        <col span="1" style="width: 10%" />
      </colgroup>
      <thead class="pending__table-thead">
        <tr>
          <th colspan="4"></th>
        </tr>
      </thead>
      <tbody class="pending__table-tbody">
        <tr>
          <th>Location</th>
          <th>Submitted Tip</th>
          <th>Prime Suspect</th>
          <th>Number of people involved</th>
        </tr>
        <tr>
          <td><p>${crime.suspectedLocation}</p></td>
          <td>
            <p>
              ${crime.tip}
            </p>
          </td>
          <td>${crime.criminalName}</td>
          <td>${crime.involvedPeople}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="btns__action">
    <button class="btn__accept">Accept</button>
    <button class="btn__reject">Reject</button>
  </div>
</li>`;
};
const fillCrimes = () => {
  crimes.forEach(crime => {
    if (crime.isPending) {
      const html = generateCrimeItem(crime, false);
      if (html) pendingCrimesList.insertAdjacentHTML("beforeend", html);
    } else {
      const html = generateCrimeItem(crime, true);
      if (html) solvedCrimesList.insertAdjacentHTML("beforeend", html);
    }
  });
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
