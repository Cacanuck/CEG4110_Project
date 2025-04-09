async function loadRecipes() {
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const response = await fetch(`/getRecipes`, {
      headers: {
        "User-Id": userData.id,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: Failed to fetch recipes`);
    }

    const recipes = await response.json();
    console.log("Fetched recipes:", recipes);

    if (!Array.isArray(recipes) || recipes.length === 0) {
      console.warn("No recipes found for this user.");
      return;
    }

    recipes.forEach(addRecipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

async function deleteRecipe(recipeId) {
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const response = await fetch(`/deleteRecipe/${recipeId}`, {
      method: "DELETE",
      headers: {
        "User-Id": userData.id,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete recipe");
    }

    var recipeDiv = document.getElementById(recipeId);
    if (recipeDiv) {
      recipeDiv.remove();
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
}

function createNav() {
  var navLinks = [
    { text: "Home", href: "home" },
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

function createRecipeButton() {
  var button = document.createElement("button");
  button.textContent = "Create Recipe";
  button.id = "createButton";
  button.addEventListener("click", async function () {
    const response = await fetch("/createRecipe", { method: "GET" });
    if (response.ok) {
      window.location.href = "/createRecipe";
    } else {
      console.error("Failed to load the recipe creation page");
    }
  });
  document.querySelector("section").appendChild(button);
}

function editRecipeButton(recipeId) {
  var button = document.createElement("button");
  button.textContent = "Edit";
  button.classList.add("editButton");
  button.addEventListener("click", async function () {
    window.location.href = `editRecipe?id=${recipeId}`;
  });
  return button;
}

function deleteRecipeButton(recipeId) {
  var button = document.createElement("button");
  button.textContent = "Delete";
  button.classList.add("deleteButton");
  button.addEventListener("click", async function () {
    await deleteRecipe(recipeId);
  });
  return button;
}

function scaleRecipeButton(recipeId) {
  var button = document.createElement("button");
  button.textContent = "Scale";
  button.classList.add("scaleButton");
  button.addEventListener("click", async function () {
    scaleModal(recipeId);
  });
  return button;
}

function createConversionRecipeButton() {
  var button = document.createElement("button");
  button.textContent = "Convert to Metric";
  button.classList.add("convertButton", "imperial");
  var main = document.querySelector("main");
  main.appendChild(button);
  button.addEventListener("click", async function () {
    button.classList.toggle("metric");
    if (button.classList.contains("metric")) {
      button.textContent = "Convert to Imperial";
      button.classList.remove("imperial");
      button.classList.add("metric");
    } else {
      button.textContent = "Convert to Metric";
      button.classList.remove("metric");
      button.classList.add("imperial");
    }
  });
  return button;
}

async function scaleModal(recipeId) {
  var existingModal = document.querySelector(".modal");
  if (existingModal) {
    existingModal.remove();
  }
  var modal = document.createElement("div");
  modal.classList.add("modal");
  var overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.addEventListener("click", function () {
    modal.remove();
    overlay.remove();
  });
  var modalHeader = document.createElement("h2");
  modalHeader.classList.add("modalHeader");
  var title = document.createElement("div");
  title.classList.add("title");
  title.textContent = "Scale Recipe";
  var modalBody = document.createElement("div");
  modalBody.classList.add("modalBody");
  var closeButton = document.createElement("button");
  closeButton.classList.add("closeModalButton");
  closeButton.innerHTML = "&times";
  closeButton.addEventListener("click", function () {
    modal.remove();
    overlay.remove();
  });
  modalHeader.appendChild(title);
  modalHeader.appendChild(closeButton);
  var label = document.createElement("label");
  label.classList.add("modalLabel");
  label.setAttribute("for", "scaleFactor");
  label.textContent = "Enter scale factor:";
  label.classList.add("scaleLabel");
  var input = document.createElement("input");
  input.classList.add("modalInput");
  input.type = "number";
  input.id = "scaleFactor";
  input.min = "0.5";
  input.step = "0.5";
  input.value = "1";
  var applyButton = document.createElement("button");
  applyButton.classList.add("applyButton");
  applyButton.textContent = "Apply Scale";
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const response = await fetch(`/getRecipe/${recipeId}`, {
      headers: {
        "User-Id": userData.id,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: Failed to fetch recipes}`);
    }

    const recipe = await response.json();

    const ingredientList = document.createElement("ul");
    ingredientList.classList.add("modalIngredientList");

    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = `${ingredient.size} ${ingredient.measure} ${ingredient.ingredient}`;
      ingredientList.appendChild(li);
    });

    const instructionsList = document.createElement("div");
    instructionsList.classList.add("modalInstructionsList");

    if (Array.isArray(recipe.instructions)) {
      let stepNum = 1;
      recipe.instructions.forEach((step) => {
        const stepP = document.createElement("p");
        stepP.textContent = `${stepNum++}) ${step.instruction}`;
        instructionsList.appendChild(stepP);
      });
    } else {
      const noInstructions = document.createElement("p");
      noInstructions.textContent = "No Instructions Listed";
      instructionsList.appendChild(noInstructions);
    }
    applyButton.addEventListener("click", function () {
      var factor = parseFloat(input.value);
      if (isNaN(factor) || factor <= 0.5) {
        alert("Enter a valid scale factor.");
        return;
      }
      var listItems = ingredientList.querySelectorAll("li");
      listItems.forEach((li, index) => {
        var original = recipe.ingredients[index];
        var newSize = eval(original.size) * factor;
        newSize = newSize % 1 === 0 ? newSize.toFixed(0) : newSize.toFixed(2);
        li.textContent = `${newSize} ${original.measure} ${original.ingredient}`;
      });
    });
    modalBody.appendChild(label);
    modalBody.appendChild(input);
    modalBody.appendChild(applyButton);
    var ingredientsHeader = document.createElement("h3");
    ingredientsHeader.textContent = "Ingredients:";
    ingredientsHeader.classList.add("ingredientModalHeader");
    var instructionsHeader = document.createElement("h3");
    instructionsHeader.textContent = "Instructions:";
    instructionsHeader.classList.add("instructionModalHeader");
    modalBody.appendChild(ingredientsHeader);
    modalBody.appendChild(ingredientList);
    modalBody.appendChild(instructionsHeader);
    modalBody.appendChild(instructionsList);
  } catch (error) {
    console.error("Error loading recipe for scaling:", error);
    const errorText = document.createElement("p");
    errorText.textContent = "Failed to load recipe data.";
    modalBody.appendChild(errorText);
  }
  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}

function addRecipe(recipe) {
  var recipeDiv = document.createElement("div");
  recipeDiv.classList.add("recipe");
  recipeDiv.id = recipe.id;
  var recipeText = document.createElement("span");
  recipeText.classList.add("recipeSpan");
  recipeText.textContent = recipe.dish || "Unnamed Recipe";
  recipeDiv.appendChild(recipeText);
  var allergenSpan = document.createElement("span");
  allergenSpan.classList.add("allergen");
  if (recipe.allergen === 1) {
    allergenSpan.textContent = "Contains Allergen";
  } else {
    allergenSpan.textContent = "";
  }
  recipeDiv.appendChild(allergenSpan);
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    var ingredientList = document.createElement("ul");
    ingredientList.classList.add("ingredientList");
    recipe.ingredients.forEach((ingredient) => {
      var li = document.createElement("li");
      li.textContent = `${ingredient.size} ${ingredient.measure} ${ingredient.ingredient}`;
      ingredientList.appendChild(li);
    });
    recipeDiv.appendChild(ingredientList);
  }
  var expansionContent = document.createElement("div");
  expansionContent.textContent =
    recipe.instructions || "No Instructions Listed";
  var expansionPanel = createExpansionPanel(
    Array.isArray(recipe.instructions)
      ? recipe.instructions.map((step) => step.instruction)
      : [recipe.instructions]
  );
  recipeDiv.appendChild(expansionPanel);
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  var scaleButton = scaleRecipeButton(recipe.id);
  var editButton = editRecipeButton(recipe.id);
  var deleteButton = deleteRecipeButton(recipe.id);
  buttonContainer.appendChild(scaleButton);
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);
  recipeDiv.appendChild(buttonContainer);
  document.getElementById("recipeList").appendChild(recipeDiv);
}

function createDiv() {
  var div = document.createElement("div");
  div.id = "recipeList";
  var main = document.querySelector("main");
  main.insertAdjacentElement("afterend", div);
}

function createHeading() {
  var h1 = document.createElement("h1");
  h1.textContent = "My Recipes";
  var main = document.querySelector("main");
  main.appendChild(h1);
}

function createExpansionPanel(instructions) {
  var expansionDiv = document.createElement("div");
  expansionDiv.classList.add("expansionDiv");
  var button = document.createElement("button");
  button.classList.add("expansionButton", "collapsed");
  var span = document.createElement("span");
  span.classList.add("buttonSpan");
  span.textContent = "Click for Recipe";
  expansionDiv.appendChild(span);
  var expansionContent = document.createElement("div");
  expansionContent.classList.add("expansionContent");
  var stepNum = 1;
  if (Array.isArray(instructions)) {
    instructions.forEach((step) => {
      var stepParagraph = document.createElement("p");
      stepParagraph.textContent = stepNum + ") " + step;
      stepNum++;
      expansionContent.appendChild(stepParagraph);
    });
  } else {
    var noInstructions = document.createElement("p");
    noInstructions.textContent = "No Instructions Listed";
    expansionContent.appendChild(noInstructions);
  }
  button.addEventListener("click", function () {
    expansionContent.classList.toggle("open");
    button.classList.toggle("open");
    if (expansionContent.classList.contains("open")) {
      expansionContent.style.maxHeight = expansionContent.scrollHeight + "px";
      span.textContent = "Click to Hide";
      button.classList.remove("collapsed");
      button.classList.add("open");
    } else {
      expansionContent.style.maxHeight = null;
      span.textContent = "Click for Recipe";
      button.classList.add("collapsed");
      button.classList.remove("open");
    }
  });
  span.addEventListener("click", function () {
    expansionContent.classList.toggle("open");
    button.classList.toggle("open");
    if (expansionContent.classList.contains("open")) {
      expansionContent.style.maxHeight = expansionContent.scrollHeight + "px";
      span.textContent = "Click to Hide";
      button.classList.remove("collapsed");
      button.classList.add("open");
    } else {
      expansionContent.style.maxHeight = null;
      span.textContent = "Click for Recipe";
      button.classList.add("collapsed");
      button.classList.remove("open");
    }
  });
  expansionDiv.appendChild(button);
  expansionDiv.appendChild(expansionContent);

  return expansionDiv;
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log("Retrieved userData:", userData); // Debugging

  if (!userData) {
    //  If not logged in, redirect to login page
    window.location.href = "/index";
    return;
  }

  createDiv();
  createNav();
  createHeading();
  createConversionRecipeButton();
  createExpansionPanel();
  createRecipeButton();
  loadRecipes();
});
