from flask import *
from flask_cors import CORS

apiSim = Flask(__name__)
CORS(apiSim)

#Variables and Structs
ingredients = ['Carrots', 'Celery', 'Milk']
ingredientsJson = {
    "ingredients": ingredients
}



#end Variables and Structs

### Pantry Page backend calls
@apiSim.post('/pantry/addItem')
def addItem():
    newItem = request.get_json()
    print(newItem)
    ingredients.append(newItem['ingredient'])
    print(ingredients)
    return ingredientsJson


@apiSim.get('/pantry/getItems')
def getItems():
    ingredientsJson = {
        "ingredients": ingredients
    }
    return ingredientsJson

@apiSim.route('/pantry/deleteItem', methods=['POST, GET'])
def deleteItem():
    return 'deletedItem'
### End Pantry Calls

@apiSim.route('/')
def index():
    return render_template('index.html')

@apiSim.route('/index')
def indexAlt():
    return render_template('index.html')

@apiSim.route('/shoppingCart')
def shoppingCart():
    return render_template('shoppingCart.html')

@apiSim.route('/pantry')
def pantry():
    return render_template('pantry.html')

@apiSim.route('/recipeDisplay')
def recipeDisplay():
    return render_template('recipeDisplay.html')

@apiSim.route('/profile')
def profile():
    return render_template('profile.html')

# Create and Edit Recipe still error

if __name__ == '__main__':
    apiSim.run(debug=True)