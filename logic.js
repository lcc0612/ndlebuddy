/*	LOGIC.js
	Contains the actual heavy lifting logic, performing all the calculations etc
	Should only work with strings and lists and have no coupling with the UI or controller
*/

const SYMBOLS = ["0","1","2","3","4","5","6","7","8","9","+","-","*","/","="]
const OPERATORS = ["+","-","*","/","="]

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
	if (exclude == null) exclude = []
	if (musthave == null) musthave = []
	
	if (!isValid(code)) {
		return []
	}
	
	if (containsExclusions(code, exclude)) {
		return []
	}
	
	if (strCount(code, "?") == 0) {
		if (isMissingMusthaves(code, musthave)) {
			return []
		}
		
		if (isCorrect(code)) {
			return [code]
		}
		else {
			return []
		}
	}
	
	var results = []
	var substitutions = substituteFirstUnknown(code, exclude)
	for (var possibleCode of substitutions) {
		results = results.concat(generatePossibilities(possibleCode, exclude, musthave))
	}
	return results
}


/*	isValid returns false if the given code breaks mathematical format
		"?"s are ignored and will never cause a code to become invalid
	Example use case:
		isValid("3??=2=2") returns false due to there being 2 equals signs
*/
function isValid(code) {
	// 1. Only the symbols in SYMBOLS, plus "?" are allowed
	for (var c of code) {
		if (!SYMBOLS.includes(c) && c != "?") {
			return false
		}
	}
	
	// 2. The last character cannot be an operator
	if (OPERATORS.includes(code[code.length - 1])) {
		return false
	}
	
	// 3. The first character cannot be a non-unary operator
	if (["*", "/", "="].includes(code[0])) {
		return false
	}
	
	// 4. Disallow certain operator pairings except where allowed by unary + and -
	const DISALLOWED_PAIRINGS = ["+*", "+/", "+=", "-*", "-/", "-=", "*=", "/=", "=*", "=/", "**", "//"]
	for (var pair of DISALLOWED_PAIRINGS) {
		if (code.includes(pair)) {
			return false
		}
	}
	
	// 5. Only 0 or 1 equals sign(s) allowed
	var equalsSignCount = strCount(code, "=")
	if (equalsSignCount > 1) {
		return false
	}
	
	// 6. If there is an equals sign, no operators should appear on the right hand side except unary operators
	// TODO: The case of multiple unary operators is not handled here
	if (equalsSignCount == 1) {
		var tokens = code.split("=")
		if (OPERATORS.includes(tokens[1]) && !["+","-"].includes(tokens[1])) {
			return false
		}
		for (var c of tokens[1].substring(1)) {
			if (OPERATORS.includes(c)) {
				return false
			}
		}
	}
	
	return true
}

/*	isCorrect returns true if the given code is a complete equation that is mathematically correct
	Prerequisites (Unchecked):
		1. The code must be valid per the rules of isValid()
		2. There are no "?"s in the code
		3. The given code must contain an equals sign
	Example use case:
		isCorrect("3+5=8") returns true
		isCorrect("4*5=2") returns false
*/
function isCorrect(code) {
	code = stripLeadingZeros(code)
	var tokens = code.split("=")
	try {
		var lhs = eval(tokens[0])
		var rhs = eval(tokens[1])
		return lhs == rhs
	}
	catch (err) {
		return false
	}
}

/*	stripLeadingZeros removes zeros from the front of each operand, to prevent JavaScript from interpreting the numbers as octal
	The result of this function may not be the same length as its input
	Prerequisites:
		There are no "?"s in the code
	Example use case:
		stripLeadingZeros("003+007=010") returns "3+7=10"
*/
function stripLeadingZeros(code) {
	var output = ""
	var operators = ["+","-","*","/","="]
	var acceptable = false
	
	for (var c of code) {
		if (acceptable) {
			output += c
			
			if (operators.includes(c)) {
				acceptable = false
			}
		}
		else if (!acceptable && !operators.includes(c) && c != 0) {
			acceptable = true
			output += c
		}
	}
	
	return output
}

/*	isMissingMusthaves returns true if the given code is missing items set as "Must have"
	Prerequisites:
		1. The equation should be complete, ie. Have no "?"s
	Example use case:
		isMissingMusthaves("1+1=2", "123") returns true because "3" is missing
*/
function isMissingMusthaves(code, musthave) {
	for (var m of musthave) {
		if (!code.includes(m)) {
			return true
		}
	}
	return false
}

/*	containsExclusions returns true if the given code contains items marked for exclusion
	It is guaranteed that "?"s will not cause a code to be flagged
	Example use case:
		containsExclusions("1+1=2", "2") returns true because "2" is present in the exclusion list
*/
function containsExclusions(code, exclude) {
	for (var c of code) {
		if (exclude.includes(c)) {
			return true
		}
	}
	return false
}

/*	substituteFirstUnknown generates a list of possible candidates for the first "?"
	There is no guarantee that the answers returned are valid (per isValid) or mathematically correct (per isCorrect)
	Prerequisites:
		1. There should be at least one "?" in the code
	Example use case:
		substituteFirstUnknown("1+?=?", exclude="34567-")
		returns ["1+1=?", "1+2=?", "1+8=?", "1+9=?", "1+0=?", "1++=?", "1+*=?", "1+/=?", "1+==?"]
*/
function substituteFirstUnknown(code, exclude) {
	var results = []
	var qnMarkIdx = code.indexOf("?")
	
	if (qnMarkIdx == -1) {
		return []
	}
	
	var left = code.substring(0,qnMarkIdx)
	var right = code.substring(qnMarkIdx+1)
	
	for (var c of SYMBOLS) {
		if (!exclude.includes(c)) {
			results.push(left + c + right)
		}
	}
	
	return results
}