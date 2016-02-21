//var projects = require('../projects.json');

/*
 * GET home page.
 */

exports.view = function(req, res){
	res.render('index'); // finds 'views/index.handlebars'
}; // set to "views" in app.js