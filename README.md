Samurai Courses

Troubleshoot:
1. make sure your vagrant has npm installed.

Note:
1. npm install has trouble with vagrant in windows.  something about the symlink error.
	I decided to copy the node_modules over, which seem to perform the same thing.
	This may lead to complication later on if we want to update our system, but
	should be fine for now.
2. app.js will also be copied over from lab6.

Plan:
1. Once the server is moved to heroku, need to convert
html to handlebar.
2. Find a way to implement our navbar
3. 

use this 
<a href="{{previous_link}}">{{previous_link_name}}</a>