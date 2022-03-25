describe("Integration :: generatePossibilities() Test", function() {
	describe("No exclusions and musthaves", function() {
		it("One question mark, one possibility", function() {
			chai.assert.sameMembers(generatePossibilities("?=1"), ["1=1"])
		})
		it("Add to ten", function() {
			chai.assert.sameMembers(generatePossibilities("?+?=10"), ['1+9=10', '2+8=10', '3+7=10', '4+6=10', '5+5=10', '6+4=10', '7+3=10', '8+2=10', '9+1=10'])
		})
		it("Stripping of Excess Zeros", function() {
			chai.assert.sameMembers(generatePossibilities("00?*?=0?"), ['000*0=00', '000*1=00', '000*2=00', '000*3=00', '000*4=00', '000*5=00', '000*6=00', '000*7=00', '000*8=00', '000*9=00', '001*0=00', '001*1=01', '001*2=02', '001*3=03', '001*4=04', '001*5=05', '001*6=06', '001*7=07', '001*8=08', '001*9=09', '002*0=00', '002*1=02', '002*2=04', '002*3=06', '002*4=08', '003*0=00', '003*1=03', '003*2=06', '003*3=09', '004*0=00', '004*1=04', '004*2=08', '005*0=00', '005*1=05', '006*0=00', '006*1=06', '007*0=00', '007*1=07', '008*0=00', '008*1=08', '009*0=00', '009*1=09'])
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
			chai.assert.sameMembers(generatePossibilities("???=10", "234-*/"), ['5+5=10', '1+9=10', '9+1=10', '+10=10', '010=10'])
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
	
	describe("Shortcut Solving", function() {
		it("No exclusions", function() {
			chai.assert.sameMembers(generatePossibilities("2*?=?"), ['2*0=0', '2*1=2', '2*2=4', '2*3=6', '2*4=8'])
		})
		it("Shortcut solved solutions eliminated due to exclusions", function() {
			chai.assert.sameMembers(generatePossibilities("2*?=?", "46"), ['2*0=0', '2*1=2'])
		})
	})
	
	describe("Hybrid", function() {
		it("Shortcut solving and zero strip", function() {
			chai.assert.sameMembers(generatePossibilities("002+0??=??"), ['002+000=02', '002+001=03', '002+002=04', '002+003=05', '002+004=06', '002+005=07', '002+006=08', '002+007=09', '002+008=10', '002+009=11', '002+018=20', '002+019=21', '002+028=30', '002+029=31', '002+038=40', '002+039=41', '002+048=50', '002+049=51', '002+058=60', '002+059=61', '002+068=70', '002+069=71', '002+078=80', '002+079=81', '002+080=82', '002+081=83', '002+082=84', '002+083=85', '002+084=86', '002+085=87', '002+086=88', '002+087=89', '002+088=90', '002+089=91', '002+090=92', '002+091=93', '002+092=94', '002+093=95', '002+094=96', '002+095=97', '002+096=98', '002+097=99', '002+0+0=02', '002+0+1=03', '002+0+2=04', '002+0+3=05', '002+0+4=06', '002+0+5=07', '002+0+6=08', '002+0+7=09', '002+0+8=10', '002+0+9=11', '002+0-0=02', '002+0-1=01', '002+0-2=00', '002+0-3=-1', '002+0-4=-2', '002+0-5=-3', '002+0-6=-4', '002+0-7=-5', '002+0-8=-6', '002+0-9=-7', '002+0*0=02', '002+0*1=02', '002+0*2=02', '002+0*3=02', '002+0*4=02', '002+0*5=02', '002+0*6=02', '002+0*7=02', '002+0*8=02', '002+0*9=02', '002+0/1=02', '002+0/2=02', '002+0/3=02', '002+0/4=02', '002+0/5=02', '002+0/6=02', '002+0/7=02', '002+0/8=02', '002+0/9=02'])
		})
	})
})

describe("Integration :: Speed Tests", function() {
	it("4 question marks, 3 exclusions, 1 musthaves", function() {
		chai.assert.sameMembers(generatePossibilities("9??=??", "+-0", "2"), ['9*2=18', '9*3=27', '9*8=72'])
	})
	it("5 question marks, no exclusions, 1 musthaves", function() {
		chai.assert.lengthOf(generatePossibilities("?????", "", "="), 337)
	})
	it("5 question marks, 4 exclusions, 2 musthaves", function() {
		chai.assert.sameMembers(generatePossibilities("?????", "0123", "+="), ['4+4=8', '4+5=9', '5+4=9'])
	})
})