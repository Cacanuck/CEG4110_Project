function createNav() {
  var navLinks = [
    { text: "Home", href: "index.html" },
    { text: "Recipes", href: "recipeDisplay.html" },
    { text: "Inventory", href: "inventory.html" },
    { text: "Carts", href: "shoppingCart.html" },
  ];
  var nav = document.querySelector("nav");
  nav.classList.add("navbar");
  var ul = document.createElement("ul");
  ul.classList.add("nav-links");
  var brandDiv = document.createElement("div");
  brandDiv.classList.add("nav-brand");

  var logoImg = document.createElement("img");
  logoImg.setAttribute("class", "logo");
  logoImg.setAttribute("src", "./images/GrumpyLogo.svg");
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
  profileLink.href = "profile.html";
  profileLink.classList.add("profile-link");
  var profileText = document.createElement("span");
  profileText.textContent = "Profile";
  profileLink.appendChild(profileText);

  var profileImg = document.createElement("img");
  profileImg.setAttribute("class", "profile-icon");
  profileImg.setAttribute("src", "./images/ProfileLogo.svg");
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
      window.location.href = "editRecipe.html";
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
      var recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      var recipeName = selected.textContent.trim();
      recipes = recipes.filter(recipe => recipe.dish.trim() !== recipeName);
      localStorage.setItem("recipes", JSON.stringify(recipes));
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
  var main = document.querySelector("main");
  main.insertAdjacentElement("afterend", div);
}

function createHeading() {
  var h1 = document.createElement("h1");
  h1.textContent = "My Recipes";
  var main = document.querySelector("main");
  main.appendChild(h1);
}

document.addEventListener("DOMContentLoaded", function () {
  createDiv();
  createNav();
  createHeading();
  createRecipeButton();
  editRecipeButton();
  deleteRecipeButton();
  loadRecipe();
});
