/*	UTIL.js
	General utilities that don't pertain specifically to the problem solving in this domain, but makes life easier somehow.
*/

// CONSTANTS
var PRIORITY_OPENING = 1
var PRIORITY_STANDARD = 2
var PRIORITY_WEIRD = 3
var PRIORITY_ENUM = [PRIORITY_OPENING, PRIORITY_STANDARD, PRIORITY_WEIRD]


/*	strCount counts the number of occurences of a substring in a string
	Parameters:
		haystack - Input string to count within
		needle - Token to match on
	
	Example use case:
		strCount("1+??=???", "?")
		returns 5
		
	Reference:
		https://stackoverflow.com/questions/881085/count-the-number-of-occurrences-of-a-character-in-a-string-in-javascript/50592629#50592629
*/
function strCount(haystack, needle) {
	if (haystack == "" || needle == "" || !haystack.includes(needle)) return 0;
	return haystack.split(needle).length - 1;
}