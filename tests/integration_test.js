describe("Integration :: generatePossibilities() Test", function() {
	describe("No exclusions and musthaves", function() {
		it("One question mark, one possibility", function() {
			chai.assert.sameMembers(generatePossibilities("?=1"), ["1=1"])
		})
		it("Add to ten", function() {
			chai.assert.sameMembers(generatePossibilities("?+?=10"), ['1+9=10', '2+8=10', '3+7=10', '4+6=10', '5+5=10', '6+4=10', '7+3=10', '8+2=10', '9+1=10'])
		})
	})
	
	describe("Exclusions only", function() {
		it("Impossible exclusions provide empty result", function() {
			chai.assert.isEmpty(generatePossibilities("?+?=3", "3"))
		})
		it("Add to ten, with exclusions", function() {
			chai.assert.sameMembers(generatePossibilities("?+?=10", "234"), ['5+5=10', '1+9=10', '9+1=10'])
		})
		it("Add to ten, but exclusions imply addition", function() {
			chai.assert.sameMembers(generatePossibilities("???=10", "234-*/"), ['5+5=10', '1+9=10', '9+1=10', '+10=10'])
		})
	})
	
	describe("Musthaves only", function() {
		it("Impossible musthaves provide empty result", function() {
			chai.assert.isEmpty(generatePossibilities("?+?=3", "", "7"))
		})
		it("Add to ten, forcing digits", function() {
			chai.assert.sameMembers(generatePossibilities("?+?=10", "", "12"), ["2+8=10", "8+2=10"])
		})
		it("Add to ten, but musthaves imply addition", function() {
			chai.assert.sameMembers(generatePossibilities("???=10", "", "12+"), ["2+8=10", "8+2=10"])
		})
	})
	
	describe("Exclusions and Musthaves", function() {
		it("Slightly bigger test", function() {
			chai.assert.sameMembers(generatePossibilities("???=?", "01+-", "*"), ['2*2=4', '2*3=6', '2*4=8', '3*2=6', '3*3=9', '4*2=8'])
		})
	})
})