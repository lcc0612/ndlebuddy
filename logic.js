/*	LOGIC.js
	Contains the actual heavy lifting logic, performing all the calculations etc
	Should only work with strings and lists and have no coupling with the UI or controller
*/

const SYMBOLS = ["1","2","3","4","5","6","7","8","9","0","+","-","*","/","="]
const OPERATORS = ["+","-","*","/","="]

/*	generatePossibilities returns a list of all possible solutions for any given puzzle state
	The solutions are returned as a dictionary of priorities associated with the answers, with the following priority rules:
		1. PRIORITY_OPENING - Favored for having unique symbols in the entire equation, must not be "weird"
		2. PRIORITY_STANDARD - Neither an opening, nor "weird"
		3. PRIORITY_WEIRD - Uses unary operators or leading zeros

	Parameters:
		code - A string representing the current puzzle state, with unknowns marked as "?"
			   The puzzle size is determined from the length of this string
		exclude - A string representing all symbols that MUST NOT appear in the result
		musthave - A string representing all symbols that MUST appear in the result
		
		Note that all parameter values must be legal values in the game, as defined in the SYMBOLS list above
		This function is merely a wrapper about generatePossibilitiesRecur(), to address problems that only crop up once
		
	Example use case:
		generatePossibilities("?+?=??", "2345", "18")
		returns {
			PRIORITY_OPENING: ["8+9=17", "9+8=17"],
			PRIORITY_STANDARD: ["8+8=16", "9+9=18"],
			PRIORITY_WEIRD: ["1+7=08", "1+8=09", "7+1=08", "8+1=09"]
		}
*/
function generatePossibilities(code, exclude, musthave) {
	if (hasIllegalCharacters(code)) {
		throw "There are unacceptable characters in the code!"
	}
	
	var ans = generatePossibilitiesRecur(code, exclude, musthave)
	ans = sortByPriority(ans)
	
	return ans
}

/*	generatePossibilitiesRecur is the heavy-lifting recursive function that drives the program
	For specifications, refer to generatePossibilities() above
*/
function generatePossibilitiesRecur(code, exclude, musthave) {
	if (exclude == null) exclude = []
	if (musthave == null) musthave = []
	
	if (!isValid(code)) {
		return []
	}
	
	if (validForShortcutSolve(code)) {
		try {
			code = shortcutSolve(code)
		}
		catch (err) {
			return []
		}
	}
	
	if (containsExclusions(code, exclude)) {
		return []
	}
	
	if (cannotAttainMusthaves(code, musthave)) {
		return []
	}
	
	if (!code.includes("?")) {
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
		results = results.concat(generatePossibilitiesRecur(possibleCode, exclude, musthave))
	}
	return results
}

/*	hasIllegalCharacters() checks if the code contains symbols not recognized by the program
*/
function hasIllegalCharacters(code) {
	for (var c of code) {
		if (!SYMBOLS.includes(c) && c != "?") {
			return true
		}
	}
	return false
}


/*	isValid returns false if the given code breaks mathematical format
		"?"s are ignored and will never cause a code to become invalid
	Example use case:
		isValid("3??=2=2") returns false due to there being 2 equals signs
*/
function isValid(code) {
	// Rule 1 has now been extracted into hasIllegalCharacters(), but the numbering will remain
	
	// 2. The last character cannot be an operator
	if (OPERATORS.includes(code[code.length - 1])) {
		return false
	}
	
	// 3. The first character cannot be a non-unary operator
	if (["*", "/", "="].includes(code[0])) {
		return false
	}
	
	// Rule 4 below is no longer enforced, and is instead avoided by substituteFirstUnknown()
	// 4. Disallow certain operator pairings except where allowed by unary + and -
	
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
	var prev = ""
	
	for (var c of code) {
		if (acceptable) {
			output += c
			
			if (operators.includes(c)) {
				acceptable = false
			}
		}
		else if (!acceptable && operators.includes(c)) {
			if (prev == "0") {
				output += "0" + c
			}
			else {
				output += c
			}
		}
		else if (!acceptable && !operators.includes(c) && c != 0) {
			acceptable = true
			output += c
		}
		
		prev = c
	}
	
	if (!acceptable && prev == "0") {
		output += "0"
	}
	
	return output
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
	
	var prev
	var next
	if (qnMarkIdx > 0) {
		prev = code[qnMarkIdx - 1]
	}
	if (qnMarkIdx < code.length - 1) {
		next = code[qnMarkIdx + 1]
	}
	
	if (OPERATORS.includes(prev) || OPERATORS.includes(next)) {
		exclude = exclude.concat(["*","/","="])
	}
	
	var left = code.substring(0,qnMarkIdx)
	var right = code.substring(qnMarkIdx+1)
	
	var symbolsToExplore = SYMBOLS.filter(function(value, index, arr) {
		return !exclude.includes(value)
	})
	
	for (var c of symbolsToExplore) {
		results.push(left + c + right)
	}
	
	return results
}

/*	validForShortcutSolve returns true if all of the following conditions are met:
		1. There is exactly one equals sign
		2. On the left of the equals sign is a complete equation without any "?"
		3. There is at least one "?" on the right side of the equals sign
		Note that validity does not imply the answer returned will be correct
	Example use case:
		validForShortcutSolve("1+2=?") returns true
*/
function validForShortcutSolve(code) {
	if (strCount(code, "=") != 1) {
		return false
	}
	
	var tokens = code.split("=")
	if (tokens[0].includes("?")) {
		return false
	}
	
	if (!tokens[1].includes("?")) {
		return false
	}
	
	return true
}

/*	shortcutSolve looks for an equation that can be shortcut-solved, per validForShortcutSolve, and replaces the "?" with the mathematically correct answer
	It may throw exception if the left-hand-side fails to evaluate, or if it encounters an "unsolvable" situation
	Example use case:
		shortcutSolve("8*6=??") returns "8*6=48"
		shortcutSolve("9*9=?") throws an exception (since the answer 81 cannot fit in the one digit space given)
*/
function shortcutSolve(code) {
	var tokens = code.split("=")
	var ans = eval(tokens[0]).toString()
	
	if (ans.length > tokens[1].length) {
		throw "The answer does not fit in the space given"
	}
	
	if (ans.includes(".")) {
		throw "The answer contains decimals"
	}
	
	while (ans.length < tokens[1].length) {
		ans = "0" + ans
	}
	
	if (strCount(tokens[1], "?") < tokens[1].length) {
		for (var i=0; i<ans.length; i++) {
			if (tokens[1][i] != "?" && tokens[1][i] != ans[i]) {
				throw "Shortcut solve produces an answer that does not fit the blanks"
			}
		}
	}
	
	return tokens[0] + "=" + ans
}

/*	cannotAttainMusthaves checks if musthaves can be met, even if there are still unknowns
	It does so by comparing the number of ?s to the number of musthaves that are yet to be met
	Example use cases:
		cannotAttainMusthaves("1??", "234") returns false, because there is no way to fulfil the presence of 2, 3 AND 4 in 2 spaces
*/
function cannotAttainMusthaves(code, musthave) {
	if (musthave == null || musthave == "") {
		return false
	}
	
	var numQnMarks = strCount(code, "?")
	var numMusthavesUnmet = musthave.length
	for (var c of musthave) {
		if (code.includes(c)) {
			numMusthavesUnmet -= 1
		}
	}
	return numQnMarks < numMusthavesUnmet 
}


/*	determinePriority classes an equation into one of four "levels" as follows:
		1. PRIORITY_OPENING - Favored for having unique symbols in the entire equation, must not be "weird"
		2. PRIORITY_STANDARD - Neither an opening, nor "weird"
		3. PRIORITY_WEIRD - Uses unary operators or leading zeros
		// TODO: Include zero operands under "weird"
	Prerequisites:
		The given code must be valid (per isValid) and correct (per isCorrect), without "?"s
*/
function determinePriority(code) {
	if (hasUnaryOperators(code) || hasLeadingZeros(code)) {
		return PRIORITY_WEIRD
	}
	if (hasUniqueCharacters(code)) {
		return PRIORITY_OPENING
	}
	return PRIORITY_STANDARD
}

/*	hasUnaryOperators returns whether unary operators are present in a given code
	Prerequisites:
		The given code must be valid (per isValid) and correct (per isCorrect)
*/
function hasUnaryOperators(code) {
	if (code[0] == "-" || code[0] == "+") return true
	
	var prevIsOp = false
	for (var c of code) {
		var isOp = OPERATORS.includes(c)
		
		if (!isOp) {
			prevIsOp = false
		}
		else if (!prevIsOp && isOp) {
			prevIsOp = true
		}
		else if (prevIsOp && isOp) {
			return true
		}
	}
	return false
}

/*	hasLeadingZeros returns whether any term in a given code has leading zeros
	Note that this function relies on correct implementation of stripLeadingZeros()
	Prerequisites:
		The given code must be valid (per isValid) and correct (per isCorrect), without "?"s
*/
function hasLeadingZeros(code) {
	return stripLeadingZeros(code).length < code.length
}

/*	hasUniqueCharacters returns whether every character in an equation is unique
	Prerequisites:
		The given code must be valid (per isValid) and correct (per isCorrect)
*/
function hasUniqueCharacters(code) {
	var seen = []
	for (var c of code) {
		if (seen.includes(c)) {
			return false
		}
		seen.push(c)
	}
	return true
}

/*	sortByPriority returns a dictionary containing all codes given, but sorted per the priority system above
	Parameters:
		- codes: An array of codes
	Returns:
		- A dictionary with the keys PRIORITY_OPENING, PRIORITY_STANDARD and PRIORITY_WEIRD, associated to arrays containing codes with the stated priority
*/
function sortByPriority(codes) {
	var result = {}
	result[PRIORITY_OPENING] = []
	result[PRIORITY_STANDARD] = []
	result[PRIORITY_WEIRD] = []
	
	for (var c of codes) {
		var priority = determinePriority(c)
		result[priority].push(c)
	}
	return result
}