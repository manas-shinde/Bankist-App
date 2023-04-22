'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  transactions: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  transactionsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-02-01T10:17:24.185Z',
    '2023-03-08T14:11:59.604Z',
    '2023-04-07T17:01:17.194Z',
    '2023-04-11T23:36:17.929Z',
    '2023-04-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  transactionsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-04-11T18:49:59.371Z',
    '2023-04-12T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Manas Shinde',
  transactions: [8000, 12400, -1050, -790, -3210, -1000, 80500, -30],
  interestRate: 1.5,
  pin: 9999,

  transactionsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-04-11T18:49:59.371Z',
    '2023-04-12T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containertransaction = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displaytransactionWithDaysPassed = (date1, date2) => {
  let daysPassed = Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  if (daysPassed === 0) return `Today`;
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed > 1) return `${daysPassed} days`;
};

const displayStandardDate = date => {
  let day = `${date.getDate()}`.padStart(2, '0');
  let month = `${date.getMonth()}`.padStart(2, '0');
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/////////////////////////////////////////////////
///Displaying the movements
const displaytransaction = function (acc, sort = false) {
  containertransaction.innerHTML = '';

  const transactions = sort
    ? acc.transactions.slice().sort((a, b) => a - b)
    : acc.transactions;

  transactions.forEach(function (transaction, i) {
    const type = transaction > 0 ? 'deposit' : 'withdrawal';

    let date = new Date(acc.transactionsDates[i]);

    let displayDate = displayStandardDate(date);

    // let displayDate = displaytransactionWithDaysPassed(new Date(), date);
    let formattedMov = formatCurrency(transaction, acc.currency, acc.locale);

    const html = `
      <div class="transactions__row">
        <div class="transactions__type transactions__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="transactions__date">${displayDate}</div>
        <div class="transactions__value">${formattedMov}</div>
      </div>
    `;

    containertransaction.insertAdjacentHTML('afterbegin', html);
  });
};

// Format the currency using 'Intl' API
const formatCurrency = (value, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

///Display balence
const calcDisplayBalance = function (acc) {
  acc.balance = acc.transactions.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.currency,
    acc.locale
  );
};

///Displaying summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.transactions
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.currency, acc.locale);

  const out = acc.transactions
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(out, acc.currency, acc.locale);

  const interest = acc.transactions
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.currency,
    acc.locale
  );
};

///Creating usernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display transaction
  displaytransaction(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
const setCurrentTime = locale => {
  let now = new Date();
  // let day = `${now.getDate()}`.padStart(2, '0');
  // let month = `${now.getMonth()}`.padStart(2, '0');
  // let year = now.getFullYear();
  // let hour = now.getHours();
  // let min = now.getMinutes();
  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

  let option = {
    hour: 'numeric',
    mintue: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };

  labelDate.textContent = Intl.DateTimeFormat(locale, option).format(now);
};

/////////////////////////
// Timer function
const startLogoutTimer = () => {
  const tick = function () {
    //In each call pring the remaining time in the UI
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and logout
    if (time === 0) {
      clearInterval(timer);

      containerApp.style.opacity = '0';
      containerApp.style.visibility = 'hidden';
      labelWelcome.textContent = 'Log in to get started';
    }

    //Decrease 1s
    time--;
  };

  //set time to 5 minures
  let time = 60 * 5;

  //call the timer ever second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    setCurrentTime(currentAccount.locale);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Start the Log out timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

////////////////////////
//Balence transfering
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.transactions.push(-amount);
    receiverAcc.transactions.push(amount);

    // Add date and time
    currentAccount.transactionsDates.push(new Date().toISOString());
    receiverAcc.transactionsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

////////////////////////
//Taking Load
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.transactions.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      // Add movement
      currentAccount.transactions.push(loanAmount);

      // Update date and time for loan
      currentAccount.transactionsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Added the alert
      alert(
        `Loan of amount ${formatCurrency(
          loanAmount,
          currentAccount.currency,
          currentAccount.locale
        )} has been approved.`
      );
    }, 30000);
  } else {
    alert(
      `Arrat-Bank wont be able to provide a loan of ${formatCurrency(
        loanAmount,
        currentAccount.currency,
        currentAccount.locale
      )}.`
    );
  }
  inputLoanAmount.value = '';

  // Reset Timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

////////////////////////
//Closing the account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

///////////////////////
//Sorting macanism
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displaytransaction(currentAccount, !sorted);
  sorted = !sorted;
});
