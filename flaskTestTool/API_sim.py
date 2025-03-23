from flask import *
from flask_cors import CORS
from config import db
from models import recipe, newUser
import hashlib
import sqlite3

apiSim = Flask(__name__)
CORS(apiSim)

apiSim.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
apiSim.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(apiSim)


# Create tables with proper schema
def init_db():
    with apiSim.app_context():
        # Drop existing tables if they exist and create new tables
        db.drop_all()
        db.create_all()
# Initialize database on startup
init_db()


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

@apiSim.route('/signUp', methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        print("Received POST request to /signUp")
        try:
            # Get the raw data and print it for debugging
            raw_data = request.get_data(as_text=True)
            print("Raw request data:", raw_data)
            
            # Check content type header
            content_type = request.headers.get('Content-Type')
            print("Content-Type:", content_type)
            
            if not content_type or 'application/json' not in content_type:
                return jsonify({'message': 'Content-Type must be application/json'}), 400
            
            # Parse JSON data
            data = request.get_json(force=True)  # force=True will try to parse even if the content-type is wrong
            print("Parsed JSON data:", data)
            
            if not data:
                return jsonify({'message': 'No data provided'}), 400
            
            # Validate fields
            required_fields = ['firstName', 'lastName', 'email', 'password']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400
            
            # Check if email exists
            existing_user = newUser.query.filter_by(email=data['email']).first()
            if existing_user:
                return jsonify({'message': 'Email already registered'}), 400
            
            # Create new user
            new_user = newUser(
                firstName=data['firstName'],
                lastName=data['lastName'],
                email=data['email'],
                password=data['password']
            )
            
            # Save to DB
            try:
                db.session.add(new_user)
                db.session.commit()
                print("Successfully created new user:", new_user.to_json())
                return jsonify({'message': 'Account created successfully'}), 201
            except Exception as e:
                db.session.rollback()
                print(f"Database error: {str(e)}")
                return jsonify({'message': f'Database error: {str(e)}'}), 500
                
        except Exception as e:
            print(f"Request error: {str(e)}")
            return jsonify({'message': f'Error processing request: {str(e)}'}), 400
            
    return render_template('signUp.html')

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