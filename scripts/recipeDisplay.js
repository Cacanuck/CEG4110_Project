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

document.addEventListener("DOMContentLoaded", function () {
  populateNavLinks();
});
