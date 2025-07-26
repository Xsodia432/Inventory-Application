const modal = document.querySelector(".modal-backdrop");

const form_item = document.getElementById("form-item");

const main_container = document.getElementById("main-container");
const modal_main = document.getElementById("modal-main");

function confirmDelete() {
  return confirm("Are you sure?");
}

function categoryEditModal(categoryName, categoryId) {
  modal.classList.toggle("modal-hidden");
  modalContent({
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
    url: "/categoryUpdate",
    categoryName,
  });
}
function editItem(itemId, itemName, quantity, price, categoryId) {
  itemModal({
    itemId,
    itemName,
    quantity,
    price,
    categoryId,
    url: "/itemUpdate",
  });
}
function addItem(categoryId) {
  itemModal({ categoryId, url: "/itemAdd" });
}
function itemModal(contents) {
  modal.classList.toggle("modal-hidden");
  modalContent({
    title: "Add Item",
    elements: [
      {
        element: "label",
        for: "itemName",
        textContent: "Item Name",
      },
      {
        element: "input",
        type: "text",
        name: "itemName",
        id: "itemName",
        value: contents.itemName,
      },
      {
        element: "label",
        for: "quantity",
        textContent: "Quantity",
      },
      {
        element: "input",
        type: "number",
        name: "quantity",
        id: "quantity",
        value: contents.quantity,
      },
      {
        element: "label",
        for: "price",
        textContent: "Price",
      },
      {
        element: "input",
        type: "number",
        name: "price",
        id: "price",
        value: contents.price,
      },
    ],
    categoryId: contents.categoryId,
    url: contents.url,
    itemId: contents.itemId,
    itemName: contents.itemName,
  });
}

function modalContent(content) {
  modal_main.textContent = "";
  const modalHeader = document.createElement("div");
  const modalTitle = document.createElement("h3");
  const modalClose = document.createElement("span");
  const modalContent = document.createElement("div");
  const form = document.createElement("form");
  const errors_container = document.createElement("div");
  const btn_submit = document.createElement("button");
  const errorContainer = document.createElement("div");

  errorContainer.setAttribute("id", "errors-container");
  modalHeader.classList.add("modal-header");
  modalContent.classList.add("modal-content");
  errors_container.classList.add("errors-container");

  btn_submit.textContent = "Submit";
  btn_submit.type = "submit";
  modalTitle.textContent = content.title;
  modalClose.textContent = "X";
  modalClose.addEventListener("click", () => {
    modal.classList.toggle("modal-hidden");
    modal_main.textContent = "";
  });
  form.append(errors_container);
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

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(content.url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ...Object.fromEntries(formData.entries()),
          categoryId: content.categoryId,
          itemId: content.itemId,
          itemNameCopy: content.itemName,
          categoryNameCopy: content.categoryName,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.errors) {
          errors_container.textContent = "";
          result.errors.forEach((val) => {
            const error = document.createElement("span");
            error.textContent = val.msg;
            errors_container.append(error);
          });
        }
        if (result.msg === "Sent")
          window.location.href = `/category/${result.categoryId}`;
      }
    } catch (err) {
      console.log(err);
    }
  });

  modalContent.append(form);
  modalHeader.append(modalTitle, modalClose);

  modal_main.append(modalHeader, modalContent);
}
