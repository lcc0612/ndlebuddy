describe("Logic.js Tests", function() {
	
	describe("isValid() Test", function() {
		
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
	
})