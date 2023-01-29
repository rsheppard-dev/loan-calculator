import './style.css';

// function to get values from user interface
const getValues = (e: Event): void => {
	// prevent default form behaviour (page refresh)
	e.preventDefault();

	// get elements from html page
	const startValueInput = document.getElementById(
		'startValue'
	) as HTMLInputElement;
	const endValueInput = document.getElementById('endValue') as HTMLInputElement;

	// get values from inputs and parse to integers
	const startValue = parseInt(startValueInput.value);
	const endValue = parseInt(endValueInput.value);

	// check values entered by user are valid numbers
	if (Number.isInteger(startValue) && Number.isInteger(endValue)) {
		// call generateNumbers function with input values
		const numbers = generateNumbers(startValue, endValue);

		// call displayNumbers function
		displayNumbers(numbers);
	} else {
		// display error on page if invalid input
		handleError('You can only enter numbers in the inputs above.');
	}
};

// function to generate numbers between startValue and endValue
const generateNumbers = (startValue: number, endValue: number): number[] => {
	const numbers: number[] = [];

	// loop through all numbers from startValue to endValue
	for (let i = startValue; i <= endValue; i++) {
		// add current number to end of numbers array
		numbers.push(i);
	}

	return numbers;
};

// function to display number range
const displayNumbers = (numbers: number[]): void => {
	// get table body from html document
	const tableBody = document.getElementById(
		'results'
	) as HTMLTableSectionElement;

	let templateRows = '';

	// loop through all the numbers
	for (let i = 0; i < numbers.length; i++) {
		const number = numbers[i];

		// check if current number is even or odd and assign correct class
		const className = number % 2 === 0 ? 'even' : 'odd';

		// update template rows
		templateRows += `<tr><td class="${className}">${number}<td></tr>`;
	}

	// update html in table body
	tableBody.innerHTML = templateRows;
};

// function to display and hide error message
const handleError = (message?: string): void => {
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
};

// get button element
const submitButton = document.getElementById('submit') as HTMLButtonElement;

// create event listener for when user clicks button
submitButton.addEventListener('click', getValues);
