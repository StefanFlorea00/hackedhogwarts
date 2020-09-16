let allStudents = [];
let displayedStudents = [];
let expelledStudents = [];

const Student = {
  fullName: "",
  firstName: "",
  lastName: "",
  nickName: "",
  middleName: "",
  gender: "",
  house: "",
  img: "",
  prefect: false,
  squad: false,
  expelled: false,
};

init();

function init() {
  loadJSON("https://petlatkea.dk/2020/hogwarts/students.json");
  addModalEvents();
  addSort();
  addFilter();
  addSearch();
  setTimeout(() => {
    displayList(allStudents);
    updateListInfo();
  }, 50);
}

function addSearch() {
  const search = document.querySelector("#search");
  search.addEventListener("input", searchStudents);
}

//TODO: Fix search empty
function searchStudents() {
  let value = this.value;
  console.log(value);
  let searchedStudents = [];
  for (let i = 0; i < displayedStudents.length; i++) {
    if (displayedStudents[i].fullName.search(value) != -1) {
      searchedStudents.push(displayedStudents[i]);
      displayedStudents = searchedStudents;
      displayList(displayedStudents);
    }
  }
  if (value == "") {
    displayedStudents == allStudents;
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
}

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
  let sortedStudents = [];
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
  var modal = document.querySelector("#student-modal");
  var modalSpan = document.querySelector(".close");
  modalSpan.onclick = function () {
    modal.style.display = "none";
    modal.querySelector(".modal-content").className = "modal-content";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modal.querySelector(".modal-content").className = "modal-content";
    }
  };
}

async function loadJSON(jsonLink) {
  const response = await fetch(jsonLink);
  const jsonData = await response.json();

  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  displayedStudents = allStudents;
  return allStudents;
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);

  console.log(getStudentAttr(jsonObject, "fullname"));

  student.fullName = getStudentAttr(jsonObject, "fullname");
  student.firstName = capitalizeFirstLetter(getStudentFirstName(jsonObject));
  student.middleName = capitalizeFirstLetter(getStudentMiddleNames(jsonObject));
  student.lastName = capitalizeFirstLetter(getStudentLastName(jsonObject));
  student.gender = capitalizeFirstLetter(getStudentAttr(jsonObject, "gender"));
  student.house = capitalizeFirstLetter(getStudentAttr(jsonObject, "house"));
  student.img = getStudentImg(student.firstName, student.lastName);
  return student;
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
    return "[not set]";
  }
  return fullName.slice(fullName.lastIndexOf(" ") + 1, fullName.length);
}

function getStudentImg(fname, lname) {
  return lname.toLowerCase() + "_" + fname.toLowerCase().charAt(0);
}

function capitalizeFirstLetter(name) {
  if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  else return "";
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
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=img]").src =
    "./img/student-img/" + student.img + ".png";

  clone.querySelector("[data-field=houseimg]").src =
    "./img/" + student.house.trim().toLowerCase() + ".png";
  let modalBtn = clone.querySelector(".details-btn");

  if (student.expelled) {
    clone.querySelector(".student").style.backgroundColor = "red";
    clone.querySelector("[data-field=expelled]").textContent = "EXPELLED";
  }

  modalBtn.addEventListener("click", function () {
    displayStudentDetails(student);
  });
  document.querySelector("#main-section").appendChild(clone);
}

function displayStudentDetails(student) {
  const modal = document.querySelector("#student-modal");
  modal
    .querySelector(".modal-content")
    .classList.add(student.house.toLowerCase());
  modal.querySelector(
    "[data-field=fname]"
  ).textContent = `First name: ${student.firstName}`;
  modal.querySelector(
    "[data-field=mname]"
  ).textContent = `Middle name: ${student.middleName}`;
  modal.querySelector(
    "[data-field=lname]"
  ).textContent = `Last name: ${student.lastName}`;
  modal.style.display = "block";
  modal.querySelector("[data-field=houseimg]").src =
    "./img/" + student.house.trim().toLowerCase() + ".png";
  modal.querySelector("[data-field=img]").src =
    "./img/student-img/" + student.img + ".png";

  modal.querySelector("#expell-btn").addEventListener("click", function () {
    expellStudent(student);
  });
}

function expellStudent(student) {
  if (!student.expelled) {
    student.expelled = true;
    expelledStudents.push(student);
    console.log(expelledStudents);
    displayList(displayedStudents);
  }
}
