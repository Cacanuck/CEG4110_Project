from config import db

class Recipe(db.Model):
    __tablename__ = 'recipe'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dish = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('new_user.id'), nullable=False)
    ingredients = db.relationship('Ingredient', back_populates='recipe', lazy='subquery')
    instructions = db.relationship('Instruction', back_populates='recipe', lazy='subquery')
    user = db.relationship('newUser', backref=db.backref('recipes', lazy=True))
    
    def to_json(self):
        return {
            "id": self.id,
            "dish": self.dish,
            "user_id": self.user_id,
            "ingredients": [ingredient.to_json() for ingredient in self.ingredients],
            "instructions": [instruction.to_json() for instruction in self.instructions],
        }
    
class Ingredient(db.Model):
    __tablename__ = 'ingredient'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    measure = db.Column(db.String, nullable=False)
    ingredient = db.Column(db.String(100), nullable=False)
    
    recipe = db.relationship('Recipe', back_populates='ingredients')
    
    def to_json(self):
        return {
            "id": self.id,
            "size": self.size,
            "measure": self.measure,
            "ingredient": self.ingredient,
        }
        
class Instruction(db.Model):
    __tablename__ = 'instruction'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    instruction = db.Column(db.String(200), nullable=False)
    
    recipe = db.relationship('Recipe', back_populates='instructions')
    
    def to_json(self):
        return {
            "id": self.id,
            "instruction": self.instruction,
        }

class newUser(db.Model):
    __tablename__ = 'new_user'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email,
            "password": self.password
        }
    
class pantry(db.Model):
    __tablename__= 'pantry'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    units = db.Column(db.String(50), nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "units": self.units
        }

class ShoppingCart(db.Model):
    __tablename__ = 'shopping_cart'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('new_user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    items = db.relationship('CartItem', back_populates='cart', lazy='subquery')
    user = db.relationship('newUser', backref=db.backref('shopping_carts', lazy=True))
    
    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "items": [item.to_json() for item in self.items]
        }

class CartItem(db.Model):
    __tablename__ = 'cart_item'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('shopping_cart.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    
    cart = db.relationship('ShoppingCart', back_populates='items')
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "quantity": self.quantity,
            "unit": self.unit,
            "category": self.category
        }