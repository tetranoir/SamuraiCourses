Samurai Courses

Troubleshoot:
1. make sure your vagrant has npm installed.

Note:
1. npm install has trouble with vagrant in windows.  something about the symlink error.
	I decided to copy the node_modules over, which seem to perform the same thing.
	This may lead to complication later on if we want to update our system, but
	should be fine for now.
2. app.js will also be copied over from lab6.

Todo:
1. Search and auto complete
2. Create sample json 
3. parse json

Partial fix:
<a href="{{previous_link}}">{{previous_link_name}}</a>

Testing JS:
		To test js using REPL, first vagrant up.
		Make sure you have npm installed on your vagrant.
		then type "node", this should start REPL.
		do .load public/js/create.js to load the file
