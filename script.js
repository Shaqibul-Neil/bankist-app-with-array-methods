'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

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

//--------------------------------------------
//creating username
const creatingUserName = function (accs) {
  accs.forEach(
    acc =>
      (acc.userName = acc.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
};
creatingUserName(accounts);

//--------------------------------------------
//showing movements
const displayMovements = function (movements, sorting = false) {
  containerMovements.innerHTML = '';
  const sortedMovement = sorting
    ? movements.slice().sort((a, b) => a - b)
    : movements;
  sortedMovement.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__value">${mov}€</div>
          </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//--------------------------------------------
//calculating balance
const calculatingBalance = function (acc) {
  acc.overallBalance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.overallBalance}€`;
};

//--------------------------------------------
//calculating summary
const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1) //interest that is greatrer than 1
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}`;
};

//--------------------------------------------
//displaying ui
const updateUi = function (acc) {
  //showing movements
  displayMovements(acc.movements);
  //calculating balance
  calculatingBalance(acc);
  //calculating summary
  displaySummary(acc);
};

//--------------------------------------------
//implementing login
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    updateUi(currentAccount);
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

//--------------------------------------------
//implementing transfers
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const receiverAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    receiverAmount > 0 &&
    currentAccount.overallBalance >= receiverAmount &&
    receiverAcc &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-receiverAmount);
    receiverAcc.movements.push(receiverAmount);
    updateUi(currentAccount);
  }
});

//--------------------------------------------
//requesting loan
//Bank Condition = Loan will be granted if Atleast One deposit is atleast 10% of the requested loan amount
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const requestedLoan = Number(inputLoanAmount.value);
  if (
    requestedLoan > 0 &&
    currentAccount.movements.some(mov => mov >= requestedLoan * 0.1)
  ) {
    currentAccount.movements.push(requestedLoan);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

//--------------------------------------------
//close account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//--------------------------------------------
//sorting
let sortedState = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sortedState);
  sortedState = !sortedState;
});
