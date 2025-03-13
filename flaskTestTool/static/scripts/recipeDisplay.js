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

function createRecipeButton() {
  var button = document.createElement("button");
  button.textContent = "Create Recipe";
  button.id = "createButton";
  button.addEventListener("click", function () {
    window.location.href = "createRecipe";
  });
  document.querySelector("section").appendChild(button);
}

function editRecipeButton(recipeName) {
  var button = document.createElement("button");
  button.textContent = "Edit";
  button.classList.add("editButton");
  button.addEventListener("click", function () {
    var recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    var recipeEdit = recipes.find((r) => r.dish === recipeName);
    if (recipeEdit) {
      localStorage.setItem("editRecipe", JSON.stringify(recipeEdit));
      window.location.href = "editRecipe";
    }
  });
  return button;
}

function deleteRecipeButton(recipeName, recipeElement) {
  var button = document.createElement("button");
  button.textContent = "Delete";
  button.classList.add("deleteButton");
  button.addEventListener("click", function () {
    var recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes = recipes.filter((recipe) => recipe.dish !== recipeName);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    recipeElement.remove();
  });
  return button;
}

function loadRecipe() {
  var recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  if (recipes.length === 0) {
    console.log("No Recipes");
    return;
  }
  recipes.forEach((recipe) => {
    addRecipe(recipe);
  });
}

function addRecipe(recipe) {
  var recipeDiv = document.createElement("div");
  recipeDiv.classList.add("recipe");
  var recipeText = document.createElement("span");
  recipeText.classList.add("recipeSpan");
  recipeText.textContent = recipe.dish || "Unnamed Recipe";
  recipeDiv.appendChild(recipeText);
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
      ? recipe.instructions
      : [recipe.instructions]
  );
  recipeDiv.appendChild(expansionPanel);
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  var editButton = editRecipeButton(recipe.dish);
  var deleteButton = deleteRecipeButton(recipe.dish, recipeDiv);
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

document.addEventListener("DOMContentLoaded", function () {
  createDiv();
  createNav();
  createHeading();
  createRecipeButton();
  loadRecipe();
});
