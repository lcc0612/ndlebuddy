/*	CONTROLLER.js
	Contains code to drive the GUI, primarily for responding to user interactions and calling the appropriate functions from logic.js
*/

// Global variables representing HTML elements
var queryDiv
var queryControlsDiv
var exclusionsControlsDiv
var musthavesControlsDiv

// Global variables representing controller state
var query = ""

window.onload = function() {
	queryDiv = document.getElementById("queryDiv")
	queryControlsDiv = document.getElementById("queryControlsDiv")
	exclusionsControlsDiv = document.getElementById("exclusionsControlsDiv")
	musthavesControlsDiv = document.getElementById("musthavesControlsDiv")
	
	buildGUI()
}

/*	buildGUI creates and places repetitive elements into the HTML
*/
function buildGUI() {
	
}