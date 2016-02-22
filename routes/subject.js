var subjects = require('../public/all_subs.json');

exports.view = function(req, res) {
	var subID = req.params.id; // gets from the url
	var subName = subjects[subID];
	res.render('subject', {'subject': subName}); // can pass in class data  here, once we get it 
}