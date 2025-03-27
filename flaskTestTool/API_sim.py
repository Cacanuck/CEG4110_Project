from flask import *
from flask_cors import CORS
from config import db
from models import Recipe, newUser, Ingredient, Instruction
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

@apiSim.route('/home')
def home():
    return render_template('home.html')

@apiSim.route('/index', methods=['GET', 'POST'])
def indexAlt():
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({'message': 'No data provided'}), 400
            
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({'message': 'Please enter both email and password'}), 400
            
            # Find user by email
            user = newUser.query.filter_by(email=email).first()
            
            if user and user.password == password:
                # Return user data without password
                user_data = {
                    'id': user.id,
                    'firstName': user.firstName,
                    'lastName': user.lastName,
                    'email': user.email
                }
                return jsonify(user_data), 200
            else:
                return jsonify({'message': 'Invalid email or password'}), 401
                
        except Exception as e:
            print(f"Login error: {str(e)}")
            return jsonify({'message': 'Error processing login request'}), 500
            
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
    try:
        # Check if user is logged in by looking for userData in session storage
        return render_template('profile.html')
    except Exception as e:
        print(f"Profile route error: {str(e)}")
        return redirect(url_for('index'))

@apiSim.route('/recipeDisplay', methods=['GET'])
def recipeDisplay():
    recipes = Recipe.query.all()
    
    recipe_list = []
    for recipe in recipes:
        recipe_data = {
            'dish': recipe.dish,
            'ingredients': [{'size': ingredient.size, 'measure': ingredient.measure, 'ingredient': ingredient.ingredient} for ingredient in recipe.ingredients],
            'instrucitons': [instruction.step for instruction in recipe.instructions]
        }
        recipe_list.append(recipe_data)
        
    return jsonify(recipe_list)
    # return render_template('recipeDisplay.html')

@apiSim.route('/createRecipe')
def create_recipe():
    
    return render_template('createRecipe.html')

@apiSim.route('/submitRecipe', methods=["POST"])
def submit_recipe():
    recipe_data = request.get_json()
    new_recipe = Recipe(dish=recipe_data['dish'])
    
    for ingredient_data in recipe_data['ingredients']:
        ingredient = Ingredient(
            size=ingredient_data['size'],
            measure=ingredient_data['measure'],
            ingredient=ingredient_data['ingredient'],
        )
        db.session.add(ingredient)
        
    for step in recipe_data['instructions']:
        instruction = Instruction(step=step, recipe=new_recipe)
        db.session.add(instruction)
        
    db.session.add(new_recipe)
    db.session.commit()
    
    return jsonify({'message': 'Recipe Saved'}), 201

@apiSim.route('/getRecipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    recipe_list = []
    for recipe in recipes:
        recipe_data = {
            'id': recipe.id,
            'dish': recipe.dish,
            'ingredients': [{'size': i.size, 'measure': i.measure, 'ingredient': i.ingredient} for i in recipe.ingredients],
            'instructions': [j.step for j in recipe.instructions],
        }
        recipe_list.append(recipe_data)
    return jsonify(recipe_list)

@apiSim.route('/editRecipe')
def edit_recipe():
    return render_template('editRecipe.html')

@apiSim.route('/deleteRecipe/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if recipe:
        db.session.delete(recipe)
        db.session.commit()
        return '', 204
    return jsonify({"message": "Recipe not found"}), 404

if __name__ == '__main__':
    with apiSim.app_context():
        db.create_all()
    apiSim.run(debug=True)