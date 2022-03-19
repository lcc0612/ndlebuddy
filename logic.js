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
	// TODO: To Implement
	return []
}