const modal_open = document.querySelector(".modal-show-items");
const modal = document.querySelector(".modal-backdrop");
const modal_close = document.getElementById("modal-close");
const form_item = document.getElementById("form-item");
const categoryId = window.location.pathname.split("/")[3];
const category = window.location.pathname.split("/")[2];
const main_container = document.getElementById("main-container");

modal_open.addEventListener("click", (ev) => {
  modal.classList.toggle("modal-hidden");
});
modal_close.addEventListener("click", (ev) => {
  modal.classList.toggle("modal-hidden");
});

function confirmDelete() {
  return confirm("Are you sure?");
}
