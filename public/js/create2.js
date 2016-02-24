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
	this.name = data.name;
	this.num = data.num;
	this.sub = data.sub;
	this.sections = []; // list of Sections
};

Class.prototype.addSection = function(section) {
	this.sections.push(section);
};

Class.prototype.arrangements = function() {
	var arranges = [];
	var sections = this.sections;
	
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
	
Section.prototype.addLab = function(lab) {
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
	this.days = data.days || []; // list of strings, eg ["Tu", "Th"]
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

Schedule.prototype.copy = function(toCopy) {
	this.M = toCopy.M.slice();
	this.Tu = toCopy.Tu.slice();
	this.W = toCopy.W.slice();
	this.Th = toCopy.Th.slice();
	this.F = toCopy.F.slice();
	this.arrangement = toCopy.arrangement.slice();
}

Schedule.prototype.checkDay = function(day, time) {
	switch(day) {
		case "M":
			for(var t of this.M)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "Tu":
			for(var t of this.Tu)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "W":
			for(var t of this.W)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "Th":
			for(var t of this.Th)
				if(time.end > t.start && time.start < t.end)
					return false;
			break;
		case "F":
			for(var t of this.F)
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

//Returns true or false depending on if the section fits with the schedule
Schedule.prototype.addArrange = function(arrangement) {
	var sect = arrangement.section.time;
	var di = arrangement.di.time || new Time({});
	var lab = arrangement.lab.time || new Time({});
	
	for(var day of sect.days) {
		if(!this.checkDay(day, sect))
			return false;
	}
	for(var day of di.days) {
		if(!this.checkDay(day, di))
			return false;
	}
	for(var day of lab.days) {
		if(!this.checkDay(day, lab))
			return false;
	}
	
	for(var day of sect.days) {
		this.addDay(day, sect);
	}
	for(var day of di.days) {
		this.addDay(day, di);
	}
	for(var day of lab.days) {
		this.addDay(day, lab);
	}
	this.arrangement.push(arrangement);
	
	return true;
};

Schedule.prototype.addDay = function(day, time) {
	switch(day) {
		case "M":
			this.M.push(time);
			break;
		case "Tu":
			this.Tu.push(time);
			break;
		case "W":
			this.W.push(time);
			break;
		case "Th":
			this.Th.push(time);
			break;
		case "F":
			this.F.push(time);
			break;
		default:
			console.log(day + " is not a recognized day");
			break;
	}
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

function generateSchedules(classesArranges) { // list of arrangements
	var s = new Schedule();
	var schedules = [];
	backtracking(0, classesArranges, s, schedules);
	return schedules;
}

/* TEST DATA */
var t1 = new Time({'days':['M', 'W', 'F'], 'start':900, 'end':1000});
var t2 = new Time({'days':['M', 'W', 'F'], 'start':1030, 'end':1130});	  
var class1 = new Class({'name':'Algs', 'sub':'CSE', 'num':'100'});
var class2 = new Class({'name':'Ops', 'sub':'CSE', 'num':'120'});
var sect1 = new Section({'time':t1});
var sect2 = new Section({'time':t2});
class1.addSection(sect1);
class2.addSection(sect2);
var arrange1 = class1.arrangements();
var arrange2 = class2.arrangements();

var start = Date.now();
for(var i = 0; i < 10000; i++) {
	var s = generateSchedules([arrange1, arrange2]);
}
var runtime = Date.now() - start;
console.log(s);
console.log(runtime);

