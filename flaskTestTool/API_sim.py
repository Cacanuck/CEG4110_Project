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
        # Create tables if they don't exist
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
    try:
        # Get user_id from request headers or query parameters
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Query recipes for specific user
        recipes = Recipe.query.filter_by(user_id=user_id).all()
        
        recipe_list = []
        for recipe in recipes:
            recipe_data = {
                'id': recipe.id,
                'dish': recipe.dish,
                'ingredients': [{'size': ingredient.size, 'measure': ingredient.measure, 'ingredient': ingredient.ingredient} for ingredient in recipe.ingredients],
                'instructions': [instruction.instruction for instruction in recipe.instructions]
            }
            recipe_list.append(recipe_data)
            
        return jsonify(recipe_list)
    except Exception as e:
        print(f"Error fetching recipes: {str(e)}")
        return jsonify({'message': 'Error fetching recipes'}), 500

@apiSim.route('/createRecipe')
def create_recipe():
    
    return render_template('createRecipe.html')

@apiSim.route('/submitRecipe', methods=["POST"])
def submit_recipe():
    try:
        print("Received recipe submission request")
        recipe_data = request.get_json()
        print("Recipe data received:", recipe_data)
        
        if not recipe_data:
            print("No recipe data provided")
            return jsonify({'message': 'No recipe data provided'}), 400
            
        # Get user_id from request headers or data
        user_id = request.headers.get('User-Id') or recipe_data.get('user_id')
        print("User ID:", user_id)
        
        if not user_id:
            print("No user ID provided")
            return jsonify({'message': 'User ID is required'}), 401
            
        # Verify user exists
        user = newUser.query.get(user_id)
        if not user:
            print(f"User not found with ID: {user_id}")
            return jsonify({'message': 'User not found'}), 404
            
        print(f"Found user: {user.firstName} {user.lastName}")
            
        # Create new recipe with user_id
        new_recipe = Recipe(
            dish=recipe_data['dish'],
            user_id=user_id
        )
        print("Created new recipe object:", new_recipe.to_json())
        
        db.session.add(new_recipe)
        db.session.flush()  # Get the recipe ID without committing
        print(f"Recipe added to session with ID: {new_recipe.id}")
        
        # Add ingredients
        for ingredient_data in recipe_data['ingredients']:
            ingredient = Ingredient(
                recipe_id=new_recipe.id,
                size=ingredient_data['size'],
                measure=ingredient_data['measure'],
                ingredient=ingredient_data['ingredient']
            )
            db.session.add(ingredient)
            print(f"Added ingredient: {ingredient.to_json()}")
        
        # Add instructions
        for step in recipe_data['instructions']:
            instruction = Instruction(
                recipe_id=new_recipe.id,
                instruction=step
            )
            db.session.add(instruction)
            print(f"Added instruction: {instruction.to_json()}")
        
        # Commit changes
        try:
            db.session.commit()
            print("Successfully committed changes to database")
            return jsonify({
                'message': 'Recipe saved successfully', 
                'recipe_id': new_recipe.id,
                'recipe': new_recipe.to_json()
            }), 201
        except Exception as commit_error:
            print(f"Error during commit: {str(commit_error)}")
            db.session.rollback()
            raise commit_error
        
    except Exception as e:
        print(f"Error saving recipe: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Error saving recipe: {str(e)}'}), 500

@apiSim.route('/getRecipes', methods=['GET'])
def get_recipes():
    try:
        # Get user_id from request headers or query parameters
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Query recipes for specific user
        recipes = Recipe.query.filter_by(user_id=user_id).all()
        recipe_list = []
        for recipe in recipes:
            recipe_data = {
                'id': recipe.id,
                'dish': recipe.dish,
                'ingredients': [{'size': i.size, 'measure': i.measure, 'ingredient': i.ingredient} for i in recipe.ingredients],
                'instructions': [j.instruction for j in recipe.instructions],
            }
            recipe_list.append(recipe_data)
        return jsonify(recipe_list)
    except Exception as e:
        print(f"Error fetching recipes: {str(e)}")
        return jsonify({'message': 'Error fetching recipes'}), 500

@apiSim.route('/editRecipe')
def edit_recipe():
    return render_template('editRecipe.html')

@apiSim.route('/deleteRecipe/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    try:
        # Get user_id from request headers
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Find recipe and verify ownership
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"message": "Recipe not found"}), 404
            
        if recipe.user_id != int(user_id):
            return jsonify({"message": "Unauthorized to delete this recipe"}), 403
            
        db.session.delete(recipe)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting recipe: {str(e)}")
        return jsonify({'message': 'Error deleting recipe'}), 500

if __name__ == '__main__':
    with apiSim.app_context():
        db.create_all()
    apiSim.run(debug=True)