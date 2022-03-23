# N--dle Buddy

A web-based tool to help you enumerate possibilities (not solve!) a popular equation-based guessing game.

No dependencies, no web connectivity. All the magic happens in your browser.


## How to Use

Open ```main.html``` in the web browser of your choice.

Begin by entering the equation to guess at, using "?" symbols to represent symbols you don't know. Warning - Too many symbols could take a long time to guess, so try to fix a few things and work your way towards the answer!

You may also want to set some conditions under the **Select Conditions** heading - Click each number or operator to determine whether it should be excluded (highlighted black), or if it must appear in the answer (highlighted purple). Click again to return it to a neutral state (whether it appears or not doesn't matter).


## Unit Tests

Run ```tests.html``` in your browser to perform unit testing. This file fetches resources, namely [The Chai Assertion Library](https://www.chaijs.com/) and [Mocha](https://mochajs.org/) to facilitate unit testing.