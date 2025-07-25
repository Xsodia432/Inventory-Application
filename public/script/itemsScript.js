const modal_open = document.querySelector(".modal-show-items");
const modal = document.querySelector(".modal-backdrop");
const modal_close = document.getElementById("modal-close");
const form_item = document.getElementById("form-item");
const categoryId = window.location.pathname.split("/")[3];
const category = window.location.pathname.split("/")[2];
const main_container = document.getElementById("main-container");
const modal_main = document.getElementById("modal-main");

modal_open.addEventListener("click", (ev) => {
  modal.classList.toggle("modal-hidden");
});
modal_close.addEventListener("click", (ev) => {
  modal.classList.toggle("modal-hidden");
});

function confirmDelete() {
  return confirm("Are you sure?");
}

function categoryEditModal(categoryName, categoryId) {
  modal.classList.toggle("modal-hidden");
  modalContentCategory({
    title: "Update Category",
    elements: [
      {
        element: "label",
        for: "categoryName",
        textContent: "Category Name",
      },
      {
        element: "input",
        type: "text",
        name: "categoryName",
        value: categoryName,
        id: "categoryName",
      },
    ],
    categoryId: categoryId,
  });
}

function modalContentCategory(content) {
  modal_main.textContent = "";
  const modalHeader = document.createElement("div");
  const modalTitle = document.createElement("h3");
  const modalClose = document.createElement("span");
  const modalContent = document.createElement("div");
  const form = document.createElement("form");
  const errors_container = document.createElement("div");
  const btn_submit = document.createElement("button");

  modalHeader.classList.add("modal-header");
  modalContent.classList.add("modal-content");
  errors_container.classList.add("errors-container");

  btn_submit.textContent = "Submit";
  modalTitle.textContent = content.title;
  modalClose.textContent = "X";
  modalClose.addEventListener("click", () => {
    modal.classList.toggle("modal-hidden");
    modal_main.textContent = "";
  });
  content.elements.forEach((val) => {
    const element = document.createElement(val.element);
    if (val.for) element.setAttribute("for", val.for);
    if (val.type) element.setAttribute("type", val.type);
    if (val.textContent) element.textContent = val.textContent;
    if (val.name) element.setAttribute("name", val.name);
    if (val.id) element.setAttribute("id", val.id);
    if (val.value) element.value = val.value;
    form.append(element);
  });
  form.append(btn_submit);
  modalContent.append(form);
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch("/categoryUpdate", {
        method: "POST",
        body: JSON.stringify(formData.entries()),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  });
  modalHeader.append(modalTitle, modalClose);

  modal_main.append(modalHeader, modalContent);
}
function modalContentItems() {}
