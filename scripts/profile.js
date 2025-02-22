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
      ul.appendChild(a);
    });
  
    var profileDiv = document.createElement("div");
    profileDiv.classList.add("nav-profile");
    var profileLink = document.createElement("a");
    profileLink.href = "profile.html";
    profileLink.classList.add("profile-link", "active");
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

  document.addEventListener("DOMContentLoaded", function () {
    createNav();
  });