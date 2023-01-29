const closeButton = document.getElementById('close') as HTMLButtonElement;

const closeApp = (): void => {
	window.open('about:blank', '_self');
	window.close();
};

closeButton.addEventListener('click', closeApp);

export {};
