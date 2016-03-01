'use strict';

$(document).ready(function(){
	initializePage();
	/*
	$('button[href="#search"]').on('click', function(event) {                    
		$('#search').addClass('open');
		$('#search > form > input[type="search"]').focus();		
	});

	$('#search, #search button.close').on('click keyup', function(event) {
		if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
			$(this).removeClass('open');
		}
	});	
	*/

	$('button[href="#search"]').on('click', function(event) {
		let text = $("input#search-complete").val();
		console.log(text);
	});	

});

function initializePage(){
	
	var input = document.getElementById("search-complete");
	var awesomplete = new Awesomplete(input, {
			minChars: 1,
			maxItems: 6
		});
	/* ...more code... */
	
	var courseURL = "/search/courses";
	var courseList = [];

	$.get(courseURL, function(course){
		
		for( let s in course )
		{
			courseList.push(s);
		}
		//console.log(courseList);
		awesomplete.list = courseList;
	});
	//console.log(courseList);
	//["Ada", "Java", "JavaScript", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"];
	
}

/*
function addSearchList(course){
	console.log(course);
	let subjectList = course.all_subjects;
	let courseList = [];
	for( let s of subjectList )
	{
		courseList.push(s['name']);
	}
}*/