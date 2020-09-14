var modal = document.querySelector("#student-modal");
var modalBtn = document.querySelector(".details-btn");
var modalSpan = document.querySelector(".close");

modalBtn.addEventListener("click",
    displayStudentDetails)

function displayStudentDetails() {
    modal.style.display = "block";
}

modalSpan.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}