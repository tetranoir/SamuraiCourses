'use strict';

// Call this function when the page loads (the "ready" event)
/*$(document).ready(function() {
	initializePage();
});

function initializePage() {
	
}*/

/*
	==== Class =========================
*/
var Class = function(data) {
	this.crsName = data.crsName;
	this.crsNum = data.crsNum;
	this.crsSub = data.crsSub;
	this.sections = []; // list of Sections
};

Class.prototype.addSection = function(section) {
	this.sections.push(section);
};

Class.prototype.arrangements = function() {
	var arranges = [];
	
	for(var i in sections) {
		if(sections[i].discussions == false) {
			sections[i].discussions.push({});
		}
		if(sections[i].labs == false) {
			sections[i].labs.push({});
		}
		for(var j in sections[i].discussions) {
			for(var k in sections[i].labs) {
				arranges.push({'section':sections[i],
								    'di':sections[i].discussions[j],
								   'lab':sections[i].labs[k]});
			}
		}
	}
	
	return arranges;
};
/*
	==== Section =======================
*/
var Section = function(data) {
	this.time = data.time; // lecture time
	this.fin = data.fin; // final time
	this.sectNum = data.sectNum;
	this.prof = data.prof;
	this.location = data.location; // location
	this.discussions = []; // list of Discussions
	this.labs = []; // list of Labs
};

Section.prototype.addDiscussion = function(discussion) {
	this.discussions.push(discussion);
};
	
Section.prototype.addLab(lab) {
	this.labs.push(lab);
};
/*
	==== Discussion ====================
*/
var Discussion = function(data) {
	this.time = data.time;
	this.location = data.location;
};
/*
	==== Lab ===========================
*/
var Lab = function(data) {
	this.time = data.time;
	this.location = data.location;
};
/*
	==== Location ======================
*/
var Location = function(data) {
	this.building = data.building;
	this.room = data.room;
}
/*
	==== Time ==========================
*/
var Time = function(data) {
	this.days = data.days; // list of strings, eg ["Tu", "Th"]
	this.start = data.start; // start time, eg 800 for 8:00am
	this.end = data.end; // end time, eg 1300 for 1:00pm
};
/*
	==== Schedule =================
*/
var Schedule = function() {
	this.M = []; // array of Times
	this.Tu = [];
	this.W = [];
	this.Th = [];
	this.F = [];
	//this.F = Array.apply(null, Array(48)).map(function() { return 0; });
	this.arrangement = []; // list of arrangements of {sect, di, lab} per class
}

Schedule.prototype.copy(toCopy) {
	this.M = toCopy.M.slice();
	this.Tu = toCopy.Tu.slice();
	this.W = toCopy.W.slice();
	this.Th = toCopy.Th.slice();
	this.F = toCopy.F.slice();
	this.arrangement = toCopy.arrangement.slice();
}

//Returns true or false depending on if the section fits with the schedule
Schedule.prototype.addArrange = function(arrangement) {
	var sect = arrangement.section.time;
	var di = arrangement.di.time;
	var lab = arrangement.lab.time;
	
	for(var day of sect.days) {
		if(!self.checkDay(day, sect))
			return false;
	}
	for(var day of di.days) {
		if(!self.checkDay(day, di))
			return false;
	}
	for(var day of lab.days) {
		if(!self.checkDay(day, lab))
			return false;
	}
	
	for(var day of sect.days) {
		self.addDay(day, sect);
	}
	for(var day of di.days) {
		self.addDay(day, di);
	}
	for(var day of lab.days) {
		self.addDay(day, lab);
	}
	self.arrangement.push(arrangement);
	
	return true;
};

Schedule.prototype.addDay(Day, time) {
	switch(day) {
		case "M":
			self.M.push(time);
			break;
		case "Tu":
			self.Tu.push(time);
			break;
		case "W":
			self.W.push(time);
		case "Th":
			self.Th.push(time);
		case "F":
			self.F.push(time);
			break;
		default:
			console.log(day + " is not a recognized day");
			break;
	}
}

Schedule.prototype.checkDay(day, time) {
	switch(day) {
		case "M":
			for(var t in self.M)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "Tu":
			for(var t in self.Tu)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "W":
			for(var t in self.W)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "Th":
			for(var t in self.Th)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "F":
			for(var t in self.F)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		default:
			console.log(day + " is not a recognized day");
			return false;
			break;
	}
	return true;
}

// i is the class number, s is the schedule
function backtracking(i, classes, s, solns) { 
	if(i == classes.length) {
		solns.push(s);
		return;
	}
	for(var arrange of classes[i]) {
		var newS = new Schedule();
		newS.copy(s);
		if(newS.addArrange(arrange)) {
			backtracking(i + 1, classes, newS, solns);
		}
	}
}

function generateSchedules(classes) { // class is a list of arrangements
	var s = new Schedule();
	var schedules = [];
	backtracking(0, classes, s, schedules);
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
