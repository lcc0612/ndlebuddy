describe("util.js :: strCount() Test", function() {
	
	describe("Expected 0", function() {
		it("Empty Haystack", function() {
			chai.assert.equal(strCount("", "?"), 0)
		})
		it("Empty Needle", function() {
			chai.assert.equal(strCount("123", ""), 0)
		})
		it("No matches", function() {
			chai.assert.equal(strCount("1+2+3=04", "?"), 0)
		})
	})
	
	describe("Basic Tests", function() {
		it("Find one match amidst non-matching", function() {
			chai.assert.equal(strCount("321232", "1"), 1)
		})
		it("Distinguish between matches and non-matches", function() {
			chai.assert.equal(strCount("11??1?1", "?"), 3)
		})
	})
	
	describe("Longer Substrings", function() {
		it("Unique Characters in Substring", function() {
			chai.assert.equal(strCount("121212", "12"), 3)
		})
		it("Unique Characters amidst non-matching in haystack", function() {
			chai.assert.equal(strCount("123212321", "12"), 2)
		})
		it("Duplicate Characters in Substring", function() {
			chai.assert.equal(strCount("????????", "??"), 4)
		})
	})
	
})
