'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

function initializePage() {
	
}
/*
Note: 	To run this code using REPL, first vagrant up.
		Make sure you have npm installed on your vagrant.
		then type "node", this should start REPL.
		do .load public/js/create.js to load the file

*/


/*
Name: class Class

Description: Class is the parent class of section. When we parse JSON,
	we will be creating sections instead.
	Why?  There could be two sections for the same course, such as CSE 3.
	The combination of their LE time and DI time should not overlapped
	with each other.

*/

class Class{

	/*
		crsNum(int)		: course number
		crsName(string)	: course name
		LE = Lecture	DI = Discussion
		LA = Lab		FI = Final
		LEtime, DItime, LAtime, FItime: array of instances of Timeinfo
	*/
	constructor(crsNum, crsName, LEtime, DItime,
		LAtime, FItime){
		this.crsNum = crsNum;
		this.crsName = crsName;
		this.LEtime = LEtime;
		this.DItime = DItime;
		this.LAtime = LAtime;
		this.FItime = FItime;
	}

	/*
	Function Name: addTime

	Description: Add the instance of time to the correct array.

	Input:
		category(string): 	the identifier of the time as LE, DI,
							LA, or FI.
		time(instance of Timeinfo): read Timeinfo class

	Ouput: nothing
	*/
	addTime(category, time){
		switch (category){
			case "LE":
				if(this.LEtime[0] == "")
					this.LEtime[0] = time;
				else
					this.LEtime.push(time);
				break;
			case "DI":
				if(this.DItime[0] == "")
					this.DItime[0] = time;
				else
					this.DItime.push(time);
				break;
			case "LA":
				if(this.LAtime[0] == "")
					this.LAtime[0] = time;
				else
					this.LAtime.push(time);
				break;
			case "FI":
				if(this.FItime[0] == "")
					this.FItime[0] = time;
				else
					this.FItime.push(time);
				break;
			default:
				console.log("Unidentified category.");
				break;
		}
	}

	/*
	Function Name: 	possibleTime

	Description: 	Get combinations of the time.
					Doesn't check for time conflict as there shouldnt be any

	Output: 		Returns array of possible time given the LE, DI, and LA.

					EX: if there are 2 LE, 4 DI
					it returns array of 8 different combinations
					of LE + DI.  

	*/
	possibleTime(){
		let timeList = [];

		for( let le of this.LEtime ){
			for( let di of this.DItime ){
				for( let la of this.LAtime){
					timeList.push([le, di, la]);
				}
			}
		}
		return timeList;
	}
}

/*
Name: class Class

Description: 	child class of Class.  
				When parsing json, we want to instantiate
				with this class.  Can call functcions of 
				parent class.

				Two extra params are added:
				section and instructor.

*/
class Section extends Class{
	constructor(crsNum, crsName, LEtime, DItime,
		LAtime, FItime, section, instructor){

		super(crsNum, crsName, LEtime, DItime,
		LAtime, FItime);
		this.section = section;
		this.instructor = instructor;
	}

}


/*
Name: Timeinfo

Description: 	Keep track of the time for a LE, DI, LA, or FI.

*/
class Timeinfo{
	/* 
		days(string[]): the weekdays, ["Tu", "TH"]
		startTime(int): the start time
		endTime(int): 	the end time
			note:start time and end time should be converted
			into int.  0 - 2400
			ex: 10:30am = 1030
		room(string): 	ex: CENTER
		roomNum(int): 	ex: 212

	*/
	constructor(days, startTime, endTime, room, roomNum){
		this.days = days;
		this.startTime = startTime;
		this.endTime = endTime;
		this.room = room;
		this.roomNum = roomNum;
	}
}


/*
	Check if the new time would have conflict with
	the existing schedule

	Input: 	current(array of array of Timeinfo):
				the current schedule.

			add(array of array of Timeinfo):
				the time to be added.

	need to check the emptiness of the LE, DI, LA

	Output: True if conflict
			False if not
*/
function checkConflicts( current, add ){	
	/* 	add only has one element, and that is the array
		of timeinfo */

	let addTimeInfo = add[0];

	console.log("Checking Conflicts");

	for( let time of addTimeInfo ){ // the timeinfo of class we are checking
		for( let curr of current ){ // the timeinfo array 
			for( let currTime of curr ){ // the timeinfo of curr schedule
				if( currTime != "" && time != "" ){ // only can access element if they are not ""
					/*
					console.log("Printing currTime and time");
					console.log(currTime);
					console.log(time);
					console.log("Printing start and end time");
					console.log(time.startTime);
					console.log(time.endTime);
					console.log("Printing Days");
					console.log(time.days);
					*/
					
					if ( time.startTime < currTime.endTime 
						&& time.startTime > currTime.startTime){
						for( let addDay of time.days ){
							for( let currDay of currTime.days ){
									if( addDay == currDay ){
										return true;
								}
							}
						}
					}
				}
			}
		}
	}

	return false;
}


/*
Function Name: 	allSchedule

Description: 	checks for class conflict, create a combination
				of non-conflict schedule

Input: 			classes: an array of class
				class: array of non-conflict time from all the sections
					EX: if cse 8 has 2 sections, then class cse8 
						would be cse8firstsection.allpossibletime() 
						append with cse8secondsection.allpossibletime()

Output: 		array of possible time,

				EX: 
				LE1, DI1, LE2, DI2.1 are instances of Timeinfo
				array[0] would be an array of all possible courses
					without time conflict.
				[ [ [LE1, DI1], [LE2, DI2.1] ], 
				  [ [LE1, DI1], [LE2, DI2.2] ] ]


*/
function allSchedule( classes ){
	let schedules = [""];
	let tempSched = [];

	/* 	c = array of non-conflict time
		from all the sections
	*/

	for( let c of classes ){
		for( let time of c ){
			if( schedules[0] == "" )
				tempSched.push([time]);
			else{
				for( let s of schedules ){
					/* check for time conflict */
					if( checkConflicts(s, [time]) == false ){
						let timeArray = s.concat([time]);
						tempSched.push(timeArray);
					}
				}
			}
		}
		schedules = tempSched;
		tempSched = [];
	}

	if( schedules.length == 0){
		console.log("schedule conflict");
	}

	/* 	need to check if the result is the correct schedule.
	*/
	/* TO BE WRITTEN*/

	return schedules;
}


/* TEST DATA */
let time1 = new Timeinfo(["T", "TH"], 1000, 1200, "CENTER", "105");
/* conflict*/
let time2 = new Timeinfo(["T", "TH"], 1100, 1300, "CENTER", "105");
let class1 = new Class("100", "CSE", [""], [""], [""], [""]);
let class2 = new Class("100", "CSE", [""], [""], [""], [""]);
class1.addTime("LE", time1);
class2.addTime("DI", time2);
class1.possibleTime();
let classes = [];
classes.push(class1.possibleTime());
classes.push(class2.possibleTime());
let schedules = allSchedule(classes);