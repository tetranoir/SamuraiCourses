'use strict';
/*
TODO
Considerations: have section, discussion, and lab inherit from time so .time can be used to access the time of any of them 

add paging functionality for each schedule number, i

json file format + data

search

delete

*/

var s = []; // schedules
var classes = []; // classes
var courseURL = "/search/courses";
var courseList = {};
var PAGECAP = 20;
var loadDate;
var firstTime = true;
var activeClass = {};

$(document).ready(function() {
	initializePage();
	loadDate = new Date();

	$(".alert").on('click', function(event) {
		$(this).slideUp("normal", function() {
			$(this).hide();
		});
	});

	$("#searchform").submit(function(e) {
		e.preventDefault();
		addToCalendar(e);
		$("input#search-complete").val("");
		$('#search').removeClass('open');
	});

	$('button[href="#search"]').on('click', addToCalendar);
});

function initializePage() {
	let course1;
	let course2;
	let course3;
	$.get(courseURL, function(course){
		courseList = course;
		course1 = courseList["CSE100"];
		course2 = courseList["CSE120"];
		course3 = courseList["CSE123"];
		classes.push(new Class(course1));
		classes.push(new Class(course2));
		classes.push(new Class(course3));
		// generation
		var arrangeList = getArrangements(classes);
		var newS = generateSchedules(arrangeList);
		s = newS;
		createPages(s.length);
		createCalendar(s[0],0);
	});

	createCalendarTable(800, 2200); // start end
	
	/* TEST DATA */
	/*var class1 = new Class({'name':'Algs', 'sub':'CSE', 'num':'101'});
	var t1 = new Time({'days':['M', 'Tu', 'W', 'Th', 'F'], 'start':1600, 'end':1700});
	var sect1 = new Section({'time':t1});
	var t1_d1 = new Time({'days':['F'], 'start':1430, 'end':1530});
	var disc1 = new Discussion({'time':t1_d1});
	class1.addSection(sect1);
	sect1.addDiscussion(disc1);

	var class2 = new Class({'name':'Ops', 'sub':'CSE', 'num':'120'});
	var t2 = new Time({'days':['M', 'W'], 'start':900, 'end':1030});
	var sect2 = new Section({'time':t2});
	var t2_l2 = new Time({'days':['Tu', 'Th'], 'start':1030, 'end':1230});
	var lab2 = new Lab({'time':t2_l2});
	class2.addSection(sect2);
	sect2.addLab(lab2);

	var class3 = new Class({'name':'Ai', 'sub':'CSE', 'num':'150'});
	var t3 = new Time({'days':['M', 'W'], 'start':1100, 'end':1200});
	var sect3 = new Section({'time':t3});
	class3.addSection(sect3);
	
	classes.push(class1);
	classes.push(class2);
	classes.push(class3);

	var arrange1 = class1.arrangements();
	var arrange2 = class2.arrangements();
	var arrange3 = class3.arrangements();

	var start = Date.now();
	s = generateSchedules([arrange1, arrange2, arrange3]);
	var runtime = Date.now() - start;
	
	console.log(s);
	console.log(runtime);
	
	console.log('calendaring ' + s.length);
	createPages(s.length);
	createCalendar(s[0], 0);
	*/
};

/*
	==== Class =========================
*/
var Class = function(data) {
	this.name = data.name;
	this.num = data.num;
	this.sub = data.sub;
	this.description = data.description;
	this.sections = []; // list of Sections
	if(data.sections) {
		for(s of data.sections) {
			this.sections.push(new Section(s));
		}
	}
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
				arranges.push({'self':this,
							'section':sections[i],
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
	this.self = 'LE';
	this.time = data.time; // lecture time
	this.fin = data.fin; // final time
	this.sectNum = data.sectNum;
	this.prof = data.prof;
	this.location = data.location; // location
	this.discussions = data.discussions || new Array(); // list of Discussions
	this.labs = data.labs || new Array(); // list of Labs
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
	this.self = 'DI';
	this.time = data.time;
	this.location = data.location;
};
/*
	==== Lab ===========================
*/
var Lab = function(data) {
	this.self = 'LA';
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
	this.days = data.days || new Array(); // list of strings, eg ["Tu", "Th"]
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

function createCalendarTable(start, end) { // only generate on the hour
	if(start % 100 != 0) {
		start = start - (start % 100);
	}
	if(end % 100 != 0) {
		end = end + (end % 100);
	}
	
	var numOfCells = (end - start) / 100;
	
	for(var i = 0; i < numOfCells; i++) {
		var timeStr = i + 8;
		var pad = '';
		var am_pm = 'a';
		if(timeStr >= 12)
			am_pm = 'p';
		if(timeStr > 12)
			timeStr -= 12;
		if(timeStr < 10)
			pad = '0';
		
		var timeStrA = pad + timeStr.toString() + ':00' + am_pm;
		var timeStrB = pad + timeStr.toString() + ':30' + am_pm;

		var newACell = '<div class="row half-hour-cell-a"><div class="col-xs-3"><text>' + timeStrA + '</text></div></div>';
		var newBCell = '<div class="row half-hour-cell-b"><div class="col-xs-3"><text>' + timeStrB + '</text></div></div>';
		
		$('.daily-timecells').append($(newACell), $(newBCell));
	}
}

function randColor() { }
randColor.pick = function() {
	if(randColor.colors.length == 0) {
		console.log("No colors left!!!");
		return '#FFFFFF';
	}
	
	/*var i = Math.floor((Math.random() * randColor.colors.length));
	var picked = randColor.colors[i];
	randColor.colors.splice(i, 1);
	return picked;*/
	return randColor.colors.pop();
}

function createPages(n) { // creates n schedulenav tabs
	$(".schedule").remove();
	$(".schedule-pages").find(".nav").append('<li class="schedule active"><a data-toggle="tab" href=' + 1 + '>' + 1 + '</a></li>');
	for(var i=1; i<n && i<PAGECAP; i++) {
		$(".schedule-pages").find(".nav").append('<li class="schedule"><a data-toggle="tab" href=' + (i+1) + '>' + (i+1) + '</a></li>');
	}

	$(".schedule").on('click', function(event) {
		var active = $(".schedule-pages").find(".active a").attr("href");
		var clicked = $(this).find("a").attr("href");
		console.log("active " + active);
		console.log("clicked " + clicked);
		if(clicked == active)
			return;
		clicked -= 1;
		createCalendar(s[clicked], clicked);
	});
}

function cleanCalendar() {
	$(".class-box").remove();
}

function createCalendar(s, i) { // schedule, schedule number (eg which schedule)
	randColor.colors = ['#FFFE90','#A5F5A5','#A5A5F5','#F5A5A5','#A5F5F5']; // sets colors
	cleanCalendar();
	console.log("create calendar " + i);
	for(var aClass of s.arrangement) { // aClass is: the class (self), a section, a di, and a lab
		var color = randColor.pick();
		console.log(color);
		for(var part in aClass) { // part is section, discussion, or lab
			if(!aClass[part].time) continue; // so so shoddy
			aClass[part].time.start = parseInt(aClass[part].time.start);
			aClass[part].time.end = parseInt(aClass[part].time.end);
			if(aClass[part].time.end % 100 != 0) {
				aClass[part].time.end += 50 - (aClass[part].time.end % 100);
			}
			if(aClass[part].time.start % 100 != 0) {
				aClass[part].time.start += 50 - (aClass[part].time.start % 100);
			}

			var height = (aClass[part].time.end - aClass[part].time.start) / 100 * 60 ; // in px
			var top = (aClass[part].time.start - 800) / 100 * 60; // in px
			var descrip = aClass.self.sub + aClass.self.num + ' ' + aClass[part].self;
			var id = aClass.self.sub + aClass.self.num + ' ' + aClass['section'].sectionNum;
			
			var classBlock = '<a href="#" data-toggle="modal" data-target="#class-info">' +
							'<div class="col-xs-offset-4 col-xs-6 class-box" id="' + id + '" style="height:' + height.toString() + 'px; background-color:' + color + '; top:' + top.toString() + 'px;">' +
							'<p class="class-info">' + descrip + '</p></div></a>'
							
			for(var day of aClass[part].time.days) {
				var dayId = "monday";
				switch(day) {
					case "M":
						dayId = "monday";
						break;
					case "Tu":
						dayId = "tuesday";
						break;
					case "W":
						dayId = "wednesday";
						break;
					case "Th":
						dayId = "thursday";
						break;
					case "F":
						dayId = "friday";
						break;
					default:
						console.log(day + " is not a recognized day");
						break;
				}
				$('#' + dayId).find('.row').append($(classBlock));
			}
		}
	}

	$(".class-box").on('click', function(event) {
		console.log($("#class-info").find(".modal-title").html());
		var id = $(this).attr("id").split(' '); // [class id, section num]
		var cl = {}
		for(var c of classes) { // look for class id in classes in calendar
			if((c.sub + c.num) === id[0]) {
				cl = c;
			}
		}
		activeClass = cl;
		var sect = {}
		for(var sec of cl.sections) { // look for sec num in class
			if(sec.sectionNum === id[1]) {
				sect = sec;
			}
		}
		$("#class-info").find(".modal-title").html(cl.name);
		$("#class-info").find(".modal-body").html(cl.description + "<br>Location: " + sec.location);
		$("#class-info").find(".modal-footer p").html(sec.prof);
	});

	$("#remove-class").on('click', function(event) {
		classes.splice(classes.indexOf(activeClass), 1);
		activeClass = {};
		var arrangeList = getArrangements(classes);
		var newS = generateSchedules(arrangeList);
		// create calendar
		s = newS;
		createPages(s.length);
		createCalendar(s[0],0);
	});
}

function createAllCalendars(s) {
	for(var i in s) {	
		console.log('button calendaring');
		createCalendar(s[i], i);
	}
}

function getArrangements(classes) {
	var arrangeList = [];
	for(var c of classes) {
		arrangeList.push(c.arrangements());
	}
	return arrangeList;
}


function addToCalendar(event){
	// google analytics
	ga("send", "event", "search", "addClass");
	if(firstTime){
		var now = new Date();
		var elapsed = now - loadDate;
		ga('send', 'timing', 'search', 'elapsed', elapsed);
		firstTime = false;
	}

	let text = $("input#search-complete").val();// "CSE 100"
	text = text.toUpperCase();
	text = text.replace(/\s/g, '');
	for(var c of classes) { // check if class has already been added
		if((c.sub + c.num) === text) {
			$(".alert").slideUp(0, function() {
				$("#already-added-error").show();
			});
			console.log(text + ' has already been added');
			return;
		}
	}
	// get class object
	let subjectCourse = courseList[text];
	if(!subjectCourse) {
		$(".alert").slideUp(0, function() {
			$("#not-found-error").show();
		});
		console.log('class ' + text + ' not found');
		return;
	}
	var addedClass = new Class(subjectCourse);
	classes.push(addedClass);
	// generation
	var start = Date.now();
	var arrangeList = getArrangements(classes);
	var newS = generateSchedules(arrangeList);
	var runtime = Date.now() - start;
	console.log("generation time: "+ runtime + "ms");
	// check for error
	if(newS.length == 0) {
		classes.splice(classes.indexOf(addedClass), 1);
		$(".alert").slideUp(0, function() {
			$("#no-schedule-error").show();
		});
		console.log("no-schedule-error");
		return;
	}
	// create calendar
	s = newS;
	createPages(s.length);
	createCalendar(s[0],0);
	// no errors
	$(".alert").slideUp("normal");
}
