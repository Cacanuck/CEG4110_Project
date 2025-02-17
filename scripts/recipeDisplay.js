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
  ul.appendChild(createNavLink("#", "CartLogo.svg", "SHopping Cart"));
  ul.appendChild(createNavLink("#", "ProfileLogo.svg", "Profile"));
  nav.appendChild(ul);
}

function createRecipeButton() {
  var button = document.createElement("button");
  button.textContent = "Create Recipe";
  button.id = "createButton";
  button.addEventListener("click", function () {
    window.location.href = "createRecipe.html";
  });
  document.querySelector("section").appendChild(button);
}

function editRecipeButton() {
  var button = document.createElement("button");
  button.textContent = "Edit Recipe";
  button.id = "editButton";
  button.addEventListener("click", function () {
    var selected = document.querySelector(".recipe.selected");
    if (selected) {
      var recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      var recipeEdit = recipes.find((r) => r.dish === selected.textContent);
      localStorage.setItem("editRecipe", JSON.stringify(recipeEdit));
      window.location.href = "createRecipe.html";
    } else {
      alert("Select a Recipe");
    }
  });
  document.querySelector("section").appendChild(button);
}

function deleteRecipeButton() {
  var button = document.createElement("button");
  button.textContent = "Delete Recipe";
  button.id = "deletebutton";
  button.addEventListener("click", function () {
    var selected = document.querySelector(".recipe.selected");
    if (selected) {
      selected.remove();
    } else {
      alert("Select a Recipe");
    }
  });
  document.querySelector("section").appendChild(button);
}

function selectRecipe(event) {
  document
    .querySelectorAll(".recipe")
    .forEach((el) => el.classList.remove("selected"));
  event.target.classList.add("selected");
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

function addRecipe(name) {
  var recipe = document.createElement("div");
  recipe.textContent = name.dish || "Unamed Recipe";
  recipe.classList.add("recipe");
  recipe.addEventListener("click", selectRecipe);
  document.getElementById("recipeList").appendChild(recipe);
}

function createDiv() {
  var div = document.createElement("div");
  div.id = "recipeList";
  var nav = document.querySelector("nav");
  nav.insertAdjacentElement("afterend", div);
}

document.addEventListener("DOMContentLoaded", function () {
  createDiv();
  populateNavLinks();
  createRecipeButton();
  editRecipeButton();
  deleteRecipeButton();
  loadRecipe();
});
