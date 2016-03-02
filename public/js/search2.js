'use strict';

$(document).ready(function(){
	initializeSearch();

	$('.create-buttons button[href="#search2"]').on('click', function(event) {                    
		$('#search').addClass('open');
		//$('#search > form > input[type="search"]').focus();
		$('#search-complete').focus();
	});

	/*
		hard to close
	*/
	$('#search, #search button.close').on('click keyup', function(event) {
		if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
			$(this).removeClass('open');
		}
	});

	/*
	$("#searchform").submit(function(e) {
		e.preventDefault();
		$("input#search-complete").val("");
		$('#search').removeClass('open');
	});*/

});

function initializeSearch(){
	var input = document.getElementById("search-complete");
	var awesomplete = new Awesomplete(input, {
			minChars: 1,
			maxItems: 6
		});


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
}

function test(){
	console.log("testing");
}