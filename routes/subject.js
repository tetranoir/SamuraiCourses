var subjects = require('../public/all_subs.json');
var courses = require('../public/all_courses.json');
// class decsription  json file goes here

exports.view = function(req, res) {
	var subID = req.params.id; // gets from the url
	var subName = subjects[subID];


	//search json file for class description
	res.render('subject', {'subject': subName, courses}); // can pass in class data  here, once we get it
	// 							^ 'dscription': valu	
};