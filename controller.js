/*	CONTROLLER.js
	Contains code to drive the GUI, primarily for responding to user interactions and calling the appropriate functions from logic.js
*/

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
	for (var c of SYMBOLS.concat(["?","Del"])) {
		var btn = document.createElement("button")
		btn.innerHTML = c
		btn.setAttribute("class", "query-control-button")
		btn.setAttribute("buttonValue", c)
		btn.onclick = queryControlButtonPressed;
		queryControlsDiv.appendChild(btn)
		
		if (c == "9") {
			queryControlsDiv.innerHTML += "<br>"
		}
	}
	
	for (var c of SYMBOLS.concat(["?"])) {
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
	// TODO: Implement function
}



/*	queryControlButtonPressed is fired when any of the input buttons to enter the equation are pressed
	This function adds a character to the query (or deletes the last input character, if "Del" is selected)
*/

function queryControlButtonPressed() {
	// TODO: Implement function
}


/*	conditionSelectorButtonPressed is fired when any of the buttons to set musthaves / excludes are pressed
	This function toggles the state of any number or operator between the three possible states: ["neutral", "exclude", "musthave"]
	CSS is also rotated for each state
*/
function conditionSelectorButtonPressed() {
	// TODO: Implement function
}