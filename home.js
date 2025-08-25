// helper functions
function getElementByIdFun(id) {
    return document.getElementById(id);
}
function remove(id) {
    getElementByIdFun(id).classList.remove('hidden');
}
function add(id) {
    getElementByIdFun(id).classList.add('hidden');
}

// 1. Parent container: menu-card
getElementByIdFun('menu-card').addEventListener("click", function (e) {

    // 2. Find which <a> card was clicked
    const clickedCard = e.target.closest("a"); // goes up to nearest <a>
    if (!clickedCard) return; // if you clicked outside <a>, do nothing

    // 3. Map each card ID → its form ID
    const cardToForm = {
        "add-money-card": "add-money-form",
        "cash-out-card": "cash-out-form",
        "transfer-money-card": "transfer-money-form",
        "get-bouns-card": "get-bouns-form",
        "pay-bill-card": "pay-bill-form",
        "transactions-card": null // (no form yet)
    };

    // 4. Find the form ID that matches this card
    const formId = cardToForm[clickedCard.id];

    // 5. Hide all forms first
    Object.values(cardToForm).forEach(id => {
        if (id) add(id); // add "hidden" class
    });

    // 6. Show only the clicked form
    if (formId) {
        remove(formId); // remove "hidden" class
    }
});




// Add Money functionality
const addMoneySelect = document.getElementById("add-money-select");
const addMoneySelectError = document.getElementById("add-money-select-error");

const addMoneyAccountNumber = document.getElementById("add-money-account-number");
const addMoneyAccountNumberError = document.getElementById("add-money-account-number-error");

const addMoneyAmount = document.getElementById("add-money-amount");
const addMoneyAmountError = document.getElementById("add-money-amount-error");

const addMoneyPassword = document.getElementById("add-money-password");
const addMoneyPasswordError = document.getElementById("add-money-password-error");

const successMsg = document.getElementById("money-success-msg");
const currentBalanceEl = document.getElementById("current-blance");

// 🔹 On page load → restore balance from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const savedBalance = localStorage.getItem("currentBalance");
  if (savedBalance) {
    currentBalanceEl.innerText = savedBalance;
  }
});

// 🔹 Button click
document.getElementById("add-money-btn").addEventListener("click", function (e) {
  e.preventDefault();

  // 1. Validate Bank
  if (addMoneySelect.value === "Select A Bank") {
    addMoneySelectError.classList.remove("hidden");
    return;
  } else {
    addMoneySelectError.classList.add("hidden");
  }

  // 2. Validate Account Number (must be 11 digits)
  if (addMoneyAccountNumber.value.length !== 11 || isNaN(addMoneyAccountNumber.value)) {
    addMoneyAccountNumberError.classList.remove("hidden");
    return;
  } else {
    addMoneyAccountNumberError.classList.add("hidden");
  }

  // 3. Validate amount (must be > 0)
  let addedMoney = Number(addMoneyAmount.value);
  if (addedMoney <= 0) {
    addMoneyAmountError.classList.remove("hidden");
    return;
  } else {
    addMoneyAmountError.classList.add("hidden");
  }

  // 4. Validate Password (check against localStorage)
  const savedPassword = localStorage.getItem("createPassword");
  if (addMoneyPassword.value !== savedPassword) {
    addMoneyPasswordError.classList.remove("hidden");
    return;
  } else {
    addMoneyPasswordError.classList.add("hidden");
  }

  // 5. Update balance if all good
  let currentBalance = Number(currentBalanceEl.innerText);
  let totalBalance = currentBalance + addedMoney;
  currentBalanceEl.innerText = totalBalance;

  // Save balance to localStorage
  localStorage.setItem("currentBalance", totalBalance);

  // 6. Show success message dynamically
  successMsg.innerText = `Your ${addedMoney}$ money added successfully!`;
  successMsg.classList.remove("hidden");

  // 7. Clear all inputs
  addMoneySelect.value = "Select A Bank";
  addMoneyAccountNumber.value = "";
  addMoneyAmount.value = "";
  addMoneyPassword.value = "";

  // Hide success message after 2 sec (optional)
  setTimeout(() => successMsg.classList.add("hidden"), 2000);
});

// 🔹 Listeners for live validation

// Select change
addMoneySelect.addEventListener("change", function () {
  if (addMoneySelect.value !== "Select A Bank") {
    addMoneySelectError.classList.add("hidden");
  }
});

// Account number input
addMoneyAccountNumber.addEventListener("input", function () {
  if (addMoneyAccountNumber.value.length === 11 && !isNaN(addMoneyAccountNumber.value)) {
    addMoneyAccountNumberError.classList.add("hidden");
  }
});

// Amount input
addMoneyAmount.addEventListener("input", function () {
  if (Number(addMoneyAmount.value) > 0) {
    addMoneyAmountError.classList.add("hidden");
  }
});

// Password input
addMoneyPassword.addEventListener("input", function () {
  const savedPassword = localStorage.getItem("createPassword");
  if (addMoneyPassword.value === savedPassword) {
    addMoneyPasswordError.classList.add("hidden");
  }
});
