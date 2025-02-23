from flask import *

apiSim = Flask(__name__)

#Variables and Structs
ingredients = []



#end Variables and Structs


@apiSim.route('/pantry/addItem', methods=['POST, GET, OPTIONS'])
def addItem():
    if request.method == 'POST':
        try:
            if request.is_json():
                newItem = request.json
        except:
            print("whatsGoingOnHere?")

        
    

@apiSim.route('/pantry/deleteItem', methods=['POST, GET'])
def deleteItem():
    return 'deletedItem'


if __name__ == '__main__':
    apiSim.run()