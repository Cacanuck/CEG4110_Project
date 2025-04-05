from flask import *
from flask_cors import CORS
from config import db
from models import Recipe, newUser, Ingredient, Instruction, ShoppingCart, CartItem
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

@apiSim.route('/recipeDisplay')
def recipe_display():
    return render_template('recipeDisplay.html')

@apiSim.route('/createRecipe')
def create_recipe():
    return render_template('createRecipe.html')

@apiSim.route('/submitRecipe', methods=["POST"])
def submit_recipe():
    try:
        recipe_data = request.get_json()
        
        if not recipe_data:
            return jsonify({'message': 'No recipe data provided'}), 400
            
        # Get user_id from request headers or data
        user_id = request.headers.get('User-Id') or recipe_data.get('user_id')
        
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Verify user exists
        user = newUser.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Create new recipe with user_id
        new_recipe = Recipe(
            dish=recipe_data['dish'],
            user_id=user_id
        )
        
        db.session.add(new_recipe)
        db.session.flush()  # Get the recipe ID without committing
        
        # Add ingredients
        for ingredient_data in recipe_data['ingredients']:
            ingredient = Ingredient(
                recipe_id=new_recipe.id,
                size=ingredient_data['size'],
                measure=ingredient_data['measure'],
                ingredient=ingredient_data['ingredient']
            )
            db.session.add(ingredient)
        
        # Add instructions
        instructions = []
        for step in recipe_data['instructions']:
            instruction = Instruction(
                recipe_id=new_recipe.id,
                instruction=step
            )
            db.session.add(instruction)
            instructions.append(instruction.instruction)
        
        # Commit changes
        try:
            db.session.commit()
            return jsonify({
                'message': 'Recipe saved successfully', 
                'recipe_id': new_recipe.id,
                'recipe': {
                    'dish': new_recipe.dish,
                    'ingredients': recipe_data['ingredients'],
                    'instructions': instructions}
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
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        recipes = Recipe.query.filter_by(user_id=user_id).all()
        return jsonify([recipe.to_json() for recipe in recipes])
    except Exception as e:
        print(f"Error fetching recipes: {str(e)}")
        return jsonify({'message': 'Error fetching recipes'}), 500

@apiSim.route('/editRecipe')
def edit_recipe_page():
    return render_template('editRecipe.html')

@apiSim.route('/deleteRecipe/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    try:
        # Get user_id from request headers
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Find recipe and verify ownership
        recipe = db.session.get(Recipe, recipe_id)
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
    
@apiSim.route('/editRecipe/<int:recipe_id>', methods=['GET'])
def load_edit_recipe_(recipe_id):
    try:
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
        
        recipe = db.session.get(Recipe, recipe_id)
        if not recipe:
            return jsonify({'message': 'Recipe not found'}), 404
        
        if recipe.user_id != int(user_id):
            return jsonify({'message': 'Unauthorized to view this recipe'}), 403

        return jsonify(recipe.to_json())
    except Exception as e:
        print(f"Error fetching recipe: {str(e)}")
        return jsonify({'message': 'Error fetching recipe'}), 500
    
@apiSim.route('/updateRecipe/<int:recipe_id>', methods=["PUT"])
def update_recipe(recipe_id):
    try:
        recipe_data = request.get_json()
        
        if not recipe_data:
            return jsonify({'message': 'No recipe data provided'}), 400
            
        # Get user_id from request headers or data
        user_id = request.headers.get('User-Id') or recipe_data.get('user_id')
        
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Verify user exists
        user = newUser.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({'message': 'Recipe not found'}), 404
        
        recipe.dish = recipe_data.get('dish', recipe.dish)
        Ingredient.query.filter_by(recipe_id=recipe.id).delete()
        Instruction.query.filter_by(recipe_id=recipe.id).delete()
        
        # Add ingredients
        for ingredient_data in recipe_data.get('ingredients', []):
            ingredient = Ingredient(
                recipe_id=recipe.id,
                size=ingredient_data['size'],
                measure=ingredient_data['measure'],
                ingredient=ingredient_data['ingredient']
            )
            db.session.add(ingredient)
        
        # Add instructions
        for step in recipe_data.get('instructions', []):
            instruction = Instruction(
                recipe_id=recipe.id,
                instruction=step
            )
            db.session.add(instruction)
        
        # Commit changes
        try:
            db.session.commit()
            return jsonify({
                'message': 'Recipe saved successfully', 
                'recipe_id': recipe.id,
                'recipe': {
                    'dish': recipe.dish,
                    'ingredients': recipe_data['ingredients'],
                    'instructions': recipe_data['instructions']}
            }), 201
        except Exception as commit_error:
            print(f"Error during commit: {str(commit_error)}")
            db.session.rollback()
            raise commit_error
        
    except Exception as e:
        print(f"Error saving recipe: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Error saving recipe: {str(e)}'}), 500

@apiSim.route('/api/carts', methods=['GET'])
def get_user_carts():
    try:
        # Get user_id from request headers
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Query carts for specific user
        carts = ShoppingCart.query.filter_by(user_id=user_id).all()
        return jsonify([cart.to_json() for cart in carts])
    except Exception as e:
        print(f"Error fetching carts: {str(e)}")
        return jsonify({'message': 'Error fetching carts'}), 500

@apiSim.route('/api/carts', methods=['POST'])
def create_cart():
    try:
        # Get user_id from request headers
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Get cart data from request body
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        # Create new cart
        new_cart = ShoppingCart(
            user_id=user_id,
            title=data['title']
        )
        
        # Add items to cart
        for item_data in data['items']:
            cart_item = CartItem(
                name=item_data['name'],
                quantity=item_data['quantity'],
                unit=item_data['unit'],
                category=item_data['category']
            )
            new_cart.items.append(cart_item)
        
        db.session.add(new_cart)
        db.session.commit()
        
        return jsonify(new_cart.to_json()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating cart: {str(e)}")
        return jsonify({'message': 'Error creating cart'}), 500

@apiSim.route('/api/carts/<int:cart_id>', methods=['PUT'])
def update_cart(cart_id):
    try:
        # Get user_id from request headers
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Find cart and verify ownership
        cart = ShoppingCart.query.get(cart_id)
        if not cart:
            return jsonify({'message': 'Cart not found'}), 404
            
        if cart.user_id != int(user_id):
            return jsonify({'message': 'Unauthorized to update this cart'}), 403
            
        # Get updated data
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        # Update cart title
        cart.title = data['title']
        
        # Clear existing items
        CartItem.query.filter_by(cart_id=cart_id).delete()
        
        # Add new items
        for item_data in data['items']:
            cart_item = CartItem(
                cart_id=cart_id,
                name=item_data['name'],
                quantity=item_data['quantity'],
                unit=item_data['unit'],
                category=item_data['category']
            )
            db.session.add(cart_item)
        
        db.session.commit()
        return jsonify(cart.to_json())
    except Exception as e:
        db.session.rollback()
        print(f"Error updating cart: {str(e)}")
        return jsonify({'message': 'Error updating cart'}), 500

@apiSim.route('/api/carts/<int:cart_id>', methods=['DELETE'])
def delete_cart(cart_id):
    try:
        # Get user_id from request headers
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Find cart and verify ownership
        cart = ShoppingCart.query.get(cart_id)
        if not cart:
            return jsonify({'message': 'Cart not found'}), 404
            
        if cart.user_id != int(user_id):
            return jsonify({'message': 'Unauthorized to delete this cart'}), 403
            
        # Delete all cart items first
        CartItem.query.filter_by(cart_id=cart_id).delete()
        
        # Then delete the cart
        db.session.delete(cart)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting cart: {str(e)}")
        return jsonify({'message': 'Error deleting cart'}), 500

@apiSim.route('/api/carts/<int:cart_id>', methods=['GET'])
def get_cart(cart_id):
    try:
        # Get user_id from request headers
        user_id = request.headers.get('User-Id')
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 401
            
        # Find cart and verify ownership
        cart = ShoppingCart.query.get(cart_id)
        if not cart:
            return jsonify({'message': 'Cart not found'}), 404
            
        if cart.user_id != int(user_id):
            return jsonify({'message': 'Unauthorized to view this cart'}), 403
            
        return jsonify(cart.to_json())
    except Exception as e:
        print(f"Error fetching cart: {str(e)}")
        return jsonify({'message': 'Error fetching cart'}), 500

if __name__ == '__main__':
    with apiSim.app_context():
        db.create_all()
    apiSim.run(debug=True)