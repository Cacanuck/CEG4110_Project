const APIURL = 'http://127.0.0.1:5000';

async function fetchRecipes() {
  try {
    const response = await fetch(`${APIURL}/getRecipes`);
    const recipes = await response.json();
    console.log("Fetched recipes:", recipes);
    recipes.forEach(addRecipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

async function createRecipe() {
  window.location.href = "createRecipe";
}

async function deleteRecipe(recipeId, recipeElement) {
  try {
    await fetch(`${APIURL}/deleteRecipe/${recipeId}`, { method: 'DELETE' });
    recipeElement.remove();
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
}

function createNav() {
  const navLinks = [
    { text: "Home", href: "index" },
    { text: "Recipes", href: "recipeDisplay" },
    { text: "Pantry", href: "pantry" },
    { text: "Carts", href: "shoppingCart" },
  ];
  const nav = document.querySelector("nav");
  nav.classList.add("navbar");
  const ul = document.createElement("ul");
  ul.classList.add("nav-links");

  navLinks.forEach(({ text, href }) => {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    if (text === "Recipes") a.classList.add("active");
    ul.appendChild(a);
  });
  
  nav.appendChild(ul);
}

function addRecipe(recipe) {
  const recipeDiv = document.createElement("div");
  recipeDiv.classList.add("recipe");

  const recipeText = document.createElement("span");
  recipeText.textContent = recipe.dish || "Unnamed Recipe";
  recipeDiv.appendChild(recipeText);

  if (recipe.ingredients && recipe.ingredients.length > 0) {
    const ingredientList = document.createElement("ul");
    recipe.ingredients.forEach(({ size, measure, ingredient }) => {
      const li = document.createElement("li");
      li.textContent = `${size} ${measure} ${ingredient}`;
      ingredientList.appendChild(li);
    });
    recipeDiv.appendChild(ingredientList);
  }

  const expansionPanel = createExpansionPanel(recipe.instructions);
  recipeDiv.appendChild(expansionPanel);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("editButton");
  editButton.addEventListener("click", () => {
    window.location.href = `editRecipe?id=${recipe.id}`;
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", () => deleteRecipe(recipe.id, recipeDiv));

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);
  recipeDiv.appendChild(buttonContainer);

  document.getElementById("recipeList").appendChild(recipeDiv);
}

function createExpansionPanel(instructions) {
  const expansionDiv = document.createElement("div");
  expansionDiv.classList.add("expansionDiv");
  
  const button = document.createElement("button");
  button.classList.add("expansionButton", "collapsed");
  button.textContent = "Click for Recipe";
  
  const expansionContent = document.createElement("div");
  expansionContent.classList.add("expansionContent");
  
  instructions.forEach((step, index) => {
    const stepParagraph = document.createElement("p");
    stepParagraph.textContent = `${index + 1}) ${step}`;
    expansionContent.appendChild(stepParagraph);
  });

  button.addEventListener("click", () => {
    expansionContent.classList.toggle("open");
    button.textContent = expansionContent.classList.contains("open") ? "Click to Hide" : "Click for Recipe";
  });

  expansionDiv.appendChild(button);
  expansionDiv.appendChild(expansionContent);
  return expansionDiv;
}

document.addEventListener("DOMContentLoaded", () => {
  createNav();
  createExpansionPanel();
  fetchRecipes();
});
