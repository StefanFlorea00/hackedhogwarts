let allStudents = [];
let displayedStudents = [];

const Student = {
  name: "",
  gender: "",
  house: "",
};

init();

function init() {
  addModalEvents();
  loadJSON("https://petlatkea.dk/2020/hogwarts/students.json");
  setTimeout(() => {
    displayList(allStudents);
  }, 50);
  addSort();
}

function addFilter() {
  const filter = document.querySelector("#filter");
  filter.addEventListener("change", filterStudents);
}

function filterStudents(type) {
  if (type == "*") displayedStudents = allStudents;
  else
    displayedStudents = allStudents.filter(
      (student) => student.fullname == type
    );
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
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
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

  student.fullname = jsonObject.fullname;
  student.gender = jsonObject.gender;
  student.house = jsonObject.house;

  return student;
}

function displayList(students) {
  document.querySelector("#main-section").innerHTML = "";
  students.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  clone.querySelector("[data-field=name]").textContent = student.fullname;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;

  clone.querySelector("[data-field=houseimg]").src =
    "./img/" + student.house.trim().toLowerCase() + ".png";
  let modalBtn = clone.querySelector(".details-btn");

  modalBtn.addEventListener("click", function () {
    displayStudentDetails(student);
    console.log("hahga");
  });
  document.querySelector("#main-section").appendChild(clone);
}

function displayStudentDetails(student) {
  var modal = document.querySelector("#student-modal");
  modal.querySelector(".student-name").textContent = student.fullname;
  modal.style.display = "block";
}
