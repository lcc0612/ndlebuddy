# N--dle Buddy

A web-based tool to help you enumerate possibilities (not solve!) a popular equation-based guessing game.

No dependencies, no web connectivity. All the magic happens in your browser.


## How to Use

Open ```main.html``` in the web browser of your choice.

Begin by entering the equation to guess at, using "?" symbols to represent symbols you don't know. Warning - Too many symbols could take a long time to guess, so try to fix a few things and work your way towards the answer!

You may also want to set some conditions under the **Select Conditions** heading - Click each number or operator to determine whether it should be excluded (highlighted black), or if it must appear in the answer (highlighted purple). Click again to return it to a neutral state (whether it appears or not doesn't matter).


## Unit Tests

Run ```tests.html``` in your browser to perform unit testing. This file fetches resources, namely [The Chai Assertion Library](https://www.chaijs.com/) and [Mocha](https://mochajs.org/) to facilitate unit testing.


## Version History

### Release Candidate 2
* Some optimizations added, up to 5 unknowns can be done in a reasonable amount of time on a modern system

### Release Candidate 1
* Search for possible answers given a partially-known equation
* Specify "excludes" and "musthaves"
* Program may not be optimized, searches with more than 4 unknowns are not recommended


## Future Work

* Priority System
  * Implement some way of discerning between whether certain outputs are good or bad, and present them in the order of most viable first
* Positioned Exclusions
  * Implement some mechanism to ignore eliminated possibilities for each digit
* Processing Complexity Estimation
  * To guide users as to how much time an operation might take to prevent browser lockups