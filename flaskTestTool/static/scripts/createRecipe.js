var stepNum = 0;
var storedRecipe = localStorage.getItem("editRecipe");
var editRecipe = null;

try {
  if (storedRecipe) {
    editRecipe = JSON.parse(storedRecipe);
  }
} catch (error) {
  console.log("Error with getting editRecipe from localStorage", error);
}

function createDishForm(edit = null) {
  var main = document.querySelector("main");
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
  main.appendChild(form);
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

  var ingredientButton = document.querySelector("#ingredientButton");
  if (!ingredientButton) {
    ingredientButton = document.createElement("button");
    ingredientButton.setAttribute("id", "ingredientButton");
    ingredientButton.textContent = "Add Ingredient";
    ingredientButton.addEventListener("click", function (event) {
      event.preventDefault();
      var newInput = createIngredientForm();
      newInput.focus();
    });
  }

  var deleteIngredientButton = document.createElement("button");
  deleteIngredientButton.classList.add("deleteIngredientButton");
  deleteIngredientButton.textContent = "Delete Ingredient";
  deleteIngredientButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.remove();
    updateIngredientDeleteButtons();
  });

  form.append(ingredientButton);
  form.append(deleteIngredientButton);

  updateIngredientDeleteButtons();
  return sizeInput;
}

function updateIngredientDeleteButtons() {
  var deleteButtons = document.querySelectorAll(".deleteIngredientButton");
  deleteButtons.forEach((btn, index) => {
    btn.style.display =
      index === deleteButtons.length - 1 ? "none" : "inline-block";
  });
}

function createInstructionsForm(edit = null) {
  var div = document.querySelector(".instructionDiv");
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/submit");
  form.setAttribute("data-type", "instructions");
  form.classList.add("instructionForm");

  stepNum++;
  var stepLabel = document.createElement("label");
  stepLabel.textContent = "Step " + stepNum + ": ";
  stepLabel.classList.add("stepLabel");
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

  var instructionButton = document.querySelector("#instructionButton");
  if (!instructionButton) {
    instructionButton = document.createElement("button");
    instructionButton.setAttribute("id", "instructionButton");
    instructionButton.textContent = " Add Step";
    instructionButton.addEventListener("click", function (event) {
      event.preventDefault();
      var newInput = createInstructionsForm();
      newInput.focus();
    });
  }

  var deleteInstructionButton = document.createElement("button");
  deleteInstructionButton.classList.add("deleteInstructionButton");
  deleteInstructionButton.textContent = "Delete Step";
  deleteInstructionButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.remove();
    stepNum--;
    updateStepNum();
    updateInstructionDeleteButtons();
  });

  form.append(instructionButton);
  form.append(deleteInstructionButton);

  if (edit && edit.instructions.length >= stepNum) {
    stepInput.value = edit.instructions[stepNum - 1];
  }

  if (!document.querySelector("#submitButton")) {
    var submitButton = document.createElement("button");
    submitButton.setAttribute("id", "submitButton");
    submitButton.textContent = "Create Recipe";
    submitButton.addEventListener("click", function (event) {
      submitForm(event);
      window.location.href = "recipeDisplay";
    });
    div.appendChild(submitButton);
  }

  updateInstructionDeleteButtons();
  return stepInput;
}

function updateStepNum() {
  var steps = document.querySelectorAll(".instructionForm");
  steps.forEach((form, index) => {
    form.querySelector(".stepLabel").textContent = "Step " + (index + 1) + ": ";
  });
}

function updateInstructionDeleteButtons() {
  var deleteButtons = document.querySelectorAll(".deleteInstructionButton");
  deleteButtons.forEach((btn, index) => {
    btn.style.display =
      index === deleteButtons.length - 1 ? "none" : "inline-block";
  });
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
  var storedEditRecipe = localStorage.getItem("editRecipe");
  if (storedEditRecipe) {
    var editRecipe = JSON.parse(storedEditRecipe);
    var index = recipes.findIndex((recipe) => recipe.dish === editRecipe.dish);
    if (index !== -1) {
      recipes[index] = recipeData;
    }
    localStorage.removeItem("editRecipe");
  } else {
    recipes.push(recipeData);
  }
  localStorage.setItem("recipes", JSON.stringify(recipes));

  window.location.href = "recipeDisplay";
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

function createNav() {
  var navLinks = [
    { text: "Home", href: "index" },
    { text: "Recipes", href: "recipeDisplay" },
    { text: "Pantry", href: "pantry" },
    { text: "Carts", href: "shoppingCart" },
  ];
  var nav = document.querySelector("nav");
  nav.classList.add("navbar");
  var ul = document.createElement("ul");
  ul.classList.add("nav-links");
  var brandDiv = document.createElement("div");
  brandDiv.classList.add("nav-brand");

  var logoImg = document.createElement("img");
  logoImg.setAttribute("class", "logo");
  logoImg.setAttribute("src", "/static/images/GrumpyLogo.svg");
  logoImg.setAttribute("alt", "GrumpyChef Logo");
  logoImg.setAttribute("width", "40");
  logoImg.setAttribute("height", "40");
  brandDiv.appendChild(logoImg);

  var brandText = document.createElement("span");
  brandText.textContent = "GrumpyChef";
  brandDiv.appendChild(brandText);

  navLinks.forEach((element) => {
    var a = document.createElement("a");
    a.textContent = element.text;
    a.href = element.href;
    if (element.text === "Recipes") {
      a.classList.add("active");
    }
    ul.appendChild(a);
  });

  var profileDiv = document.createElement("div");
  profileDiv.classList.add("nav-profile");
  var profileLink = document.createElement("a");
  profileLink.href = "profile";
  profileLink.classList.add("profile-link");
  var profileText = document.createElement("span");
  profileText.textContent = "Profile";
  profileLink.appendChild(profileText);

  var profileImg = document.createElement("img");
  profileImg.setAttribute("class", "profile-icon");
  profileImg.setAttribute("src", "/static/images/ProfileLogo.svg");
  profileImg.setAttribute("alt", "Profile Icon");
  profileImg.setAttribute("width", "30");
  profileImg.setAttribute("height", "30");
  profileLink.appendChild(profileImg);
  profileDiv.appendChild(profileLink);

  nav.appendChild(brandDiv);
  nav.appendChild(ul);
  nav.appendChild(profileDiv);
}

function createHeading(text) {
  var heading = document.createElement("h2");
  heading.textContent = text;
  return heading;
}

function populateHeading(headingText, locationTag) {
  var heading = createHeading(headingText);
  var location = document.querySelector(locationTag);
  location.appendChild(heading);
}

document.addEventListener("DOMContentLoaded", function () {
  populateHeading("Name of Dish", "main");
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
  createNav();
  localStorage.removeItem("editRecipe");
});
