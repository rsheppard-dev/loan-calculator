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
	const loanAmount = parseFloat(loanAmountInput.value);
	const term = parseFloat(termInput.value);
	const rate = parseFloat(rateInput.value);

	// clear any old errors
	handleError();

	// validate all inputs are numbers
	if (
		![loanAmount, term, rate].every(
			(input: number): boolean => typeof input == 'number' && !isNaN(input)
		)
	)
		return handleError('All inputs must contain a valid number!');

	// check number of months does not include a decimal
	if (!Number.isInteger(term))
		return handleError("Number of months can't include decimals!");

	// call displayPayments function to output results
	displayPayments(loanAmount, term, rate);
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
function getPrincipalPayment(
	monthlyPayment: number,
	interestPayment: number
): number {
	return monthlyPayment - interestPayment;
}

function displayPayments(loanAmount: number, term: number, rate: number): void {
	// get dom elements
	const monthlyPaymentOutput = document.getElementById(
		'monthly-payment'
	) as HTMLDivElement;
	const totalPrincipalOutput = document.getElementById(
		'total-principal'
	) as HTMLTableCellElement;
	const totalInterestOutput = document.getElementById(
		'total-interest'
	) as HTMLTableCellElement;
	const totalCostOutput = document.getElementById(
		'total-cost'
	) as HTMLTableCellElement;
	const tableBody = document.getElementById(
		'results'
	) as HTMLTableSectionElement;
	const rowTemplate = document.getElementById(
		'table-row-template'
	) as HTMLTemplateElement;

	// clear any old data in table
	tableBody.innerHTML = '';

	// get monthly payment
	const monthlyPayment = getMonthlyPayment(loanAmount, term, rate);

	// initialise balance and interest
	let remainingBalance = loanAmount;
	let totalInterest = 0;

	// for each due payment...
	for (let i = 1; i <= term; i++) {
		// calculate interest and principal
		const interest = getInterestPayment(remainingBalance, rate);
		const principal = getPrincipalPayment(monthlyPayment, interest);

		// update balance and interest
		remainingBalance = remainingBalance - principal;
		totalInterest += interest;

		// clone template row
		const tableRow = document.importNode(rowTemplate.content, true);

		// get all row columns
		const rowCols = tableRow.querySelectorAll('td');

		// update columns with current payment data
		rowCols[0].innerText = i.toString();
		rowCols[1].innerText = '£' + monthlyPayment.toFixed(2);
		rowCols[2].innerText = '£' + principal.toFixed(2);
		rowCols[3].innerText = '£' + interest.toFixed(2);
		rowCols[4].innerText = '£' + totalInterest.toFixed(2);
		rowCols[5].innerText = '£' + remainingBalance.toFixed(2);

		// add row to table
		tableBody.appendChild(tableRow);
	}

	// calculate total cost
	const totalCost = loanAmount + totalInterest;

	// update payment summary details
	monthlyPaymentOutput.innerText = '£' + monthlyPayment.toFixed(2);
	totalPrincipalOutput.innerText = '£' + loanAmount.toFixed(2);
	totalInterestOutput.innerText = '£' + totalInterest.toFixed(2);
	totalCostOutput.innerText = '£' + totalCost.toFixed(2);
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

export {};
