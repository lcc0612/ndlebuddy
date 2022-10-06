# N--dle Buddy

A web-based tool to help you enumerate possibilities (not solve!) a popular equation-based guessing game.

No dependencies, no web connectivity (except for the unit tests). All the magic happens in your browser.

This project is mostly built for fun, though I have since created a video to discuss some software engineering techniques that were applied here, generally aimed at beginners or those new to programming and software engineering in general. Check it out if you're interested!

https://www.youtube.com/watch?v=OYs8CpVcuo0


## How to Use

Download the contents of this repository by clicking on Code -> Download ZIP, then extract the zip file. (Alternatively, clone this repository onto your disk.)

Open ```main.html``` in the web browser of your choice.

Begin by entering the equation to guess at, using "?" symbols to represent symbols you don't know. Warning - Too many symbols could take a long time to guess, so try to fix a few things and work your way towards the answer!

You may also want to set some conditions under the **Select Conditions** heading - Click each number or operator to determine whether it should be excluded (highlighted black), or if it must appear in the answer (highlighted purple). Click again to return it to a neutral state (whether it appears or not doesn't matter).


## Unit Tests

Run ```tests.html``` in your browser to perform unit testing. This file fetches resources, namely [The Chai Assertion Library](https://www.chaijs.com/) and [Mocha](https://mochajs.org/) to facilitate unit testing. These packages are fetched from https://unpkg.com/.


## Version History

### Release Candidate 3
* Final version as shown in the video. Now has a priority system to rank the value of the guesses given.

### Release Candidate 2
* Some optimizations added, up to 5 unknowns can be done in a reasonable amount of time on a modern system

### Release Candidate 1
* Search for possible answers given a partially-known equation
* Specify "excludes" and "musthaves"
* Program may not be optimized, searches with more than 4 unknowns are not recommended


## Not Yet Implemented

The following features have not been implemented in this project, but would be good to have!

* Positioned Exclusions
  * Implement some mechanism to ignore eliminated possibilities for each digit
* Processing Complexity Estimation
  * To guide users as to how much time an operation might take to prevent browser lockups