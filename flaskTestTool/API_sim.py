from flask import *
from flask_cors import CORS
from config import db
from models import recipe

apiSim = Flask(__name__)
CORS(apiSim)

apiSim.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
apiSim.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(apiSim)

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

@apiSim.route('/profile')
def profile():
    return render_template('profile.html')

@apiSim.route('/recipeDisplay')
def recipeDisplay():
    return render_template('recipeDisplay.html')

@apiSim.route('/createRecipe', methods=["GET", "POST"])
def create_recipe():
    if request.method == "POST":
        dish = request.json.get("dish")
        size = request.json.get("size")
        measure = request.json.get("measure")
        ingredient = request.json.get("ingredient")
        instruction = request.json.get("instruction")
    
        if not dish or size or measure or ingredient or instruction:
            return (
                jsonify({"message": "Must enter Dish Name, Size, Measure, Ingredient, and Instruction"}), 400,
            )
        
        new_recipe = recipe(dish=dish, size=size, measure=measure, ingredient=ingredient, instruction=instruction)
        try:
            db.session.add(new_recipe)
            db.session.commit()
        except Exception as e:
            return jsonify({"message": str(e)}), 400
    
        return jsonify({"message": "Recipe Created"}), 201
    
    return render_template('createRecipe.html')

@apiSim.route('/editRecipe')
def edit_recipe():
    return render_template('editRecipe.html')

if __name__ == '__main__':
    with apiSim.app_context():
        db.create_all()
    apiSim.run(debug=True)