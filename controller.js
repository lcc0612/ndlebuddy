/*	CONTROLLER.js
	Contains code to drive the GUI, primarily for responding to user interactions and calling the appropriate functions from logic.js
*/

const PRIORITY_DESCRIPTOR_STRINGS = {}
PRIORITY_DESCRIPTOR_STRINGS[PRIORITY_OPENING] = "Good Candidates for Openings"
PRIORITY_DESCRIPTOR_STRINGS[PRIORITY_STANDARD] = "Good Overall Candidates"
PRIORITY_DESCRIPTOR_STRINGS[PRIORITY_WEIRD] = "Weirder Candidates"

// Global variables representing HTML elements
var queryDiv
var queryControlsDiv
var conditionSelectorsDiv
var resultDiv

// Global variables representing controller state
var query = ""
var conditions = {}

window.onload = function() {
	// Get references to relevant divs from HTML
	queryDiv = document.getElementById("queryDiv")
	queryControlsDiv = document.getElementById("queryControlsDiv")
	conditionSelectorsDiv = document.getElementById("conditionSelectorsDiv")
	resultDiv = document.getElementById("resultDiv")
	
	// Setup GUI
	buildGUI()
	
	// Prepare state variables
	for (var c of SYMBOLS) {
		conditions[c] = "neutral";
	}
}

/*	buildGUI creates and places repetitive elements into the HTML
	Custom attributes are populated for many of the buttons here:
		- buttonValue is the number / operator represented by the button
*/
function buildGUI() {
	// The SYMBOLS variable is populated in logic.js
	for (var c of SYMBOLS.concat(["?","Del","Clear"])) {
		var btn = document.createElement("button")
		btn.innerHTML = c
		btn.setAttribute("class", "query-control-button")
		btn.setAttribute("buttonValue", c)
		btn.onclick = queryControlButtonPressed
		queryControlsDiv.appendChild(btn)
		
		if (c == "0") {
			queryControlsDiv.appendChild(document.createElement("br"))
		}
	}
	
	for (var c of SYMBOLS) {
		var btn = document.createElement("button")
		btn.innerHTML = c
		btn.setAttribute("class", "condition-selector-button")
		btn.setAttribute("buttonValue", c)
		btn.onclick = conditionSelectorButtonPressed
		conditionSelectorsDiv.appendChild(btn)
	}
}

/*	guess is triggered by a button press on the GUI
	It retrieves all required information, calls the relevant functions from logic.js, and presents the answer
*/
function guess() {
	var excludes = []
	var musthaves = []
	
	for (var c in conditions) {
		if (conditions[c] == "exclude") {
			excludes.push(c)
		}
		if (conditions[c] == "musthave") {
			musthaves.push(c)
		}
	}
	
	var isFixed = []
	for (var c of query) {
		isFixed.push(c != "?")
	}
	
	var answers = generatePossibilities(query, excludes, musthaves)
	resultDiv.innerHTML = ""
	
	for (var priority of PRIORITY_ENUM) {
		var segment = answers[priority]
		if (segment.length == 0) continue
		
		var heading = document.createElement("h2")
		heading.innerHTML = PRIORITY_DESCRIPTOR_STRINGS[priority]
		resultDiv.appendChild(heading)
		
		var table = document.createElement("table")
		for (var i=0; i<segment.length; i+=4) {
			var row = document.createElement("tr")
			for (var j=i; j<i+4 && j<segment.length; j+=1) {
				var cell = document.createElement("td")
				for (var k=0; k<segment[j].length; k+=1) {
					var c = segment[j][k]
					var charSpan = document.createElement("span")
					charSpan.innerHTML = c
					if (isFixed[k]) {
						charSpan.setAttribute("class", "output-lozenge output-lozenge-fixed")
					}
					else {
						if (musthaves.includes(c)) {
							charSpan.setAttribute("class", "output-lozenge output-lozenge-musthave")
						}
						else {
							charSpan.setAttribute("class", "output-lozenge")
						}
					}
					cell.appendChild(charSpan)
				}
				row.appendChild(cell)
			}
			table.appendChild(row)
		}
		resultDiv.append(table)
	}
	
}



/*	queryControlButtonPressed is fired when any of the input buttons to enter the equation are pressed
	This function adds a character to the query (or deletes the last input character, if "Del" is selected)
*/

function queryControlButtonPressed() {
	var value = this.getAttribute("buttonValue")
	if (value != "Del" && value != "Clear") {
		query += value
	}
	else if (value == "Del") {
		if (query.length > 0) {
			query = query.substring(0, query.length-1)
		}
	}
	else if (value == "Clear") {
		query = ""
	}
	redrawQueryDiv()
}


/*	redrawQueryDiv fills the lozenges into the query div based on the query variable
*/
function redrawQueryDiv() {
	queryDiv.innerHTML = ""
	for (var c of query) {
		var lozenge = document.createElement("div")
		lozenge.innerHTML = c
		lozenge.setAttribute("class", "guess-lozenge")
		
		queryDiv.appendChild(lozenge)
	}
}


/*	conditionSelectorButtonPressed is fired when any of the buttons to set musthaves / excludes are pressed
	This function toggles the state of any number or operator between the three possible states: ["neutral", "exclude", "musthave"]
	CSS is also rotated for each state
*/
function conditionSelectorButtonPressed() {
	var value = this.getAttribute("buttonValue")
	if (conditions[value] == "neutral") {
		conditions[value] = "exclude"
		this.setAttribute("class", "condition-selector-button condition-exclude")
	}
	else if (conditions[value] == "exclude") {
		conditions[value] = "musthave"
		this.setAttribute("class", "condition-selector-button condition-musthave")
	}
	else if (conditions[value] == "musthave") {
		conditions[value] = "neutral"
		this.setAttribute("class", "condition-selector-button")
	}
}