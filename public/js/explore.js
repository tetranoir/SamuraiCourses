'use strict';

$(document).ready(function() {
	initializePage();

	$('.class-container .CSE').removeClass("not-active");
});

function initializePage() {
	$(".alpha-search li a").click(function(e){
		e.preventDefault();
		var alphabet = $(this).attr("href");
		console.log(alphabet);
		var divPosition = $(alphabet).offset().top - 30;
		console.log(divPosition);
		$("html, body").animate({
			scrollTop: divPosition
		}, 500);
		$(alphabet).effect("highlight", {}, 1200);
	});
}

