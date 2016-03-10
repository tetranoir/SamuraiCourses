var courses = require('../public/all_courses.json');
// class decsription  json file goes here

exports.view = function(req, res) {
	var crs = req.params.course;

	res.render('course', courses[crs]);
};