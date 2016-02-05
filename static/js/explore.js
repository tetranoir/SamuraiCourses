$(".alpha-search li a").click(function(e){
	e.preventDefault();
	var alphabet = $(this).attr("href");
	console.log(alphabet);
	var divPosition = $(alphabet).offset().top;
	console.log(divPosition);
	$("html body").animate({scrollTop: divPosition});
});