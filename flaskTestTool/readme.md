# Flask API Test Tool

## Purpose
The purpose of the tool is to be able to quickly and easily create an endpoint that you can POST to locally and test that your javascript is handling it correctly.  Python's Flask tool seems to be the right tool for the job as it allows you to quickly set up local endpoints via the '''apiSim.route()''' methods that then run the function specified below them.  You can also use arrays or dicts to store data during tests and make specific data payloads to send back without too much trouble.  


## Installation
### Python
Make sure that you have the latest version of Python installed.

### Flask
Run '''pip install Flask''' in a terminal to install Flask.  I have not tested this with windows powershell or anything with Apple.  I used VSCode's terminal window and that seemed to work for me.

### Setting Up the Flask Environment Locally
***NOTE:*** I have only tested this on Windows so these steps were required.  For Linux or Mac you may not need these steps.

First, in the VSCode (or other dev environment that has a terminal) run these two commands:
'''set FLASK_APP=API_sim.py'''
'''set FLASK_ENV=development'''

Second, run the Flask app in either your editor or in terminal via '''flask run'''

This will start the Flask app running locally at 127.0.0.1:5000 so then your javascript can point at that to work with it.  It will run until you kill it with ctl+c or in the task manager.

### Adding Endpoints
To make new endpoints for your pages just add a new '''apiSim.route("/yourpage/actionEndpoint", methods=["POST", "GET", "OPTIONS"])''' and then put the function that you want to execute below that.
