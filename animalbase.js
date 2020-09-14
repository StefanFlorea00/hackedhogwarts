"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let displayedAnimals = [];

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};

function start() {
  console.log("ready");
  // TODO: Add event-listeners to filter and sort buttons
  const buttons = document.querySelectorAll("button");
  for (const button of buttons) {
    button.addEventListener("click", function () {
      filterAnimals(this.dataset.filter);
      displayList(displayedAnimals);
    });
  }

  const sorters = document.querySelectorAll("#sorting th");
  let maxSelected = 0;
  for (const sorter of sorters) {
    sorter.addEventListener("click", function () {
      if (maxSelected <= 1) {
        this.classList.toggle("sortby");
      }
      if (this.dataset.sortDirection == "asc") {
        this.dataset.sortDirection = "desc";
      } else if (this.dataset.sortDirection == "desc") {
        this.dataset.sortDirection = "asc";
      }

      displayList(sortAnimals(this.dataset.sort, this.dataset.sortDirection));
    });
  }
  loadJSON();
  setTimeout(() => {
    displayedAnimals = allAnimals;
  }, 50);
}

function filterAnimals(type) {
  if (type == "*") displayedAnimals = allAnimals;
  else displayedAnimals = allAnimals.filter((animal) => animal.type == type);
}

function sortAnimals(field, direction) {
  let sortedAnimals;
  return (sortedAnimals = sortByField(field, displayedAnimals, direction));
}

function sortByField(field, array, direction) {
  let switchDirection;
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

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first
  displayList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
