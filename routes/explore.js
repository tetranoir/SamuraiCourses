var subjects = require('../public/all_subs.json');

exports.view = function(req, res){
	res.render('explore', subjects);
};