const modal_close = document.getElementById("modal-close");
const modal_open = document.querySelectorAll(".modal-show");
const form_category = document.getElementById("form-category");
const modal = document.querySelector(".modal-backdrop");
const main_container = document.getElementById("main-content");

modal_close.addEventListener("click", (ev) => {
  modal.classList.toggle("modal-hidden");
});

modal_open.forEach((el) => {
  el.addEventListener("click", (ev) => {
    modal.classList.toggle("modal-hidden");
  });
});
