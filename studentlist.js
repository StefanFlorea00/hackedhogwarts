"use strict";

let allStudents = [];
let displayedStudents = [];
let expelledStudents = [];
let prefectHouses = [];
let allFamilies = [];

const HACK_REMOVE_SQUAD_INTERVAL = 8000;
let HACKED = false;

const Student = {
  fullName: "",
  firstName: "",
  lastName: "",
  nickName: "",
  middleName: "",
  gender: "",
  house: "",
  img: "",
  bloodStatus: "muggle",
  prefect: false,
  squad: false,
  expelled: false,
  hacker: false,
};

const House = {
  name: "",
  students: [],
};

const Family = {
  half: [],
  pure: [],
};

init();

function init() {
  const request = async () => {
    loadJSON("https://petlatkea.dk/2020/hogwarts/families.json", "families");
    loadJSON("https://petlatkea.dk/2020/hogwarts/students.json", "students");
  };
  request();

  addSheetSelect();
  addModalEvents();
  addSort();
  addFilter();
  addSearch();
  addHackTheSystem();
  setTimeout(() => {
    displayList(allStudents);
  }, 150);
}

function addHackTheSystem() {
  document.querySelector(".title-img").addEventListener("click", hackTheSystem);
}

function addSearch() {
  const search = document.querySelector("#search");
  search.addEventListener("input", searchStudents);
}

function addSheetSelect() {
  document.querySelector("[data-info=list-current]").style.fontWeight = "bold";

  document
    .querySelector("[data-info=list-current]")
    .addEventListener("click", function () {
      displayList(displayedStudents);
      this.style.fontWeight = "bold";
      document.querySelector("[data-info=list-expelled]").style.fontWeight =
        "initial";
    });
  document
    .querySelector("[data-info=list-expelled]")
    .addEventListener("click", function () {
      displayList(expelledStudents);
      this.style.fontWeight = "bold";
      document.querySelector("[data-info=list-current]").style.fontWeight =
        "initial";
    });
}
//TODO: Fix search empty
function searchStudents() {
  let value = this.value;
  console.log(value);
  let searchedStudents = [];
  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].fullName.search(value) != -1) {
      searchedStudents.push(allStudents[i]);
      displayedStudents = searchedStudents;
      displayList(displayedStudents);
    }
  }
  if (value == "") {
    displayedStudents = allStudents;
    displayList(displayedStudents);
  }
}

//TODO: Fix filtering
function addFilter() {
  const filters = document.querySelectorAll("[data-action=filter]");
  let lastActive = filters[0];
  let active = false;
  for (const filter of filters) {
    filter.addEventListener("click", function () {
      if (!active) {
        this.classList.toggle("active");
        displayList(filterStudents(this.dataset.filter));
        active = true;
      } else if (filter.classList.contains("active")) {
        document
          .querySelector("#filter-wrapper .active")
          .classList.toggle("active");
        displayedStudents = allStudents;
        displayList(allStudents);
        active = false;
      }
      lastActive = this;
    });
  }
}

function updateListInfo() {
  const infoSection = document.querySelector("#info-section");

  infoSection.querySelector("[data-info=all]").textContent =
    "Total students: " + allStudents.length;
  infoSection.querySelector("[data-info=displayed]").textContent =
    "Displayed students: " + displayedStudents.length;
  infoSection.querySelector("[data-info=expelled]").textContent =
    "Expelled students: " + expelledStudents.length;
  infoSection.querySelector("[data-info=inquisitorial]").textContent =
    "Inquisitorial Squad Members: " + getSquadStudents(allStudents);
  infoSection.querySelector("[data-info=prefects]").textContent =
    "Prefects: " + getAllPrefects(prefectHouses);
}

function getSquadStudents(students) {
  let j = 0;
  for (let i = 0; i < students.length; i++) {
    if (students[i].squad) j++;
  }
  return j;
}

function getAllPrefects(houses) {
  let allPrefects = [];
  for (let i = 0; i < houses.length; i++) {
    for (let j = 0; j < houses[i].students.length; j++) {
      allPrefects.push(
        houses[i].students[j].firstName.charAt(0) +
          " " +
          houses[i].students[j].lastName
      );
    }
  }
  return allPrefects;
}
// for (let i = 0; i < array.length; i++) {
//   if (array[i].prefect == true)
//     allPrefects.push(array[i].firstName.charAt(0) + " " + array[i].lastName);
// }

function filterStudents(field) {
  displayedStudents = allStudents;
  let filteredStudents = [];
  displayedStudents = filterByField(field, displayedStudents);
  return (filteredStudents = filterByField(field, displayedStudents));
}

function filterByField(field, array) {
  console.log(field, array);
  return array.filter((student) => student.house.toLowerCase() == field);
}

function addSort() {
  const sorters = document.querySelectorAll("[data-action=sort]");
  for (const sorter of sorters) {
    sorter.addEventListener("click", function () {
      if (this.dataset.sortDirection == "asc") {
        this.dataset.sortDirection = "desc";
      } else if (this.dataset.sortDirection == "desc") {
        this.dataset.sortDirection = "asc";
      }
      displayList(sortStudents(this.dataset.sort, this.dataset.sortDirection));
    });
  }
}

function sortStudents(field, direction) {
  let sortedStudents;
  return (sortedStudents = sortByField(field, displayedStudents, direction));
}

function sortByField(field, array, direction) {
  let switchDirection;
  console.log(field, array, direction);
  if (direction == "asc") switchDirection = 1;
  else if (direction == "desc") switchDirection = -1;
  return array.sort(function (a, b) {
    if (a[field] < b[field]) {
      return -1 * switchDirection;
    }
    if (a[field] > b[field]) {
      return 1 * switchDirection;
    }
    return 0;
  });
}

function addModalEvents() {
  const modal = document.querySelector("#student-modal");
  const modalSpan = document.querySelector(".close");
  modalSpan.addEventListener("click", function () {
    modal.style.display = "none";
    modal.querySelector(".modal-content").className = "modal-content";
    removeBtnEvents(modal);
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modal.querySelector(".modal-content").className = "modal-content";
      removeBtnEvents(modal);
    }
  });
}

function removeBtnEvents(modal) {
  const modalContent = modal.querySelector(".modal-content");

  const expellBtn = modalContent.querySelector("#expell-btn"),
    expellBtnClone = expellBtn.cloneNode(true);
  expellBtnClone.style.pointerEvents = "auto";
  expellBtn.parentNode.replaceChild(expellBtnClone, expellBtn);

  const prefectBtn = modalContent.querySelector("#prefect-btn"),
    prefectBtnClone = prefectBtn.cloneNode(true);
  prefectBtnClone.style.pointerEvents = "auto";
  prefectBtn.parentNode.replaceChild(prefectBtnClone, prefectBtn);

  const promoteBtn = modalContent.querySelector("#promote-btn"),
    promoteBtnclone = promoteBtn.cloneNode(true);
  promoteBtnclone.style.pointerEvents = "auto";
  promoteBtn.parentNode.replaceChild(promoteBtnclone, promoteBtn);
}

async function loadJSON(jsonLink, type) {
  const response = await fetch(jsonLink);
  const jsonData = await response.json();

  prepareObjects(jsonData, type);
}

function prepareObjects(jsonData, type) {
  if (type == "students") {
    allStudents = jsonData.map(prepareObjectStudent);
    displayedStudents = allStudents;
    addHouses();
  } else if (type == "families") {
    allFamilies = prepareObjectFamilies(jsonData);
  }
}

function addHouses() {
  for (let i = 0; i <= 3; i++) {
    let house = Object.create(House);
    house.students = [];
    if (i == 0) house.name = "gryffindor";
    else if (i == 1) house.name = "slytherin";
    else if (i == 2) house.name = "hufflepuff";
    else if (i == 3) house.name = "ravenclaw";
    prefectHouses.push(house);
  }
}

//JSON.parse(JSON.stringify(Student))

function prepareObjectStudent(jsonObject) {
  const student = Object.create(Student);
  console.log(getStudentAttr(jsonObject, "fullname"));

  student.fullName = getStudentAttr(jsonObject, "fullname");
  student.firstName = capitalizeFirstLetter(getStudentFirstName(jsonObject));

  if (getStudentMiddleNames(jsonObject).charAt(0) == `"`) {
    student.nickName = capitalizeFirstLetter(getStudentMiddleNames(jsonObject));
  } else
    student.middleName = capitalizeFirstLetter(
      getStudentMiddleNames(jsonObject)
    );

  student.lastName = capitalizeFirstLetter(getStudentLastName(jsonObject));
  student.gender = capitalizeFirstLetter(getStudentAttr(jsonObject, "gender"));
  student.house = capitalizeFirstLetter(getStudentAttr(jsonObject, "house"));
  student.img = getStudentImg(student.firstName, student.lastName);
  student.bloodStatus = setStudentBloodStatus(student.lastName);

  return student;
}

function prepareObjectFamilies(jsonObject) {
  const families = Object.create(Family);

  families.half = jsonObject.half;
  families.pure = jsonObject.pure;

  return families;
}

function setStudentBloodStatus(studentName) {
  if (allFamilies.half.find((familyName) => familyName == studentName)) {
    return "half";
  } else if (allFamilies.pure.find((familyName) => familyName == studentName)) {
    return "pure";
  } else return "muggle";
}

function getStudentAttr(jsonObject, attr) {
  return jsonObject[attr].toLowerCase().trim();
}

function getStudentFirstName(jsonObject) {
  return getStudentAttr(jsonObject, "fullname").split(" ")[0];
}

function getStudentMiddleNames(jsonObject) {
  const fullName = getStudentAttr(jsonObject, "fullname");
  if (fullName.split(" ").length > 2) {
    const middleName = fullName.slice(
      fullName.indexOf(" ") + 1,
      fullName.lastIndexOf(" ")
    );
    return middleName;
  } else return "";
}

function getStudentLastName(jsonObject) {
  const fullName = getStudentAttr(jsonObject, "fullname");

  if (fullName.split(" ").length <= 1) {
    //FIXME
    return "[not set]";
  }
  return fullName.slice(fullName.lastIndexOf(" ") + 1, fullName.length);
}

function getStudentImg(fname, lname) {
  return lname.toLowerCase() + "_" + fname.toLowerCase().charAt(0);
}

function capitalizeFirstLetter(name) {
  if (name) {
    if (name.split("-").length > 1) {
      const splitName = name.split("-");
      return (
        splitName[0].charAt(0).toUpperCase() +
        splitName[0].slice(1) +
        "-" +
        splitName[1].charAt(0).toUpperCase() +
        splitName[1].slice(1)
      );
    }
    if (name.charAt(0) == `"`) {
      return name.charAt(0) + name.charAt(1).toUpperCase() + name.slice(2);
    } else return name.charAt(0).toUpperCase() + name.slice(1);
  } else return "";
}

function displayList(students) {
  document.querySelector("#main-section").innerHTML = "";
  students.forEach(displayStudent);
  updateListInfo();
}

function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  clone.querySelector("[data-field=name]").textContent =
    student.firstName + " " + student.middleName + " " + student.lastName;

  clone.querySelector("[data-field=gender]").src =
    "./img/" + student.gender + ".png";
  clone.querySelector("[data-field=blood]").textContent = capitalizeFirstLetter(
    student.bloodStatus
  );
  clone.querySelector("[data-field=img]").src =
    "./img/student-img/" + student.img + ".png";
  clone.querySelector("[data-field=houseimg]").src =
    "./img/" + student.house.trim().toLowerCase() + ".png";
  let modalBtn = clone.querySelector(".details-btn");

  if (student.expelled) {
    clone.querySelector("[data-field=expelled]").textContent = "EXPELLED";
  }

  modalBtn.addEventListener("click", function () {
    displayStudentDetails(student);
  });

  document.querySelector("#main-section").appendChild(clone);
}

function displayStudentDetails(student) {
  const modal = document.querySelector("#student-modal");
  console.log(student);
  updateStudentDetailsDisplay(modal, student);
  addStudentDisplayEvents(modal, student);
}

function addStudentDisplayEvents(modal, student) {
  modal.querySelector("#expell-btn").addEventListener("click", function () {
    expellStudent(student);
    modal.querySelector("#prefect-btn").style.pointerEvents = "none";
    modal.querySelector("#promote-btn").style.pointerEvents = "none";
  });

  modal.querySelector("#prefect-btn").addEventListener("click", function () {
    if (isPrefectFromHouse(student, getPrefectHouse(student))) {
      modal.querySelector("#prefect-btn").textContent = "Set Prefect";
      setPrefect(student, getPrefectHouse(student), false);
    } else {
      modal.querySelector("#prefect-btn").textContent = "Remove Prefect";
      setPrefect(student, getPrefectHouse(student), true);
    }
  });

  modal.querySelector("#promote-btn").addEventListener("click", function () {
    if (isInSquad(student)) {
      modal.querySelector("#promote-btn").textContent = "Add to Squad";
      setSquad(student, false);
    } else {
      if (setSquad(student, true)) {
        modal.querySelector("#promote-btn").textContent = "Remove From Squad";
        setSquad(student, true);
      } else {
        document.querySelector("#warning").style.display = "block";
        document.querySelector("#warning").textContent =
          "Student does not meet requirements for being in the inquisitorial squad.";
      }
    }
  });
}

function updateStudentDetailsDisplay(modal, student) {
  modal.style.display = "block";
  modal
    .querySelector(".modal-content")
    .classList.add(student.house.toLowerCase());

  modal.querySelector("[data-field=fname]").textContent = student.firstName;
  if (student.middleName != "") {
    modal.querySelector("[data-field=mname]").parentNode.style.display =
      "block";
    modal.querySelector("[data-field=mname]").textContent = student.middleName;
  } else {
    modal.querySelector("[data-field=mname]").parentNode.style.display = "none";
  }
  if (student.nickName != "") {
    modal.querySelector("[data-field=nname]").parentNode.style.display =
      "block";
    modal.querySelector("[data-field=nname]").textContent = student.nickName;
  } else {
    modal.querySelector("[data-field=nname]").parentNode.style.display = "none";
  }
  modal.querySelector("[data-field=lname]").textContent = student.lastName;

  modal.querySelector("[data-field=houseimg]").src =
    "./img/" + student.house.trim().toLowerCase() + ".png";
  modal.querySelector("[data-field=img]").src =
    "./img/student-img/" + student.img + ".png";

  modal.querySelector("#warning").style.display = "none";

  if (student.hacker) {
    modal.querySelector("#expell-btn").style.pointerEvents = "none";
    modal.querySelector("[data-field=details3]").textContent =
      "I'm in the mainframe";
  }

  if (student.expelled) {
    modal.querySelector("#prefect-btn").style.pointerEvents = "none";
    modal.querySelector("#promote-btn").style.pointerEvents = "none";
    modal.querySelector("#expell-btn").style.pointerEvents = "none";
  }

  if (isPrefectFromHouse(student, getPrefectHouse(student))) {
    modal.querySelector("[data-field=details]").textContent =
      "Student is prefect";
  } else {
    modal.querySelector("[data-field=details]").textContent = "";
  }
  if (isInSquad(student)) {
    modal.querySelector("[data-field=details2]").textContent =
      "Student is in squad";
  } else {
    modal.querySelector("[data-field=details2]").textContent = "";
  }

  console.log(
    "PREF:",
    isPrefectFromHouse(student, getPrefectHouse(student)),
    "SQUAD:",
    isInSquad(student)
  );

  if (isPrefectFromHouse(student, getPrefectHouse(student))) {
    modal.querySelector("#prefect-btn").textContent = "Remove Prefect";
  } else {
    modal.querySelector("#prefect-btn").textContent = "Set Prefect";
  }

  if (isInSquad(student)) {
    modal.querySelector("#promote-btn").textContent = "Remove From Squad";
  } else {
    modal.querySelector("#promote-btn").textContent = "Add to Squad";
  }
}

function getPrefectHouse(student) {
  for (let i = 0; i <= 3; i++) {
    if (student.house.toLowerCase() === prefectHouses[i].name) {
      return prefectHouses[i];
    }
  }
}

function isInSquad(student) {
  return student.squad;
}

function isPrefect(student) {
  if (student.prefect) return true;
  else return false;
}

function isPrefectFromHouse(student, house) {
  for (let i = 0; i < house.students.length; i++) {
    if (student == house.students[i]) return true;
  }
  return false;
}

function expellStudent(student) {
  console.log(student);
  if (!student.expelled) {
    student.expelled = true;
    const studentIndex = allStudents.findIndex(
      (searchedStudent) => searchedStudent == student
    );
    if (studentIndex > -1) allStudents.splice(studentIndex, 1);
    expelledStudents.push(student);
    console.log(expelledStudents);
    displayList(displayedStudents);
  }
}

function setSquad(student, setter) {
  if (
    student.bloodStatus == "pure" &&
    student.house.toLowerCase() == "slytherin"
  ) {
    student.squad = setter;
    console.log("PURE", student.squad);
    updateListInfo();
    return true;
  } else {
    return false;
  }
}

function setPrefect(student, house, setter) {
  if (setter) {
    if (house.students.length < 2) {
      house.students.push(student);
    } else if (house.students.length == 2) {
      //TODO add notification
      const lastStudent = house.students[house.students.length - 1];
      document.querySelector("#warning").style.display = "block";
      document.querySelector("#warning").textContent =
        "Warning, student " +
        lastStudent.firstName +
        " " +
        lastStudent.lastName +
        " was removed from prefects.";
      house.students.pop();
      house.students.push(student);
    }
  } else {
    for (let i = 0; i <= house.students.length; i++) {
      if (student == house.students[i]) house.students.splice(i, 1);
    }
  }
  console.log(house.name, house.students);
  updateListInfo();
}

function hackTheSystem() {
  HACKED = true;
  changeTheme(HACKED);
  hackBlood();
  hackStudent();
  hackInquisitorialSquad();
}

function hackStudent() {
  const newStudent = createHackerStudent();
  allStudents.unshift(newStudent);
  displayList(allStudents);
}

function createHackerStudent() {
  let student = Object.create(Student);
  student.firstName = "Stefan";
  student.middleName = "Andrei";
  student.lastName = "Florea";
  student.gender = "Boy";
  student.house = "Gryffindor";
  student.bloodStatus = "pure";
  student.img = "hacker";
  student.hacker = true;

  console.log(student);
  return student;
}

function hackBlood() {
  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].bloodStatus != "pure")
      allStudents[i].bloodStatus = "pure";
    else allStudents[i].bloodStatus = randomizeBloodStatus();
  }
  displayList(displayedStudents);
}

function randomizeBloodStatus() {
  switch (getRandomInt(2)) {
    case 0:
      console.log("muggle");
      return "muggle";
    case 1:
      console.log("half");
      return "half";
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function hackInquisitorialSquad() {
  setInterval(() => {
    if (findSquadStudents(allStudents).isFound) {
      allStudents[findSquadStudents(allStudents).index].squad = false;
      updateListInfo();
    }
  }, HACK_REMOVE_SQUAD_INTERVAL);
}

function findSquadStudents(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].squad == true)
      return {
        isFound: true,
        index: i,
      };
  }
  return false;
}

function changeTheme() {
  let root = document.documentElement;
  root.style.setProperty("--main-bg-color", "#000000");
  document.querySelector("body").style.backgroundColor = "black";
  document.querySelector("body").style.backgroundImage = "none";
  document.querySelector("body").style.fontFamily = "'VT323', cursive";
  document.querySelector(".title-section").style.filter = "hue-rotate(50deg)";
  root.style.setProperty("--main-font-color", "#003603");
  root.style.setProperty("--main-list-color", "#00b809");
  root.style.setProperty("--main-btn-color", "#000000");
  root.style.setProperty("--main-list-element-color", "#007d06");
  root.style.setProperty("--secundary-list-element-color", "#006b05");
  root.style.setProperty("--secundary-btn-color", "#000000");
}
