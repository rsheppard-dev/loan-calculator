import './style.css';

// function to get values from user interface
function getValues(e: Event): void {
	// prevent default form behaviour (page refresh)
	e.preventDefault();

	// get elements from html page
	const loanAmountInput = document.getElementById(
		'loan-amount'
	) as HTMLInputElement;
	const termInput = document.getElementById('term') as HTMLInputElement;
	const rateInput = document.getElementById('rate') as HTMLInputElement;

	// get values from inputs
	const loanAmount = parseInt(loanAmountInput.value);
	const term = parseInt(termInput.value);
	const rate = parseInt(rateInput.value);

	// clear any old errors
	handleError();

	// validate inputs are integers
	if (
		![loanAmount, term, rate].every((input: number): boolean =>
			Number.isInteger(input)
		)
	) {
		return handleError('All inputs must contain a valid number!');
	}

	// call displayPayments function to output results
	displayPayments(loanAmount, term, rate);
}

// function to create an array of numbers for each payment
function getNumberOfPayments(term: number): number[] {
	const payments: number[] = [];

	// loop through each number from 1 to loan term
	// add number to payments array
	for (let i = 1; i <= term; i++) {
		payments.push(i);
	}

	return payments;
}

// function to calculate monthly payment
function getMonthlyPayment(
	loanAmount: number,
	term: number,
	rate: number
): number {
	return (loanAmount * (rate / 1200)) / (1 - (1 + rate / 1200) ** -term);
}

// function to calculate interest payment
function getInterestPayment(balance: number, rate: number): number {
	return balance * (rate / 1200);
}

// function to calculate principle payment
function getPrinciplePayment(
	monthlyPayment: number,
	interestPayment: number
): number {
	return monthlyPayment - interestPayment;
}

function displayPayments(loanAmount: number, term: number, rate: number): void {
	// get dom elements
	const tableBody = document.getElementById(
		'results'
	) as HTMLTableSectionElement;
	const rowTemplate = document.getElementById(
		'table-row-template'
	) as HTMLTemplateElement;

	// create array of numbers based on number of payments
	const payments = getNumberOfPayments(term);

	// get monthly payment
	const monthlyPayment = getMonthlyPayment(loanAmount, term, rate);

	// get start balance
	let balance = loanAmount + getInterestPayment(loanAmount, rate);
	let totalInterest = 0;

	// for each due payment...
	payments.forEach((payment: number) => {
		const interestPayment = getInterestPayment(balance, rate);
		const principalPayment = getPrinciplePayment(
			monthlyPayment,
			interestPayment
		);

		// increase interest total
		totalInterest += interestPayment;

		// reduce total balance
		balance = balance - monthlyPayment;

		// clone template to create new row
		const tableRow = document.importNode(rowTemplate.content, true);

		// create an array of columns in the row
		const rowCols = tableRow.querySelectorAll('td');

		// add month to first column
		rowCols[0].innerText = payment.toString();

		// add payment to second column
		rowCols[1].innerText = monthlyPayment.toFixed(2);

		// add principal to third column
		rowCols[2].innerText = principalPayment.toFixed(2);

		// add interest to forth column
		rowCols[3].innerText = interestPayment.toFixed(2);

		// add total interest to fifth column
		rowCols[4].innerText = totalInterest.toFixed(2);

		// add balance to sixth column
		rowCols[5].innerText = balance.toFixed(2);

		// add row to table
		tableBody.appendChild(tableRow);
	});
}

// function to display and hide error message
function handleError(message?: string): void {
	// get error box element from html
	const errorBox = document.getElementById('error') as HTMLDivElement;

	if (message) {
		// display if message received
		errorBox.innerText = message;
		errorBox.classList.remove('d-none');
	} else if (!errorBox.classList.contains('d-none')) {
		// else remove error box if one exists
		errorBox.innerText = '';
		errorBox.classList.add('d-none');
	}
}

// get button element
const submitButton = document.getElementById('submit') as HTMLButtonElement;

// create event listener for when user clicks button
submitButton.addEventListener('click', getValues);
