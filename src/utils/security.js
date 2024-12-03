
"use strict";
/**
 * 
 * @param {length: number, includeUppercase: bool, includeLowercase: bool, includeNumbers: bool, includeSymbols: bool} options 
 * @returns {String}
 */
function generateRandomPassword({
	length,
	includeUppercase,
	includeLowercase,
	includeNumbers,
	includeSymbols
}) {
	const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
	const numberChars = '0123456789';
	const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

	let allChars = '';
	const requiredChars = [];

	if (includeUppercase) {
		requiredChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
		allChars += uppercaseChars;
	}
	if (includeLowercase) {
		requiredChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
		allChars += lowercaseChars;
	}
	if (includeNumbers) {
		requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
		allChars += numberChars;
	}
	if (includeSymbols) {
		requiredChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
		allChars += symbolChars;
	}

	if (!allChars) throw new Error('No characters available for password generation.');

	let password = requiredChars.join('');
	for (let i = password.length; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * allChars.length);
		password += allChars[randomIndex];
	}

	password = password.split('').sort(() => 0.5 - Math.random()).join('');

	return password;
}



module.exports = {
	generateRandomPassword,
};