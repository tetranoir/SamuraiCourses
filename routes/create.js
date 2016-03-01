//var courses = require('../public/all_courses.json');

exports.view = function(req, res){
	res.render('create');
};


exports.view2 = function(req, res){
	res.render('create2');
};


exports.courseInfo = function(req, res) {
  	res.json(courses);
}