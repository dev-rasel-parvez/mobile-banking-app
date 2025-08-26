const transactionsData = JSON.parse(localStorage.getItem("data")) || [];

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
  const clickedCard = e.target.closest("a");
  if (!clickedCard) return;

  // 3. Remove highlight from ALL cards first
  document.querySelectorAll("#menu-card a").forEach(card => {
    card.classList.remove("border-2", "border-green-500");
    card.classList.add("border-2", "border-gray-300");
  });

  // 4. Highlight only the clicked card
  clickedCard.classList.remove("border-gray-300");
  clickedCard.classList.add("border-green-500", "rounded-lg");

  // 5. Map each card ID → its form ID
  const cardToForm = {
    "add-money-card": "add-money-form",
    "cash-out-card": "cash-out-form",
    "transfer-money-card": "transfer-money-form",
    "get-bouns-card": "get-bouns-form",
    "pay-bill-card": "pay-bill-form",
    "transactions-card": "transactions-section"
  };

  // 6. Find the form ID
  const formId = cardToForm[clickedCard.id];

  // 7. Hide all forms first
  Object.values(cardToForm).forEach(id => add(id));

  // 8. Show the right one 
  if (formId) {
    remove(formId);
    add('transactions-home-section');   // hide home transactions when card is active
  } else {
    remove('transactions-home-section'); // keep home section visible if no card selected
  }
});




// Add Money functionality
const addMoneySelect = document.getElementById("add-money-select");
const addMoneySelectError = document.getElementById("add-money-select-error");

const addMoneyAccountNumber = document.getElementById("add-money-account-number");
const addMoneyAccountNumberError = document.getElementById("add-money-account-number-error");

addMoneyAccountNumber.addEventListener("blur", () => {
  let account = addMoneyAccountNumber.value.trim();

  if (!/^\d+$/.test(account)) {
    addMoneyAccountNumberError.innerText = "Please enter 11 digit account number, not characters!";
    addMoneyAccountNumberError.classList.remove("hidden");
  } else if (account.length > 11) {
    addMoneyAccountNumberError.innerText = "Please enter only 11 digit account number!";
    addMoneyAccountNumberError.classList.remove("hidden");
  } else if (account.length < 11) {
    addMoneyAccountNumberError.innerText = "Please enter 11 digit account number!";
    addMoneyAccountNumberError.classList.remove("hidden");
  } else {
    addMoneyAccountNumberError.classList.add("hidden");
  }
})


const addMoneyAmount = document.getElementById("add-money-amount");
const addMoneyAmountError = document.getElementById("add-money-amount-error");

addMoneyAmount.addEventListener("blur", () => {
  let amount = Number(addMoneyAmount.value.trim());

  if (isNaN(amount)) {
    addMoneyAmountError.innerText = "Please enter a positive number, not characters!";
    addMoneyAmountError.classList.remove("hidden");
  } else if (amount <= 0) {
    addMoneyAmountError.innerText = "Please enter a positive number!";
    addMoneyAmountError.classList.remove("hidden");
  } else {
    addMoneyAmountError.classList.add("hidden");
  }
})

const addMoneyPassword = document.getElementById("add-money-password");
const addMoneyPasswordError = document.getElementById("add-money-password-error");

const successMsg = document.getElementById("money-success-msg");
const currentBalanceEl = document.getElementById("current-blance");

// 🔹 On page load → restore balance from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const savedBalance = localStorage.getItem("currentBalance");
  if (savedBalance) {
    currentBalanceEl.innerText = Number(savedBalance).toFixed(2);
  }
});

// 🔹 Button click
document.getElementById("add-money-btn").addEventListener("click", function (e) {
  e.preventDefault();

  let btn = getElementByIdFun('add-money-btn');
  let imge = btn.parentElement.parentElement.parentElement
    .querySelector("div#menu-card a.border-green-500 > div > img");

  let img = imge.getAttribute("src")

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
  if (isNaN(addedMoney) || addedMoney <= 0) {
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
  currentBalanceEl.innerText = totalBalance.toFixed(2);
  localStorage.setItem("currentBalance", totalBalance.toFixed(2));

  // Save balance to localStorage
  localStorage.setItem("currentBalance", totalBalance);

  // 6. Show success message dynamically
  successMsg.innerText = `Your ${addedMoney}$ money added successfully!`;
  successMsg.classList.remove("hidden");

  const data = {
    name: "Add Money",
    img: img,
    amount: ` ${addedMoney}$ `,
    date: new Date().toLocaleTimeString(),

  }


  // 1. Push new object
  transactionsData.push(data);

  // 2. Save back to localStorage
  localStorage.setItem("data", JSON.stringify(transactionsData));



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
})






// Cash Out functionality

const sendMoneyAgentNumber = document.getElementById("send-money-account-number");
const sendMoneyAgentNumberError = document.getElementById("send-money-account-number-error");

sendMoneyAgentNumber.addEventListener("blur", () => {
  let account = sendMoneyAgentNumber.value.trim();

  if (!/^\d+$/.test(account)) {
    sendMoneyAgentNumberError.innerText = "Please enter 11 digit account number, not characters!";
    sendMoneyAgentNumberError.classList.remove("hidden");
  } else if (account.length > 11) {
    sendMoneyAgentNumberError.innerText = "Please enter only 11 digit account number!";
    sendMoneyAgentNumberError.classList.remove("hidden");
  } else if (account.length < 11) {
    sendMoneyAgentNumberError.innerText = "Please enter 11 digit account number!";
    sendMoneyAgentNumberError.classList.remove("hidden");
  } else {
    sendMoneyAgentNumberError.classList.add("hidden");
  }
})



const sendMoneyAmount = document.getElementById("send-money-amount");

const sendMoneyAmountError = document.getElementById("send-money-amount-error");

sendMoneyAmount.addEventListener('blur', () => {
  let sendMoney = Number(sendMoneyAmount.value);
  let currentBalance = Number(currentBalanceEl.innerText);
  if (isNaN(sendMoney)) {
    sendMoneyAmountError.innerText = `Please enter positive number not use characters!`;
    sendMoneyAmountError.classList.remove("hidden");
    return;
  } else if (sendMoney <= 0) {
    sendMoneyAmountError.innerText = `Please enter positive number!`;
    sendMoneyAmountError.classList.remove("hidden");
  } else if (currentBalance < sendMoney) {
    sendMoneyAmountError.innerText = `Your ${sendMoney}$ Cash Out amount is not avilable! `;
    sendMoneyAmountError.classList.remove("hidden");
  } else {
    sendMoneyAmountError.classList.add("hidden");
  }
})


const sendMoneyPassword = document.getElementById("send-money-password");
const sendMoneyPasswordError = document.getElementById("send-money-password-error");

const cashOutSuccessMsg = document.getElementById("cash-out-success-msg");

// 🔹 On page load → restore balance from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const savedBalance = localStorage.getItem("currentBalance");
  if (savedBalance) {
    currentBalanceEl.innerText = savedBalance;
  }
});


// 🔹 Button click
document.getElementById("send-money-btn").addEventListener("click", function (e) {
  e.preventDefault();

  let btn = getElementByIdFun('send-money-btn');
  let imge = btn.parentElement.parentElement.parentElement
    .querySelector("div#menu-card a.border-green-500 > div > img");

  let img = imge.getAttribute("src")

  // 2. Validate Account Number (must be 11 digits)
  if (sendMoneyAgentNumber.value.length !== 11 || isNaN(sendMoneyAgentNumber.value)) {
    sendMoneyAgentNumberError.classList.remove("hidden");
    return;
  } else {
    sendMoneyAgentNumberError.classList.add("hidden");
  }

  // 3. Validate amount (must be > 0)
  let sendMoney = Number(sendMoneyAmount.value);
  if (isNaN(sendMoney) || sendMoney <= 0) {
    sendMoneyAmountError.classList.remove("hidden");
    return;
  } else {
    sendMoneyAmountError.classList.add("hidden");
  }

  // 4. Validate Password (check against localStorage)
  const savedPassword = localStorage.getItem("createPassword");
  if (sendMoneyPassword.value !== savedPassword) {
    sendMoneyPasswordError.classList.remove("hidden");
    return;
  } else {
    sendMoneyPasswordError.classList.add("hidden");
  }

  // 5. Update balance if all good
  let currentBalance = Number(currentBalanceEl.innerText);
  if (currentBalance >= sendMoney) {
    let totalBalance = currentBalance - sendMoney;
    currentBalanceEl.innerText = totalBalance.toFixed(2);

    // Save balance to localStorage
    localStorage.setItem("currentBalance", totalBalance.toFixed(2));

    // 6. Show success message dynamically
    cashOutSuccessMsg.innerText = `You successfully Cash Out ${sendMoney}$ amount! `;
    cashOutSuccessMsg.classList.remove("hidden");

    const data = {
      name: "Cash Out",
      img: img,
      amount: ` ${sendMoney}$ `,
      date: new Date().toLocaleTimeString(),

    }
    // 1. Push new object
    transactionsData.push(data);

    // 2. Save back to localStorage
    localStorage.setItem("data", JSON.stringify(transactionsData));

    // 7. Clear all inputs
    sendMoneyAgentNumber.value = "";
    sendMoneyAmount.value = "";
    sendMoneyPassword.value = "";

    // Hide success message after 2 sec (optional)
    setTimeout(() => cashOutSuccessMsg.classList.add("hidden"), 2000);

  } else {
    sendMoneyAmountError.innerText = `Your ${sendMoney}$ Cash Out amount is not available `;
    sendMoneyAmountError.classList.remove("hidden");

    return;
  }

})

// 🔹 Listeners for live validation

// Account number input
sendMoneyAgentNumber.addEventListener("input", function () {
  if (sendMoneyAgentNumber.value.length === 11 && !isNaN(sendMoneyAgentNumber.value)) {
    sendMoneyAgentNumberError.classList.add("hidden");
  }
});

// Amount input
sendMoneyAmount.addEventListener("input", function () {
  if (Number(sendMoneyAmount.value) > 0) {
    sendMoneyAmountError.classList.add("hidden");
  }
});



// Password input
sendMoneyPassword.addEventListener("input", function () {
  const savedPassword = localStorage.getItem("createPassword");
  if (sendMoneyPassword.value === savedPassword) {
    sendMoneyPasswordError.classList.add("hidden");
  }
});



// Transfer functionality

const transferMoneyAccNumber = document.getElementById("transfer-money-account-number");
const transferMoneyAccNumberError = document.getElementById("transfer-money-account-number-error");

transferMoneyAccNumber.addEventListener("blur", () => {
  let account = transferMoneyAccNumber.value.trim();

  if (!/^\d+$/.test(account)) {
    transferMoneyAccNumberError.innerText = "Please enter 11 digit account number, not characters!";
    transferMoneyAccNumberError.classList.remove("hidden");
  } else if (account.length > 11) {
    transferMoneyAccNumberError.innerText = "Please enter only 11 digit account number!";
    transferMoneyAccNumberError.classList.remove("hidden");
  } else if (account.length < 11) {
    transferMoneyAccNumberError.innerText = "Please enter 11 digit account number!";
    transferMoneyAccNumberError.classList.remove("hidden");
  } else {
    transferMoneyAccNumberError.classList.add("hidden");
  }
})



const transferMoneyAmount = document.getElementById("transfer-money-amount");
const transferMoneyAmountError = document.getElementById("transfer-money-amount-error");


transferMoneyAmount.addEventListener('blur', () => {
  let transferMoney = Number(transferMoneyAmount.value);
  let transferCurrentBalance = Number(currentBalanceEl.innerText);
  if (isNaN(transferMoney)) {
    transferMoneyAmountError.innerText = `Please enter positive number not use characters!`;
    transferMoneyAmountError.classList.remove("hidden");
    return;
  } else if (transferMoney <= 0) {
    transferMoneyAmountError.innerText = `Please enter positive number!`;
    transferMoneyAmountError.classList.remove("hidden");
  } else if (transferCurrentBalance < transferMoney) {
    transferMoneyAmountError.innerText = `Your ${transferMoney}$ Transfer amount is not avilable! `;
    transferMoneyAmountError.classList.remove("hidden");
  } else {
    transferMoneyAmountError.classList.add("hidden");
  }
})


const transferMoneyPassword = document.getElementById("transfer-money-password");
const transferMoneyPasswordError = document.getElementById("transfer-money-password-error");

const transferSuccessMsg = document.getElementById("transfer-success-msg");


// 🔹 On page load → restore balance from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const savedBalance = localStorage.getItem("currentBalance");
  if (savedBalance) {
    currentBalanceEl.innerText = savedBalance;
  }
});


// 🔹 Button click
document.getElementById("transfer-money-btn").addEventListener("click", function (e) {
  e.preventDefault();

  let btn = getElementByIdFun('transfer-money-btn');
  let imge = btn.parentElement.parentElement.parentElement
    .querySelector("div#menu-card a.border-green-500 > div > img");

  let img = imge.getAttribute("src")

  // 2. Validate Account Number (must be 11 digits)
  if (transferMoneyAccNumber.value.length !== 11 || isNaN(transferMoneyAccNumber.value)) {
    transferMoneyAccNumberError.classList.remove("hidden");
    return;
  } else {
    transferMoneyAccNumberError.classList.add("hidden");
  }

  // 3. Validate amount (must be > 0)
  let transferMoney = Number(transferMoneyAmount.value);
  if (transferMoney <= 0) {
    transferMoneyAmountError.classList.remove("hidden");
    return;
  } else {
    transferMoneyAmountError.classList.add("hidden");
  }

  // 4. Validate Password (check against localStorage)
  const savedPassword = localStorage.getItem("createPassword");
  if (transferMoneyPassword.value !== savedPassword) {
    transferMoneyPasswordError.classList.remove("hidden");
    return;
  } else {
    transferMoneyPasswordError.classList.add("hidden");
  }

  // 5. Update balance if all good
  let currentBalance = Number(currentBalanceEl.innerText);
  if (currentBalance >= transferMoney) {
    let totalBalance = currentBalance - transferMoney;
    currentBalanceEl.innerText = totalBalance.toFixed(2);

    // Save balance to localStorage
    localStorage.setItem("currentBalance", totalBalance.toFixed(2));

    // 6. Show success message dynamically
    transferSuccessMsg.innerText = `You have successfully transfer ${transferMoney}$ amount! `;
    transferSuccessMsg.classList.remove("hidden");

    const data = {
      name: "Transfer Money",
      img: img,
      amount: ` ${transferMoney}$ `,
      date: new Date().toLocaleTimeString(),

    }
    // 1. Push new object
    transactionsData.push(data);

    // 2. Save back to localStorage
    localStorage.setItem("data", JSON.stringify(transactionsData));

    // 7. Clear all inputs
    transferMoneyAccNumber.value = "";
    transferMoneyAmount.value = "";
    transferMoneyPassword.value = "";

    // Hide success message after 2 sec (optional)
    setTimeout(() => transferSuccessMsg.classList.add("hidden"), 2000);

  } else {
    transferMoneyAmountError.innerText = `Your ${transferMoney}$ Transfer amount is not available `;
    transferMoneyAmountError.classList.remove("hidden");

    return;
  }

});

// 🔹 Listeners for live validation

// Account number input
transferMoneyAccNumber.addEventListener("input", function () {
  if (transferMoneyAccNumber.value.length === 11 && !isNaN(transferMoneyAccNumber.value)) {
    transferMoneyAccNumberError.classList.add("hidden");
  }
});

// Amount input
transferMoneyAmount.addEventListener("input", function () {
  if (Number(transferMoneyAmount.value) > 0) {
    transferMoneyAmountError.classList.add("hidden");
  }
});

// Password input
transferMoneyPassword.addEventListener("input", function () {
  const savedPassword = localStorage.getItem("createPassword");
  if (transferMoneyPassword.value === savedPassword) {
    transferMoneyPasswordError.classList.add("hidden");
  }
})





// Bonus Amount functionality

const bonusMoneyAmount = document.getElementById("bonus-money-amount");
const bonusMoneyAmountError = document.getElementById("bonus-money-amount-error");

bonusMoneyAmount.addEventListener("blur", () => {
  let amount = Number(bonusMoneyAmount.value.trim());

  if (isNaN(amount)) {
    bonusMoneyAmountError.innerText = "Please enter a positive number, not characters!";
    bonusMoneyAmountError.classList.remove("hidden");
  } else if (amount <= 0) {
    bonusMoneyAmountError.innerText = "Please enter a positive number!";
    bonusMoneyAmountError.classList.remove("hidden");
  } else {
    bonusMoneyAmountError.classList.add("hidden");
  }
})


const bonusSuccessMsg = document.getElementById("bonus-money-success-msg");


// 🔹 On page load → restore balance from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const savedBalance = localStorage.getItem("currentBalance");
  if (savedBalance) {
    currentBalanceEl.innerText = Number(savedBalance).toFixed(2);
  }
});

// 🔹 Button click
document.getElementById("bonus-money-btn").addEventListener("click", function (e) {
  e.preventDefault();

  let btn = getElementByIdFun('bonus-money-btn');
  let imge = btn.parentElement.parentElement.parentElement
    .querySelector("div#menu-card a.border-green-500 > div > img");

  let img = imge.getAttribute("src")


  // 3. Validate amount (must be > 0)
  let bonusMoney = Number(bonusMoneyAmount.value);
  if (bonusMoney <= 0) {
    bonusMoneyAmountError.classList.remove("hidden");
    return;
  } else {
    bonusMoneyAmountError.classList.add("hidden");
  }

  // 5. Update balance if all good
  let currentBalance = Number(currentBalanceEl.innerText);
  let totalBalance = currentBalance + bonusMoney;
  currentBalanceEl.innerText = totalBalance.toFixed(2);
  localStorage.setItem("currentBalance", totalBalance.toFixed(2));

  // Save balance to localStorage
  localStorage.setItem("currentBalance", totalBalance);

  // 6. Show success message dynamically
  bonusSuccessMsg.innerText = `You have successfully added ${bonusMoney}$ bonus amount!`;
  bonusSuccessMsg.classList.remove("hidden");

  const data = {
    name: "Get Bonus",
    img: img,
    amount: ` ${bonusMoney}$ `,
    date: new Date().toLocaleTimeString(),

  }
  // 1. Push new object
  transactionsData.push(data);

  // 2. Save back to localStorage
  localStorage.setItem("data", JSON.stringify(transactionsData));

  // 7. Clear all inputs
  bonusMoneyAmount.value = "";


  // Hide success message after 2 sec (optional)
  setTimeout(() => bonusSuccessMsg.classList.add("hidden"), 2000);
});

// 🔹 Listeners for live validation


// Amount input
bonusMoneyAmount.addEventListener("input", function () {
  if (Number(bonusMoneyAmount.value) > 0) {
    bonusMoneyAmountError.classList.add("hidden");
  }
})



// Pay Bill functionality
const payBillMoneySelect = document.getElementById("pay-bill-money-select");
const payBillMoneySelectError = document.getElementById("pay-bill-money-select-error");

const payBillMoneyAccountNumber = document.getElementById("pay-bill-money-account-number");
const payBillMoneyAccountNumberError = document.getElementById("pay-bill-money-account-number-error");

payBillMoneyAccountNumber.addEventListener("blur", () => {
  let payBillaccount = payBillMoneyAccountNumber.value.trim();

  if (!/^\d+$/.test(payBillaccount)) {
    payBillMoneyAccountNumberError.innerText = "Please enter 11 digit account number, not characters!";
    payBillMoneyAccountNumberError.classList.remove("hidden");
  } else if (payBillaccount.length > 11) {
    payBillMoneyAccountNumberError.innerText = "Please enter only 11 digit account number!";
    payBillMoneyAccountNumberError.classList.remove("hidden");
  } else if (payBillaccount.length < 11) {
    payBillMoneyAccountNumberError.innerText = "Please enter 11 digit account number!";
    payBillMoneyAccountNumberError.classList.remove("hidden");
  } else {
    payBillMoneyAccountNumberError.classList.add("hidden");
  }
})


const payBillMoneyAmount = document.getElementById("pay-bill-money-amount");
const payBillMoneyAmountError = document.getElementById("pay-bill-money-amount-error");

payBillMoneyAmount.addEventListener("blur", () => {
  let payBillamount = Number(payBillMoneyAmount.value.trim());
  let payBillcurrentBalance = document.getElementById("current-blance").innerText;
  payBillcurrentBalance = Number(payBillcurrentBalance);



  if (isNaN(payBillamount)) {
    payBillMoneyAmountError.innerText = "Please enter a positive number, not characters!";
    payBillMoneyAmountError.classList.remove("hidden");
  } else if (payBillamount <= 0) {
    payBillMoneyAmountError.innerText = "Please enter a positive number!";
    payBillMoneyAmountError.classList.remove("hidden");
  } else if (payBillcurrentBalance < payBillamount) {
    payBillMoneyAmountError.innerText = `Your ${payBillamount}$ pay bill amount is not avilable! `;
    payBillMoneyAmountError.classList.remove("hidden");

  } else {
    payBillMoneyAmountError.classList.add("hidden");
  }
})

const payBillPassword = document.getElementById("pay-bill-password");
const payBillPasswordError = document.getElementById("pay-bill-password-error");

const payBillSuccessMsg = document.getElementById("pay-bill-success-msg");
const payBillCurrentBalance = document.getElementById("current-blance");

// 🔹 On page load → restore balance from localStorage
window.addEventListener("DOMContentLoaded", function () {
  let savedBalance = localStorage.getItem("currentBalance");
  if (savedBalance) {
    payBillCurrentBalance.innerText = Number(savedBalance).toFixed(2);
  }
});

// 🔹 Button click
document.getElementById("pay-bill-btn").addEventListener("click", function (e) {
  e.preventDefault();

  let btn = getElementByIdFun('pay-bill-btn');
  let imge = btn.parentElement.parentElement.parentElement
    .querySelector("div#menu-card a.border-green-500 > div > img");

  let img = imge.getAttribute("src")

  // 1. Validate Bank
  if (payBillMoneySelect.value === "Select A Bill") {
    payBillMoneySelectError.classList.remove("hidden");
    return;
  } else {
    payBillMoneySelectError.classList.add("hidden");
  }

  // 2. Validate Account Number (must be 11 digits)
  if (payBillMoneyAccountNumber.value.length !== 11 || isNaN(payBillMoneyAccountNumber.value)) {
    payBillMoneyAccountNumberError.classList.remove("hidden");
    return;
  } else {
    payBillMoneyAccountNumberError.classList.add("hidden");
  }

  // 3. Validate amount (must be > 0)
  let payBillMoney = Number(payBillMoneyAmount.value);
  if (isNaN(payBillMoney) || payBillMoney <= 0) {
    payBillMoneyAmountError.classList.remove("hidden");
    return;
  } else {
    payBillMoneyAmountError.classList.add("hidden");
  }

  // 4. Validate Password (check against localStorage)
  const savedPassword = localStorage.getItem("createPassword");
  if (payBillPassword.value !== savedPassword) {
    payBillPasswordError.classList.remove("hidden");
    return;
  } else {
    payBillPasswordError.classList.add("hidden");
  }

  // 5. Update balance if all good
  let currentBalance = Number(payBillCurrentBalance.innerText);
  let totalBalance = currentBalance - payBillMoney;
  payBillCurrentBalance.innerText = totalBalance.toFixed(2);
  localStorage.setItem("currentBalance", totalBalance.toFixed(2));

  // Save balance to localStorage
  localStorage.setItem("currentBalance", totalBalance);

  // 6. Show success message dynamically
  payBillSuccessMsg.innerText = `You have successfully  ${payBillMoney}$  payment!`;
  payBillSuccessMsg.classList.remove("hidden");

  const data = {
    name: "Pay Bill",
    img: img,
    amount: ` ${payBillMoney}$ `,
    date: new Date().toLocaleTimeString(),

  }
  // 1. Push new object
  transactionsData.push(data);

  // 2. Save back to localStorage
  localStorage.setItem("data", JSON.stringify(transactionsData));

  // 7. Clear all inputs
  payBillMoneySelect.value = "Select A Bank";
  payBillMoneyAccountNumber.value = "";
  payBillMoneyAmount.value = "";
  payBillPassword.value = "";

  // Hide success message after 2 sec (optional)
  setTimeout(() => payBillSuccessMsg.classList.add("hidden"), 2000);
});

// 🔹 Listeners for live validation

// Select change
payBillMoneySelect.addEventListener("change", function () {
  if (payBillMoneySelect.value !== "Select A Bank") {
    payBillMoneySelectError.classList.add("hidden");
  }
});

// Account number input
payBillMoneyAccountNumber.addEventListener("input", function () {
  if (payBillMoneyAccountNumber.value.length === 11 && !isNaN(payBillMoneyAccountNumber.value)) {
    payBillMoneyAccountNumberError.classList.add("hidden");
  }
});

// Amount input
payBillMoneyAmount.addEventListener("input", function () {
  if (Number(payBillMoneyAmount.value) > 0) {
    payBillMoneyAmountError.classList.add("hidden");
  }
});

// Password input
payBillPassword.addEventListener("input", function () {
  const savedPassword = localStorage.getItem("createPassword");
  if (payBillPassword.value === savedPassword) {
    payBillPasswordError.classList.add("hidden");
  }
})


// Transactions functionality

// Render transactions
function renderTransactions(showAll = false) {
  const transactionSection = getElementByIdFun('transactions-section-div-add');
  transactionSection.innerText = '';

  // reverse for latest first
  let dataToShow = [...transactionsData].reverse();

  // if not showAll, limit to 5
  if (!showAll) {
    dataToShow = dataToShow.slice(0, 5);
  }

  for (const data of dataToShow) {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="w-[85%] mx-auto pt-1 pb-4 flex justify-between items-center">
          <div class="flex items-center gap-7 p-2">
            <div class="w-[1.5rem] rounded-lg">
              <img src="${data.img}" alt="">
            </div>
            <div>
              <p class="text-[rgba(8,8,8,0.7)] text-base font-semibold">
                ${data.name} : <span>${data.amount}</span>
              </p>
              <p>${data.date}</p>
            </div>
          </div>
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>
      `;
    transactionSection.appendChild(div);
  }
}

// Show latest 5 when clicking transactions-card → show full transactions section, hide home preview
getElementByIdFun('transactions-card').addEventListener('click', function () {
  renderTransactions(false);                             // render last 5
  remove('transactions-section');                        // show full section
  add('transactions-home-section');                      // hide preview section
});

// Show all when clicking "View All" in full transactions
getElementByIdFun('view-all-btn').addEventListener('click', function () {
  renderTransactions(true);
});

// Show all when clicking "View All" in home preview
getElementByIdFun('view-all-home-btn').addEventListener('click', function () {
  renderHomeTransactions(true);
});

// On page load → render home preview (last 5)
window.addEventListener("DOMContentLoaded", function () {
  renderHomeTransactions(false);
  remove('transactions-home-section');   // make sure home preview visible
  add('transactions-section');           // make sure full section hidden
});







// Transactions Home functionality

// Render transactions
function renderHomeTransactions(showAll = false) {
  const transactionSection = getElementByIdFun('transactions-home-section-div-add');
  transactionSection.innerText = '';

  // reverse for latest first
  let dataToShow = [...transactionsData].reverse();

  // if not showAll, limit to 5
  if (!showAll) {
    dataToShow = dataToShow.slice(0, 5);
  }

  for (const data of dataToShow) {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="w-[85%] mx-auto pt-1 pb-4 flex justify-between items-center">
          <div class="flex items-center gap-7 p-2">
            <div class="w-[1.5rem] rounded-lg">
              <img src="${data.img}" alt="">
            </div>
            <div>
              <p class="text-[rgba(8,8,8,0.7)] text-base font-semibold">
                ${data.name} : <span>${data.amount}</span>
              </p>
              <p>${data.date}</p>
            </div>
          </div>
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>
      `;
    transactionSection.appendChild(div);
  }
}

// Show latest 5 automatically on page load (for home section)
window.addEventListener("DOMContentLoaded", function () {
  renderHomeTransactions(false);
});

// Show all when clicking "View All"
getElementByIdFun('view-all-home-btn').addEventListener('click', function () {
  renderHomeTransactions(true);
});



