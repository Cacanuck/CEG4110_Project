from config import db

class Recipe(db.Model):
    __tablename__ = 'recipe'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dish = db.Column(db.String(100), nullable=False)
    ingredients = db.relationship('Ingredient', back_populates='recipe', lazy='subquery')
    instructions = db.relationship('Instruction', back_populates='recipe', lazy='subquery')
    
    def to_json(self):
        return {
            "id": self.id,
            "dish": self.dish,
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