// Function for getElementById

function getElementById(id) {
  const select = document.getElementById(id);
  return select;
}

// Function for getElementByIdValue

function getElementByIdValue(id) {
  const select = document.getElementById(id).value;
  return select;
}

// Function for getElementByIdDisplayBlock

function getElementByIdDisplayBlock(id) {
  const select = getElementById(id).style.display = "block";
  return select;
}

// Function for getElementByIdDisplayNone

function getElementByIdDisplayNone(id) {
  const select = getElementById(id).style.display = "none";
  return select;
}






// ===== Create an account functionality =====
const $ = (id) => document.getElementById(id);

const phoneInput = $('Create-account-phone-number');
const passInput = $('Create-password');
const createBtn = $('Create-account-btn');

// --- validators ---
function cleanDigits(v) {
  return (v || '').replace(/\D/g, '');
}

function validatePhoneFormat(showError = true) {
  const digits = cleanDigits(phoneInput.value);
  const ok = digits.length === 11;
  if (showError) {
    $('phone-error').classList.toggle('hidden', ok);
  }
  return { ok, digits };
}

function validatePhoneDuplicate(showError = true) {
  const digits = cleanDigits(phoneInput.value);
  const existing = localStorage.getItem('createPhoneNumber') || ''; // stored as string
  const ok = digits !== existing || digits === ''; // ok if new OR empty (let format check handle empty)
  if (showError) {
    $('phone-exist-error').classList.toggle('hidden', ok);
  }
  return { ok, digits, existing };
}

function validatePassword(showError = true) {
  const password = passInput.value || '';
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,8}$/;
  const ok = passRegex.test(password);
  if (showError) {
    $('pass-error').classList.toggle('hidden', ok);
  }
  return { ok, password };
}

function validateAll(showError = true) {
  const a = validatePhoneFormat(showError);
  const b = validatePhoneDuplicate(showError);
  const c = validatePassword(showError);
  const ok = a.ok && b.ok && c.ok;
  return { ok, cleanedPhone: a.digits, password: c.password };
}

// --- live validation on blur/input ---
phoneInput.addEventListener('blur', () => {
  validatePhoneFormat(true);
  validatePhoneDuplicate(true);
  updateCreateBtnState();
});
passInput.addEventListener('blur', () => {
  validatePassword(true);
  updateCreateBtnState();
});

// (optional) live as-you-type UX
phoneInput.addEventListener('input', () => {
  validatePhoneFormat(false);
  validatePhoneDuplicate(false);
  updateCreateBtnState();
});
passInput.addEventListener('input', () => {
  validatePassword(false);
  updateCreateBtnState();
});

// (optional) disable button until valid
function updateCreateBtnState() {
  const { ok } = validateAll(false);
  if (createBtn) createBtn.disabled = !ok;
}
updateCreateBtnState();

// --- create account button logic ---
createBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const { ok, cleanedPhone, password } = validateAll(true);
  if (!ok) return; // errors are already shown

  // ⚠️ Note: Storing passwords in localStorage is insecure (demo only).
  localStorage.setItem('createPhoneNumber', cleanedPhone);
  localStorage.setItem('createPassword', password);

  // success UI
  $('login').style.display = 'block';
  $('create-account').style.display = 'none';

  const successMsg = $('success-msg');
  if (successMsg) {
    successMsg.classList.remove('hidden');
    setTimeout(() => successMsg.classList.add('hidden'), 2000);
  }

  // clear create inputs
  phoneInput.value = '';
  passInput.value = '';
  updateCreateBtnState();
});






// Don't have An account, create an account btn  functionality
getElementById("account?").addEventListener("click", function (e) {
  e.preventDefault();
  getElementByIdDisplayNone('login');
  getElementByIdDisplayBlock('create-account');
})


// Login functionality

const loginPhone1 = document.getElementById('login-phone');
const loginPhone1Error = document.getElementById('phone-not-match');

loginPhone1.addEventListener("blur", () => {
  let account = loginPhone1.value.trim();

  if (!/^\d+$/.test(account)) {
    loginPhone1Error.innerText = "Please enter 11 digit account number, not characters!";
    loginPhone1Error.classList.remove("hidden");
  } else if (account.length > 11) {
    loginPhone1Error.innerText = "Please enter only 11 digit account number!";
    loginPhone1Error.classList.remove("hidden");
  } else if (account.length < 11) {
    loginPhone1Error.innerText = "Please enter 11 digit account number!";
    loginPhone1Error.classList.remove("hidden");
  } else {
    loginPhone1Error.classList.add("hidden");
  }
});



document.getElementById("login-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const savePhoneNumber = parseInt(localStorage.getItem("createPhoneNumber"));
  const savePass = localStorage.getItem("createPassword");

  const loginPhone = parseInt(getElementByIdValue('login-phone'));
  const loginPass = getElementByIdValue('login-pass');

  if (savePhoneNumber === loginPhone && savePass === loginPass) {
    // both match → go to home
    window.location.href = "./home.html";
    loginPhone.value = '';
    loginPass.value = '';

  } else {
    // check phone
    if (savePhoneNumber !== loginPhone) {
      getElementByIdDisplayBlock('phone-not-match');
    } else {
      getElementByIdDisplayNone('phone-not-match');
    }

    // check password
    if (savePass !== loginPass) {
      getElementByIdDisplayBlock('pass-not-match');
    } else {
      getElementByIdDisplayNone('pass-not-match');
    }
  }


})


// Already An account go to login btn functionality
document.getElementById("login?").addEventListener("click", function (e) {
  e.preventDefault();
  getElementByIdDisplayBlock('login');
  getElementByIdDisplayNone('create-account');
})