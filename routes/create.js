var courses = require('../public/all_subs.json');

exports.view = function(req, res){
	res.render('create');
};

exports.courseInfo = function(req, res) {
  	res.json(courses);
}