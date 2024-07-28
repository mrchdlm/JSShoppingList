const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");

let isEditMode = false;
let editItemIndex = -1;

// Load items from localStorage on page load
document.addEventListener("DOMContentLoaded", loadItems);

function loadItems() {
  // Check if localStorage already has items
  const storedItems = getItemsFromStorage();
  if (storedItems.length > 0) {
    storedItems.forEach((item) => addItemToDOM(item));
  } else {
    // No default items if localStorage is empty
    setItemsToStorage([]);
  }
  checkUI();
}

function getItemsFromStorage() {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
}

function setItemsToStorage(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value.trim();

  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  if (isEditMode) {
    updateItemInDOM(newItem, editItemIndex);
    updateItemInStorage(newItem, editItemIndex);
    isEditMode = false;
    editItemIndex = -1;
    itemInput.value = "";
    const submitBtn = itemForm.querySelector("button");
    submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    submitBtn.classList.remove("btn-update");
  } else {
    addItemToDOM(newItem);
    addItemToStorage(newItem);
    itemInput.value = "";
  }

  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  li.addEventListener("click", () => editItem(item));

  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const items = getItemsFromStorage();
  items.push(item);
  setItemsToStorage(items);
}

function updateItemInDOM(newItem, index) {
  const items = document.querySelectorAll("#item-list li");
  items[index].firstChild.textContent = newItem;
}

function updateItemInStorage(newItem, index) {
  const items = getItemsFromStorage();
  items[index] = newItem;
  setItemsToStorage(items);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;

  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);

  button.addEventListener("click", removeItem);

  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function removeItem(e) {
  e.stopPropagation();
  if (confirm("Are you sure?")) {
    const item = e.target.parentElement.parentElement;
    item.remove();

    removeItemFromStorage(item.firstChild.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  const items = getItemsFromStorage();
  const filteredItems = items.filter((i) => i !== item);
  setItemsToStorage(filteredItems);
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem("items");
  checkUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function editItem(itemText) {
  isEditMode = true;
  editItemIndex = getItemsFromStorage().indexOf(itemText);
  itemInput.value = itemText;
  const submitBtn = itemForm.querySelector("button");
  submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  submitBtn.classList.add("btn-update");
}

function checkUI() {
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
}

itemForm.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItems);

checkUI();
