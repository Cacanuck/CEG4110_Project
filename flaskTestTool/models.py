from config import db

class recipe(db.Model):
    __tablename__ = 'recipe'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dish = db.Column(db.String(100), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    measure = db.Column(db.Integer, nullable=False)
    ingredient = db.Column(db.String(100), nullable=False)
    instruction = db.Column(db.String(200), nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "dish": self.dish,
            "size": self.size,
            "measure": self.measure,
            "ingredient": self.ingredient,
            "instructions": self.instruction,
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