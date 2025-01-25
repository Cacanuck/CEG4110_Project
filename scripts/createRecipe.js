function createIngredientForm() {
  var section = document.querySelector("section");
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/submit");

  var sizeLabel = document.createElement("label");
  sizeLabel.textContent = "Amount: ";
  form.appendChild(sizeLabel);
  var sizeInput = document.createElement("input");
  sizeInput.setAttribute("type", "text");
  sizeInput.setAttribute("name", "size");
  form.appendChild(sizeInput);

  var measureLabel = document.createElement("label");
  measureLabel.textContent = "Measure: ";
  form.appendChild(measureLabel);
  var measureInput = document.createElement("input");
  measureInput.setAttribute("type", "text");
  measureInput.setAttribute("name", "measure");
  form.appendChild(measureInput);

  var ingredientLabel = document.createElement("label");
  ingredientLabel.textContent = "Ingredient: ";
  form.appendChild(ingredientLabel);
  var ingredientInput = document.createElement("input");
  ingredientInput.setAttribute("type", "text");
  ingredientInput.setAttribute("name", "ingredient");
  form.appendChild(ingredientInput);

  section.appendChild(form);

  return sizeInput;
}

document.addEventListener("keydown", function(event) {
    if (event.key == 'Enter') {
        event.preventDefault();

        var input = document.activeElement;
        if (input && input.tagName === 'INPUT') {
            var newInput = createIngredientForm();
            newInput.focus();
        }
    }
})

document.addEventListener("DOMContentLoaded", function () {
    createIngredientForm();
});
