describe("logic.js :: isValid() Test", function() {
	describe("Rule 1 - Only allowed symbols should appear", function() {
		it("Statement with only allowed symbols", function() {
			chai.assert.isTrue(isValid("1+2+3+4"))
		})
		it("Statement with question marks", function() {
			chai.assert.isTrue(isValid("1+2??+4"))
		})
		it("Statement with equals sign", function() {
			chai.assert.isTrue(isValid("1+2??=99"))
		})
		it("Statement with one invalid character", function() {
			chai.assert.isFalse(isValid("1+2!?=99"))
		})
		it("Statement with multiple invalid characters", function() {
			chai.assert.isFalse(isValid("3#$$))+2!?=99"))
		})
	})
	
	describe("Rule 2 - Last character must not be an operator", function() {
		it ("Last character is equals", function() {
			chai.assert.isFalse(isValid("123="))
		})
		it ("Last character is plus", function() {
			chai.assert.isFalse(isValid("123645645+"))
		})
		it ("Only character is asterisk", function() {
			chai.assert.isFalse(isValid("*"))
		})
	})
	
	describe("Rule 3 - First character must not be an operator that does not support unary functions", function() {
		it ("First character is equals", function() {
			chai.assert.isFalse(isValid("=351?"))
		})
		it ("First character is slash", function() {
			chai.assert.isFalse(isValid("/3+2"))
		})
		it ("First character is asterisk", function() {
			chai.assert.isFalse(isValid("*5=3"))
		})
	})
	
	describe("Rule 4 - Disallow operator pairings outside of what is provided by unary operators", function() {
		it ("Contains several", function() {
			chai.assert.isFalse(isValid("2+/5-=3"))
		})
		it ("Contains only one pairing allowed by unary operators", function() {
			chai.assert.isTrue(isValid("-3+5=2"))
		})
	})
	
	describe("Rule 5 - Only zero or one equals sign(s) allowed", function() {
		it ("No equals signs", function() {
			chai.assert.isTrue(isValid("2+5"))
		})
		it ("One equals sign", function() {
			chai.assert.isTrue(isValid("1+2=?"))
		})
		it ("Multiple equals signs", function() {
			chai.assert.isFalse(isValid("1=?=?"))
		})
	})
	
	describe("Rule 6 - No operators should appear on the right of an equals sign", function() {
		it ("Valid case", function() {
			chai.assert.isTrue(isValid("6*5+1=31"))
		})
		it ("Invalid case", function() {
			chai.assert.isFalse(isValid("1+2=0+3"))
		})
		it ("One Unary operator on right hand side (immediately after equals) is allowed", function() {
			chai.assert.isTrue(isValid("1+2=+3"))
		})
	})
	
	describe("Other", function() {
		it("The ? symbol should not make an otherwise valid code invalid", function() {
			chai.assert.isTrue(isValid("?+?=???"))
		});
	})
})


describe("logic.js :: isCorrect() test", function() {
	describe("Correct Equations", function() {
		it("Simple correct equation", function() {
			chai.assert.isTrue(isCorrect("1+2=3"))
		})
		it("Simple correct equation with division", function() {
			chai.assert.isTrue(isCorrect("6/2=3"))
		})
		it("Simple correct equation with multiple operators", function() {
			chai.assert.isTrue(isCorrect("1+3+4-2=6"))
		})
		it("Correct equation involving order of operations considerations", function() {
			chai.assert.isTrue(isCorrect("1+6/2+4=8"))
		})
	})
	
	describe("Wrong Equations", function() {
		it("Simple incorrect equation", function() {
			chai.assert.isFalse(isCorrect("1+2=4"))
		})
		it("Incorrect equation involving division and rounding", function() {
			chai.assert.isFalse(isCorrect("7/2=3"))
		})
		it("Incorrect equation involving order of operations considerations", function() {
			chai.assert.isFalse(isCorrect("4+6/2=5"))
		})
	})
})


describe("logic.js :: isMissingMusthaves() test", function() {
	describe("Typical cases", function() {
		it("Not missing musthaves", function() {
			chai.assert.isFalse(isMissingMusthaves("1+2=3", "123"))
		})
		it("Missing musthaves", function() {
			chai.assert.isTrue(isMissingMusthaves("1+2=3", "124"))
		})
		it("Not missing including symbols", function() {
			chai.assert.isFalse(isMissingMusthaves("1+2=3", "123+="))
		})
		it("Missing musthaves including symbols", function() {
			chai.assert.isTrue(isMissingMusthaves("1+2=3", "123-="))
		})
	})
	
	describe("Unusual cases", function() {
		it("Empty list of musthaves", function() {
			chai.assert.isFalse(isMissingMusthaves("1*2*3", ""))
		})
		it("Empty equation", function() {
			chai.assert.isFalse(isMissingMusthaves("", ""))
		})
	})
})


describe("logic.js :: containsExclusions() test", function() {
	describe("Typical cases", function() {
		it("Does not contain exclusions", function() {
			chai.assert.isFalse(containsExclusions("1+2=3", "456"))
		})
		it("Contains exclusions", function() {
			chai.assert.isTrue(containsExclusions("1+2=3", "145"))
		})
		it("No exclusions including symbols", function() {
			chai.assert.isFalse(containsExclusions("1+2=3", "456-"))
		})
		it("Contains symbol exclusions", function() {
			chai.assert.isTrue(containsExclusions("1+2=3", "+"))
		})
	})
	
	describe("Unusual cases", function() {
		it("Empty list of exclusions", function() {
			chai.assert.isFalse(containsExclusions("1*2*3", ""))
		})
		it("Empty equation", function() {
			chai.assert.isFalse(containsExclusions("", ""))
		})
	})
})

describe("logic.js :: substituteFirstUnknown() test", function() {
	describe("Basic Tests", function() {
		it("Single Question Mark, No exclusions", function() {
			chai.assert.sameMembers(substituteFirstUnknown("?",""), SYMBOLS)
		})
		it("Single Question Mark, All excluded", function() {
			chai.assert.isEmpty(substituteFirstUnknown("?", SYMBOLS))
		})
		it("Single Question Mark, Some exclusions", function() {
			chai.assert.sameMembers(substituteFirstUnknown("?", "24567+-"), ["1","3","8","9","0","*","/","="])
		})
		it("Empty String", function() {
			chai.assert.isEmpty(substituteFirstUnknown("", ""))
		})
	})
	
	describe("Longer strings", function() {
		it("Second question mark not clobbered", function() {
			chai.assert.sameMembers(substituteFirstUnknown("??", "123789+-="), ["0?","4?","5?","6?","*?","/?"])
		})
		it("Question Mark and other symbols, all excluded", function() {
			chai.assert.isEmpty(substituteFirstUnknown("1?", SYMBOLS))
		})
		it("Question Mark and other symbols, some exclusions", function() {
			chai.assert.sameMembers(substituteFirstUnknown("1?", "345789*/="), ["10","11","12","16","1+","1-"])
		})
		it("Multiple question marks, all excluded", function() {
			chai.assert.isEmpty(substituteFirstUnknown("???", SYMBOLS))
		})
	})
})