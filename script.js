"use strict";

////////////////////////// ACCOUNT DETAILS ////////////////
const account1 = {
  fName: "Ndubuaku Chigozie Emmanuel",
  movements: [90, -120, 402, -54, 3000, -135, 236, 2010],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  fName: "Clement Richard",
  movements: [400, -360, 5000, 70, -140, 1300, -650, 20],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  fName: "Emmanuel Richard",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  fName: "Michael Jackson",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// ELEMENTS SELECTORS

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const loginBtn = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const loginUser = document.querySelector(".login__input--user");
const loginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// ELEMENT SELECTORS ENDS

// FUNCTIONS
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHtml = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date();

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movement__date">${date.getUTCDay()}</div>
        <div class="movements__value">${mov}$</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}$`;
};
// console.log(calcDisplayBalance(account1.movements));

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}$`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}$`;

  const interest = acc.movements
    .filter((mov) => mov < 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}$`;
};

// CREATE USERNAMES FOR ACCOUNTS
const createUserNames = function (acc) {
  acc.forEach((acc) => {
    acc.username = acc.fName
      .toLowerCase()
      .split(" ")
      .map((n) => n[0])
      .join("");
  });
};
createUserNames(accounts);

// UPDATING UI =====

const updateUI = function (acc) {
  // DISPLAY MOVEMENTS
  displayMovements(acc.movements);

  // DISPLAY BALANCE
  calcDisplayBalance(acc);

  // DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

//======= EVENTS HANDLERS

let currentAccount;
loginBtn.addEventListener("click", function (e) {
  // Prevent Default Submit
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === loginUser.value);

  if (currentAccount?.pin === Number(loginPin.value)) {
    labelWelcome.innerText = `Welcome Mr ${currentAccount.fName
      .split(" ")
      .slice(1, 2)}`;

    containerApp.style.opacity = 100;

    loginUser.value = loginPin.value = "";
    loginPin.blur();

    // UPDATE UI
    updateUI(currentAccount);
  }
});

//====== BANK TRANSFER
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }

  updateUI(currentAccount);
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((acc) => acc >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

//==== CLOSE ACCOUNT

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    // DELETE ACCOUNT

    accounts.splice(index, 1);

    // close account

    containerApp.style.opacity = 0;
  }

  labelWelcome.innerText = "Login to get started";
  inputCloseUsername.value = inputClosePin.value = "";
});
