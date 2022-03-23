describe("logic.js :: hasIllegalCharacters() Test", function() {
	describe("Valid tests", function() {
		it("Statement with only allowed symbols", function() {
			chai.assert.isFalse(hasIllegalCharacters("1+2+3+4"))
		})
		it("Statement with question marks", function() {
			chai.assert.isFalse(hasIllegalCharacters("1+2??+4"))
		})
		it("Statement with equals sign", function() {
			chai.assert.isFalse(hasIllegalCharacters("1+2??=99"))
		})
	})
	
	describe("Invalid tests", function() {
		it("Statement with one invalid character", function() {
			chai.assert.isTrue(hasIllegalCharacters("1+2!?=99"))
		})
		it("Statement with multiple invalid characters", function() {
			chai.assert.isTrue(hasIllegalCharacters("3#$$))+2!?=99"))
		})
	})	
})

describe("logic.js :: isValid() Test", function() {
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
		it("A single ? symbol is valid", function() {
			chai.assert.isTrue(isValid("?"))
		})
		it("A single digit is valid", function() {
			chai.assert.isTrue(isValid("2"))
		})
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
		it("Leading zeros should not be interpreted as octal", function() {
			chai.assert.isFalse(isCorrect("033=27"))
		})
		it("Unaries should not give wrong answers", function() {
			chai.assert.isFalse(isCorrect("0*+17=17"))
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

describe("logic.js :: stripLeadingZeros() test", function() {
	describe("Basic Tests", function() {
		it("No zeros to strip - Output should be identical", function() {
			chai.assert.equal(stripLeadingZeros("1+2=3"), "1+2=3")
		})
		it("No zeros to strip and no equals sign", function() {
			chai.assert.equal(stripLeadingZeros("1+2"), "1+2")
		})
		it("No equals sign", function() {
			chai.assert.equal(stripLeadingZeros("1+01"), "1+1")
		})
		it("Only trailing zeros", function() {
			chai.assert.equal(stripLeadingZeros("100000"), 100000)
		})
		it("Strip one zero", function() {
			chai.assert.equal(stripLeadingZeros("09"), "9")
		})
		it("Strip multiple zeros", function() {
			chai.assert.equal(stripLeadingZeros("00008"), "8")
		})
		it("Strip multiple zeros with ignoring trailing zeros", function() {
			chai.assert.equal(stripLeadingZeros("00099900"), "99900")
		})
		it("Test with many signs", function() {
			chai.assert.equal(stripLeadingZeros("01-02*03/04"), "1-2*3/4")
		})
	})
	
	describe("Full Equations", function() {
		it("Strip zeros everywhere", function() {
			chai.assert.equal(stripLeadingZeros("03+07=010"), "3+7=10")
		})
		it("Strip excessive zeros everywhere", function() {
			chai.assert.equal(stripLeadingZeros("00009*0000010=00000000090"), "9*10=90")
		})
	})
	
	describe("Edge Cases", function() {
		it("A single zero should not get stripped out", function() {
			chai.assert.equal(stripLeadingZeros("0"), "0")
		})
		it("Single zeros should not get stripped out in an equation", function() {
			chai.assert.equal(stripLeadingZeros("0*14=0"), "0*14=0")
		})
		it("If there are multiple zeros, keep only one", function() {
			chai.assert.equal(stripLeadingZeros("000*1=00000"), "0*1=0")
		})
		it("Unary / Paired up operators should not get stripped out", function() {
			chai.assert.equal(stripLeadingZeros("03+04=-7"), "3+4=-7")
		})
	})
})

describe("logic.js :: validForShortcutSolve() test", function() {
	describe("Valid Cases", function() {
		it("Simple", function() {
			chai.assert.isTrue(validForShortcutSolve("2+3=?"))
		})
		it("Non ? signs are now accepted on the right", function() {
			chai.assert.isTrue(validForShortcutSolve("8*3=?4"))
		})
	})
	
	describe("Invalid Cases", function() {
		it("Breaks rule 1 - Multiple equals signs", function() {
			chai.assert.isFalse(validForShortcutSolve("2+3==?"))
		})
		it("Breaks rule 1 - No equals signs", function() {
			chai.assert.isFalse(validForShortcutSolve("2+3"))
		})
		it("Breaks rule 2 - There are ? signs on the left", function() {
			chai.assert.isFalse(validForShortcutSolve("2+?=?"))
		})
		it("Breaks rules 2 & 3", function() {
			chai.assert.isFalse(validForShortcutSolve("2*5+?=1?"))
		})
	})
})

describe("logic.js :: shortcutSolve() test", function() {
	describe("Valid Tests", function() {
		it("Basic valid answer", function() {
			chai.assert.equal(shortcutSolve("1+1=?"), "1+1=2")
		})
		it("Valid answer with right-side partially filled in", function() {
			chai.assert.equal(shortcutSolve("8*3=?4"), "8*3=24")
		})
	})
	
	describe("Failure Cases", function() {
		it("Answer too long for right-hand-side", function() {
			chai.assert.throws(function() {shortcutSolve("5*8=?")})
		})
		it("Equation on left doesn't compute", function() {
			chai.assert.throws(function() {shortcutSolve("abc=?")})
		})
		it("Invalid answer because the right-side doesn't match the answer", function() {
			chai.assert.throws(function() {shortcutSolve("8*3=?0")})
		})
	})
	
	describe("Edge Cases", function() {
		it("Decimal results are handled properly without enough space", function() {
			chai.assert.throws(function() {shortcutSolve("5/2=?")})
		})
		it("Decimal results are still handled properly even with enough space", function() {
			chai.assert.throws(function() {shortcutSolve("5/2=???")})
		})
		it("Divisions are still fine despite rounding", function() {
			chai.assert.equal(shortcutSolve("4/2=?"), "4/2=2")
		})
	})
})

describe("logic.js :: cannotAttainMusthaves() test", function() {
	describe("No lookahead necessary", function() {
		it("Not missing musthaves", function() {
			chai.assert.isFalse(cannotAttainMusthaves("1+2=3", "123"))
		})
		it("Missing musthaves", function() {
			chai.assert.isTrue(cannotAttainMusthaves("1+2=3", "124"))
		})
		it("Not missing including symbols", function() {
			chai.assert.isFalse(cannotAttainMusthaves("1+2=3", "123+="))
		})
		it("Missing musthaves including symbols", function() {
			chai.assert.isTrue(cannotAttainMusthaves("1+2=3", "123-="))
		})
		it("Empty list of musthaves", function() {
			chai.assert.isFalse(cannotAttainMusthaves("1*2*3", ""))
		})
		it("Empty equation", function() {
			chai.assert.isFalse(cannotAttainMusthaves("", ""))
		})
	})
	
	describe("Simple Test", function() {
		it("No musthaves and no question marks", function() {
			chai.assert.isFalse(cannotAttainMusthaves("1",""))
		})
		it("No musthaves and one question mark", function() {
			chai.assert.isFalse(cannotAttainMusthaves("?",""))
		})
		it("One musthave already met, no question marks", function() {
			chai.assert.isFalse(cannotAttainMusthaves("1","1"))
		})
		it("One question mark only", function() {
			chai.assert.isFalse(cannotAttainMusthaves("?","1"))
		})
		it("One musthave that cannot be met, no question marks", function() {
			chai.assert.isTrue(cannotAttainMusthaves("1","2"))
		})
	})
	
	describe("Longer Tests", function() {
		it("Just enough question marks", function() {
			chai.assert.isFalse(cannotAttainMusthaves("???","123"))
		})
		it("Too many question marks", function() {
			chai.assert.isFalse(cannotAttainMusthaves("?????","123"))
		})
		it("Not enough question marks", function() {
			chai.assert.isTrue(cannotAttainMusthaves("??","123"))
		})
		it("Not enough question marks, but constants partially fulfil", function() {
			chai.assert.isFalse(cannotAttainMusthaves("??1","123"))
		})
		it("Not enough question marks, and constants do not help", function() {
			chai.assert.isTrue(cannotAttainMusthaves("??5","123"))
		})
	})
})