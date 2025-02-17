var stepNum = 0;
var editRecipe = JSON.parse(localStorage.getItem("editRecipe"));

function createDishForm(edit = null) {
  var header = document.querySelector("header");
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/submit");
  form.setAttribute("data-type", "dish");
  form.classList.add("dishForm");

  var dishLabel = document.createElement("label");
  dishLabel.textContent = "Dish Name: ";
  form.appendChild(dishLabel);
  var dishInput = document.createElement("input");
  dishInput.setAttribute("type", "text");
  dishInput.setAttribute("name", "dish");
  dishInput.classList.add("Dish", "input");
  if (edit) {
    dishInput.value = edit.dish;
  }
  form.appendChild(dishInput);
  header.appendChild(form);
}

function createIngredientForm(edit = null) {
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
  sizeInput.classList.add("Amount", "input");
  form.appendChild(sizeInput);

  var measureLabel = document.createElement("label");
  measureLabel.textContent = "Measure: ";
  form.appendChild(measureLabel);
  var measureInput = document.createElement("input");
  measureInput.setAttribute("type", "text");
  measureInput.setAttribute("name", "measure");
  measureInput.classList.add("Measure", "input");
  form.appendChild(measureInput);

  var ingredientLabel = document.createElement("label");
  ingredientLabel.textContent = "Ingredient: ";
  form.appendChild(ingredientLabel);
  var ingredientInput = document.createElement("input");
  ingredientInput.setAttribute("type", "text");
  ingredientInput.setAttribute("name", "ingredient");
  ingredientInput.classList.add("Ingredient", "input");
  form.appendChild(ingredientInput);

  if (edit) {
    var index = document.querySelectorAll(".ingredientForm").length;
    if (edit.ingredients[index]) {
      sizeInput.value = edit.ingredients[index].size;
      measureInput.value = edit.ingredients[index].measure;
      ingredientInput.value = edit.ingredients[index].ingredient;
    }
  }

  var lastForm = document.querySelector(".ingredientForm:last-of-type");
  if (lastForm) {
    lastForm.insertAdjacentElement("afterend", form);
  } else {
    section.appendChild(form);
  }

  return sizeInput;
}

function createInstructionsForm(edit = null) {
  var div = document.querySelector("div");
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
  stepInput.classList.add("Step", "input");
  form.appendChild(stepInput);

  var lastForm = document.querySelector(".instructionForm:last-of-type");
  if (lastForm) {
    lastForm.insertAdjacentElement("afterend", form);
  } else {
    div.appendChild(form);
  }

  if (edit) {
    var index = document.querySelectorAll(".instructionForm").length;
    if (edit.instructions[index]) {
      stepInput.value = edit.instructions[index];
    }
  }

  if (!document.querySelector("#submitButton")) {
    var submitButton = document.createElement("button");
    submitButton.setAttribute("id", "submitButton");
    submitButton.textContent = "Create Recipe";
    submitButton.addEventListener("click", function (event) {
      submitForm(event);
      window.location.href = "recipeDisplay.html";
    });
    div.appendChild(submitButton);
  }

  return stepInput;
}

function submitForm(event) {
  event.preventDefault();

  var recipeData = {
    dish: "",
    ingredients: [],
    instructions: [],
  };

  var dishInput = document.querySelector(".dishForm input[name='dish']");
  recipeData.dish = dishInput.value;

  document.querySelectorAll(".ingredientForm").forEach((form) => {
    var size = form.querySelector("input[name='size']").value;
    var measure = form.querySelector("input[name='measure']").value;
    var ingredient = form.querySelector("input[name='ingredient']").value;
    recipeData.ingredients.push({ size, measure, ingredient });
  });

  document.querySelectorAll(".instructionForm").forEach((form) => {
    var step = form.querySelector("input[name='step']").value;
    recipeData.instructions.push(step);
  });

  var recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  var editRecipe = JSON.parse(localStorage.getItem("editRecipe"));
  if (editRecipe) {
    var index = recipes.findIndex((recipe) => recipe.dish === editRecipe.dish);
    if (index !== -1) {
      recipes[index] = recipeData;
    }
    localStorage.removeItem("editRecipe");
  } else {
    recipes.push(recipeData);
  }
  localStorage.setItem("recipes", JSON.stringify(recipes));

  window.location.href = "recipeDisplay.html";
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

function createNavLink(href, imgSrc = null, navTitle) {
  var listItem = document.createElement("li");
  var link = document.createElement("a");
  link.href = href;
  link.title = navTitle;
  if (imgSrc) {
    var image = document.createElement("img");
    image.src = "./images/" + imgSrc;
    image.classList.add("navImage");
    link.appendChild(image);
  }
  listItem.appendChild(link);
  return listItem;
}

function populateNavLinks() {
  var nav = document.querySelector("nav");
  var ul = document.createElement("ul");
  ul.appendChild(createNavLink("index.html", "GrumpyLogo.svg", "Home"));
  ul.appendChild(createNavLink("#", "InventoryLogo.svg", "Inventory"));
  ul.appendChild(
    createNavLink("recipeDisplay.html", "RecipeLogo.svg", "Recipes")
  );
  ul.appendChild(createNavLink("#", "CartLogo.svg", "Shopping Cart"));
  ul.appendChild(createNavLink("#", "ProfileLogo.svg", "Profile"));
  nav.appendChild(ul);
}

function createHeading(text) {
  var heading = document.createElement("h1");
  heading.textContent = text;
  return heading;
}

function populateHeading(headingText, locationTag) {
  var heading = createHeading(headingText);
  var location = document.querySelector(locationTag);
  location.appendChild(heading);
}

document.addEventListener("DOMContentLoaded", function () {
  populateHeading("Name of Dish", "header");
  createDishForm(editRecipe);
  populateHeading("Ingredients", "section");
  if (editRecipe && editRecipe.ingredients.length > 0) {
    editRecipe.ingredients.forEach(() => createIngredientForm(editRecipe));
  } else {
    createIngredientForm();
  }
  populateHeading("Instructions", "div");
  if (editRecipe && editRecipe.instructions.length > 0) {
    editRecipe.instructions.forEach(() => createInstructionsForm(editRecipe));
  } else {
    createInstructionsForm();
  }
  populateNavLinks();
  localStorage.removeItem("editRecipe");
});
