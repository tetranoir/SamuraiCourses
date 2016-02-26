'use strict';

$(document).ready(function(){
	initializePage();
	$('button[href="#search"]').on('click', function(event) {                    
		$('#search').addClass('open');
		$('#search > form > input[type="search"]').focus();		
	});

	$('#search, #search button.close').on('click keyup', function(event) {
		if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
			$(this).removeClass('open');
		}
	});	
});

function initializePage(){
	var input = $("#search-complete");
	var awesomplete = new Awesomplete(input);
	/* ...more code... */

	awesomplete.list = ["Ada", "Java", "JavaScript", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"];
}