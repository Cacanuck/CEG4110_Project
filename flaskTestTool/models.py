from config import db

class recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dish = db.Column(db.String(100), unique=False, nullable=False)
    size = db.Column(db.Integer, unique=False, nullable=False)
    measure = db.Column(db.Integer, unique=False, nullable=False)
    ingredient = db.Column(db.String(100), unique=False, nullable=False)
    instruction = db.Column(db.String(200), unique=False, nullable=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "dish": self.dish,
            "size": self.size,
            "measure": self.measure,
            "ingredient": self.ingredient,
            "instructions": self.instruction,
        }