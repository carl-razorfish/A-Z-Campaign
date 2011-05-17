# A to Z Campaign

# Notices

* April 2011: Carl Hendrickse added fork to git@github.com:carl-razorfish/A-Z-Campaign.git

# ANT Build Instructions

1. Within the PROJECT_ROOT/src/ant/properties/project.properties file, update the "project.dir" value to point to your project folder location on your machine
2. Using command line or Eclipse ANT plugin, run the main ANT build task from the PROJECT_ROOT/src/ant/build.xml build file
3. Should any ANT build errors occur, please see project lead
4. Otherwise the resulting minified CSS and JavaScript production files will be placed in PROJECT_ROOT/css and PROJECT_ROOT/js respectively 

# GAE Rollback Command

http://code.google.com/appengine/docs/python/tools/uploadinganapp.html

In case of any deployment errors, use this rollback command on the root directory of the project:

