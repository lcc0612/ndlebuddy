/*	LOGIC.js
	Contains the actual heavy lifting logic, performing all the calculations etc
	Should only work with strings and lists and have no coupling with the UI or controller
*/

SYMBOLS = ["0","1","2","3","4","5","6","7","8","9","+","-","*","/","="]

/*	generatePossibilities returns a list of all possible solutions for any given puzzle state
	Parameters:
		code - A string representing the current puzzle state, with unknowns marked as "?"
			   The puzzle size is determined from the length of this string
		exclude - A string representing all symbols that MUST NOT appear in the result
		musthave - A string representing all symbols that MUST appear in the result
		
		Note that all parameter values must be legal values in the game, as defined in the SYMBOLS list above
		
	Example use case:
		generatePossibilities("?+?=8", exclude="7", musthave="")
		returns ["0+8=8", "2+6=8", "3+5=8", "4+4=8", "5+3=8", "6+2=8", "8+0=8"]
*/
function generatePossibilities(code, exclude, musthave) {
	if (!isValid(code)) {
		return []
	}
	
	if (strCount(code, "?") == 0) {
		if (isCorrect(code)) {
			return [code]
		}
		else {
			return []
		}
	}
	
	// TODO: Recursively generate possibilities
	
	return []
}

/*	isValid returns false if the given code breaks mathematical format
		"?"s are ignored and will never cause a code to become invalid
	Example use case:
		isValid("3??=2=2") returns false due to there being 2 equals signs
*/
function isValid(code) {
	// TODO: Implement function using the following rules:
	//		1. Only the symbols in SYMBOLS, plus "?" are allowed
	//		2. Only 0 or 1 equals sign(s) allowed
	//		3. If there is an equals sign, no operators should appear on the right hand side
	//		4. The last character cannot be an operator
	//		5. Disallow certain operator pairings, specifically: "+*", "+/", "+=", "-*", "-/", "-=", "*=", "/=", "=*", "=/" 
	return true
}

/*	isCorrect returns true if the given code is a complete equation that is mathematically correct
	Prerequisites:
		1. The code must be valid per the rules of isValid()
		2. There are no "?"s in the code
		3. The given code must contain an equals sign
	Example use case:
		isCorrect("3+5=8") returns true
		isCorrect("4*5=2") returns false
*/
function isCorrect(code) {
	// TODO: Implement function
	return true
}

