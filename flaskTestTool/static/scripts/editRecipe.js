var stepNum = 0;

function createDishForm() {
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
  form.appendChild(dishInput);
  var allergenDiv = document.createElement("div");
  allergenDiv.classList.add("allergenDiv");
  var allergenLabel = document.createElement("label");
  allergenLabel.textContent = "Contains Allergens: ";
  allergenDiv.appendChild(allergenLabel);
  var allergenInput = document.createElement("input");
  allergenInput.setAttribute("type", "checkbox");
  allergenInput.setAttribute("name", "allergen");
  allergenInput.setAttribute("id", "allergen");
  var allergenText = document.createElement("p");
  allergenText.classList.add("allergenText");
  allergenText.textContent =
    "Known Allergens include: Milk, Eggs, Fish, Shellfish, Tree nuts, Peanuts, Wheat, Soybeans, and Sesame.";
  allergenDiv.appendChild(allergenInput);
  allergenDiv.appendChild(allergenText);
  form.appendChild(allergenDiv);
  main.appendChild(form);
}

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

function createInstructionsForm() {
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

  // Get user data from session storage
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  if (!userData || !userData.id) {
    console.error("No user logged in");
    alert("Please log in to create a recipe");
    window.location.href = "/index";
    return;
  }

  const param = new URLSearchParams(window.location.search);
  const recipeId = param.get("id");

  if (!recipeId) {
    alert("Recipe ID not found");
    return;
  }

  var recipeData = {
    dish: "",
    ingredients: [],
    instructions: [],
    user_id: userData.id, // Add user_id to the recipe data
    allergen: "",
  };

  var dishInput = document.querySelector(".dishForm input[name='dish']");
  if (!dishInput.value.trim()) {
    alert("Please enter a dish name");
    return;
  }
  recipeData.dish = dishInput.value;

  // Collect ingredients
  var ingredientForms = document.querySelectorAll(".ingredientForm");
  if (ingredientForms.length === 0) {
    alert("Please add at least one ingredient");
    return;
  }
  ingredientForms.forEach((form) => {
    var size = form.querySelector("input[name='size']").value;
    var measure = form.querySelector("input[name='measure']").value;
    var ingredient = form.querySelector("input[name='ingredient']").value;
    if (!size || !measure || !ingredient) {
      alert("Please fill in all ingredient fields");
      return;
    }
    recipeData.ingredients.push({
      size: parseFloat(size),
      measure: measure.trim(),
      ingredient: ingredient.trim(),
    });
  });

  // Collect instructions
  var instructionForms = document.querySelectorAll(".instructionForm");
  if (instructionForms.length === 0) {
    alert("Please add at least one instruction step");
    return;
  }
  instructionForms.forEach((form) => {
    var step = form.querySelector("input[name='step']").value;
    if (!step.trim()) {
      alert("Please fill in all instruction steps");
      return;
    }
    recipeData.instructions.push(step.trim());
  });

  var allergenInput = document.querySelector("#allergen");
  recipeData.allergen = allergenInput.checked ? 1 : 0;

  // Send the recipe data to the server
  fetch(`/updateRecipe/${recipeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "User-Id": userData.id, // Add user ID to headers as well
    },
    body: JSON.stringify(recipeData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message || "Failed to save recipe");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Recipe saved successfully:", data);
      alert("Recipe saved successfully!");
      window.location.href = "/recipeDisplay";
    })
    .catch((error) => {
      console.error("Error saving recipe:", error);
      alert("Error saving recipe: " + error.message);
    });
}

async function loadRecipe() {
  const param = new URLSearchParams(window.location.search);
  const recipeId = param.get("id");

  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (!userData || !userData.id) {
      alert("Please log in to edit this recipe");
      window.location.href = "/index";
      return;
    }

    const response = await fetch(`/editRecipe/${recipeId}`, {
      method: "GET",
      headers: {
        "User-Id": userData.id,
      },
    });
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message || "Failed to save recipe");
      });
    }
    const recipeData = await response.json();

    document.querySelector(".dishForm input[name='dish']").value =
      recipeData.dish;

    recipeData.ingredients.forEach((ing) => {
      const input = createIngredientForm();
      const form = input.closest("form");
      form.querySelector("input[name='size']").value = ing.size;
      form.querySelector("input[name='measure']").value = ing.measure;
      form.querySelector("input[name='ingredient']").value = ing.ingredient;
    });
    recipeData.instructions.forEach((stepObj) => {
      let stepText = "";

      if (typeof stepObj === "string") {
        stepText = stepObj;
      } else if (stepObj && typeof stepObj.instruction === "string") {
        stepText = stepObj.instruction;
      } else {
        console.warn("Unexpected instruction format:", stepObj);
        return;
      }

      let stepInput = createInstructionsForm();
      stepInput.value = stepText;
    });

    const allergenInput = document.querySelector("input[name='allergen']");
    if (recipeData.allergen === 1) {
      allergenInput.checked = true;
    } else {
      allergenInput.checked = false;
    }
  } catch (error) {
    console.error("Error loading recipe", error);
    alert("Could not load recipe");
  }
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
  createDishForm();
  populateHeading("Ingredients", "section");
  populateHeading("Instructions", ".instructionDiv");
  loadRecipe();
  createNav();
});
