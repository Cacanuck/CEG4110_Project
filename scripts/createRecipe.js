var stepNum = 0;

function createIngredientForm() {
  var section = document.querySelector("section");
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/submit");
  form.classList.add("ingredientForm");

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

  var lastForm = document.querySelector(".ingredientForm:last-of-type");
  if (lastForm) {
    lastForm.insertAdjacentElement("afterend", form);
  } else {
    section.appendChild(form);
  }

  return sizeInput;
}

function createInstructionsForm() {
  var section = document.querySelector("section");
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/submit");
  form.setAttribute("data-type", "instructions");
  form.classList.add("instructionForm");

  stepNum++;
  var stepLabel = document.createElement("label");
  stepLabel.textContent = "Step " + stepNum + ": ";
  form.appendChild(stepLabel);
  var stepInput = document.createElement("input");
  stepInput.setAttribute("type", "text");
  stepInput.setAttribute("name", "step");
  form.appendChild(stepInput);

  var lastForm = document.querySelector(".instructionForm:last-of-type");
  if (lastForm) {
    lastForm.insertAdjacentElement("afterend", form);
  } else {
    section.appendChild(form);
  }

  return stepInput;
}

document.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();

    var input = document.activeElement;
    if (input && input.tagName === "INPUT") {
      var parentForm = input.closest("form");
      if (parentForm) {
        if (parentForm.querySelector("[name='size']")) {
          var newInput = createIngredientForm();
          newInput.focus();
        } else if (parentForm.querySelector("[name='step']")) {
          var newInput = createInstructionsForm();
          newInput.focus();
        }
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  createIngredientForm();
  createInstructionsForm();
});
